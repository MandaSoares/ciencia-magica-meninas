import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

/**
 * SECURITY NOTE: This hook provides client-side role checking for UI/UX purposes ONLY.
 * 
 * All admin/moderator operations are protected by Row Level Security (RLS) policies
 * in the database. These policies use the has_role() function to verify user permissions
 * server-side before allowing any privileged operations.
 * 
 * Protected tables include:
 * - user_roles: Admin-only management
 * - blog_posts, learning_path_content, modules_content, experiments_content, career_areas_content: admin/editor
 * - experiment_comments: Delete by owner or admin
 * 
 * Even if a malicious user bypasses client-side checks, RLS will block unauthorized operations.
 */
export const useAdminCheck = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditor, setIsEditor] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkRole = async () => {
      if (!user) {
        setIsAdmin(false);
        setIsEditor(false);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error checking role:', error);
        setLoading(false);
        return;
      }

      const roles = (data || []).map((r) => String(r.role));
      const admin = roles.includes('admin');
      setIsAdmin(admin);
      setIsEditor(admin || roles.includes('editor'));
      setLoading(false);
    };

    checkRole();
  }, [user]);

  return {
    isAdmin,
    /** editora ou administradora */
    isEditor,
    /** pode criar/editar conteúdo (editora ou administradora) */
    canEditContent: isEditor,
    /** @deprecated use isEditor (o papel "moderator" virou "editor") */
    isModerator: isEditor,
    loading,
  };
};
