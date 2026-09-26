import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Comment {
  id: string;
  user_id: string;
  experiment_id: string;
  parent_id: string | null;
  content: string;
  likes: number;
  created_at: string;
  user_name?: string;
  user_profile_image?: string | null;
  user_liked?: boolean;
  replies?: Comment[];
}

export const useComments = (experimentId: string) => {
  const { user, profile } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = useCallback(async () => {
    const { data: commentsData, error } = await supabase
      .from('experiment_comments')
      .select('*')
      .eq('experiment_id', experimentId)
      .is('parent_id', null)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching comments:', error);
      return;
    }

    // Collect all user IDs from comments and replies to fetch profile info securely
    const allComments = commentsData || [];
    
    // Fetch all replies at once
    const commentIds = allComments.map(c => c.id);
    const { data: allReplies } = commentIds.length > 0 
      ? await supabase
          .from('experiment_comments')
          .select('*')
          .in('parent_id', commentIds)
          .order('created_at', { ascending: true })
      : { data: [] };

    // Collect all unique user IDs from comments and replies
    const userIds = new Set<string>();
    allComments.forEach(c => userIds.add(c.user_id));
    (allReplies || []).forEach(r => userIds.add(r.user_id));
    
    // Use secure RPC function to get only name and profile_image (no email/age exposure)
    const userIdsArray = Array.from(userIds);
    const { data: profilesData } = userIdsArray.length > 0
      ? await supabase.rpc('get_comment_user_info', { user_ids: userIdsArray })
      : { data: [] };
    
    // Create a map for quick profile lookup
    const profilesMap = new Map<string, { name: string; profile_image: string | null }>();
    (profilesData || []).forEach((p: { id: string; name: string; profile_image: string | null }) => {
      profilesMap.set(p.id, { name: p.name, profile_image: p.profile_image });
    });

    // Fetch user's likes for all comments and replies
    const allCommentIds = [...allComments.map(c => c.id), ...(allReplies || []).map(r => r.id)];
    let userLikesSet = new Set<string>();
    if (user && allCommentIds.length > 0) {
      const { data: likesData } = await supabase
        .from('comment_likes')
        .select('comment_id')
        .eq('user_id', user.id)
        .in('comment_id', allCommentIds);
      (likesData || []).forEach(l => userLikesSet.add(l.comment_id));
    }

    // Build replies map
    const repliesMap = new Map<string, typeof allReplies>();
    (allReplies || []).forEach(reply => {
      const parentId = reply.parent_id;
      if (!repliesMap.has(parentId)) {
        repliesMap.set(parentId, []);
      }
      repliesMap.get(parentId)!.push(reply);
    });

    // Build the final comments with replies
    const commentsWithReplies = allComments.map(comment => {
      const profile = profilesMap.get(comment.user_id);
      const commentReplies = repliesMap.get(comment.id) || [];
      
      const repliesWithProfiles = commentReplies.map(reply => {
        const replyProfile = profilesMap.get(reply.user_id);
        return {
          ...reply,
          user_name: replyProfile?.name || 'Usuária',
          user_profile_image: replyProfile?.profile_image || null,
          user_liked: userLikesSet.has(reply.id)
        };
      });

      return {
        ...comment,
        user_name: profile?.name || 'Usuária',
        user_profile_image: profile?.profile_image || null,
        user_liked: userLikesSet.has(comment.id),
        replies: repliesWithProfiles
      };
    });

    setComments(commentsWithReplies);
    setLoading(false);
  }, [experimentId, user]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const addComment = async (content: string, parentId?: string): Promise<{ error: { message?: string } | null }> => {
    if (!user) return { error: { message: 'nao_autenticada' } };

    const { error } = await supabase
      .from('experiment_comments')
      .insert({
        user_id: user.id,
        experiment_id: experimentId,
        parent_id: parentId || null,
        content
      });

    if (!error) {
      fetchComments();
    }
    return { error };
  };

  const deleteComment = async (commentId: string) => {
    if (!user) return false;

    const { data, error } = await supabase
      .from('experiment_comments')
      .delete()
      .eq('id', commentId)
      .select('id');

    // RLS não retorna erro quando nada é apagado: confere se a linha saiu.
    if (!error && data && data.length > 0) {
      fetchComments();
      return true;
    }
    return false;
  };

  const toggleLike = async (commentId: string) => {
    if (!user) return;

    // Check if already liked
    const { data: existingLike } = await supabase
      .from('comment_likes')
      .select('id')
      .eq('comment_id', commentId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (existingLike) {
      // Unlike
      await supabase
        .from('comment_likes')
        .delete()
        .eq('id', existingLike.id);
      // O contador de curtidas é atualizado por trigger no banco.
    } else {
      // Like
      await supabase
        .from('comment_likes')
        .insert({
          user_id: user.id,
          comment_id: commentId
        });

    }

    fetchComments();
  };

  const reportComment = async (commentId: string, reason?: string): Promise<'ok' | 'duplicate' | 'error'> => {
    if (!user) return 'error';
    const { error } = await supabase
      .from('comment_reports' as never)
      .insert({ comment_id: commentId, reporter_id: user.id, reason: reason?.slice(0, 300) || null } as never);
    if (!error) return 'ok';
    if ((error as { code?: string }).code === '23505') return 'duplicate';
    return 'error';
  };

  return {
    comments,
    reportComment,
    loading,
    addComment,
    deleteComment,
    toggleLike,
    userName: profile?.name || 'Usuária',
    userProfileImage: profile?.profile_image || null,
    currentUserId: user?.id || null
  };
};
