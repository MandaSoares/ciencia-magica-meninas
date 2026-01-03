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

    // Fetch replies for each comment
    const commentsWithReplies = await Promise.all(
      (commentsData || []).map(async (comment) => {
        const { data: replies } = await supabase
          .from('experiment_comments')
          .select('*')
          .eq('parent_id', comment.id)
          .order('created_at', { ascending: true });

        // Fetch profiles for all comments
        const { data: commentProfile } = await supabase
          .from('profiles')
          .select('name')
          .eq('id', comment.user_id)
          .maybeSingle();

        // Check if user liked this comment
        let userLiked = false;
        if (user) {
          const { data: likeData } = await supabase
            .from('comment_likes')
            .select('id')
            .eq('comment_id', comment.id)
            .eq('user_id', user.id)
            .maybeSingle();
          userLiked = !!likeData;
        }

        const repliesWithProfiles = await Promise.all(
          (replies || []).map(async (reply) => {
            const { data: replyProfile } = await supabase
              .from('profiles')
              .select('name')
              .eq('id', reply.user_id)
              .maybeSingle();

            let replyUserLiked = false;
            if (user) {
              const { data: likeData } = await supabase
                .from('comment_likes')
                .select('id')
                .eq('comment_id', reply.id)
                .eq('user_id', user.id)
                .maybeSingle();
              replyUserLiked = !!likeData;
            }

            return {
              ...reply,
              user_name: replyProfile?.name || 'Usuária',
              user_liked: replyUserLiked
            };
          })
        );

        return {
          ...comment,
          user_name: commentProfile?.name || 'Usuária',
          user_liked: userLiked,
          replies: repliesWithProfiles
        };
      })
    );

    setComments(commentsWithReplies);
    setLoading(false);
  }, [experimentId, user]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const addComment = async (content: string, parentId?: string) => {
    if (!user) return;

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

      // Decrement likes count
      await supabase.rpc('decrement_likes' as never, { comment_id: commentId } as never);
    } else {
      // Like
      await supabase
        .from('comment_likes')
        .insert({
          user_id: user.id,
          comment_id: commentId
        });

      // Increment likes count
      await supabase.rpc('increment_likes' as never, { comment_id: commentId } as never);
    }

    fetchComments();
  };

  return {
    comments,
    loading,
    addComment,
    toggleLike,
    userName: profile?.name || 'Usuária'
  };
};
