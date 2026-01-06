import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useAdminCheck = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isModerator, setIsModerator] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkRole = async () => {
      if (!user) {
        setIsAdmin(false);
        setIsModerator(false);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('user_roles' as any)
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle() as { data: { role: string } | null; error: any };

      if (error) {
        console.error('Error checking role:', error);
        setLoading(false);
        return;
      }

      const role = data?.role;
      setIsAdmin(role === 'admin');
      setIsModerator(role === 'moderator' || role === 'admin');
      setLoading(false);
    };

    checkRole();
  }, [user]);

  return { isAdmin, isModerator, loading };
};
