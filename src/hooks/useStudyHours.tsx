import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

// Average time estimates in hours for each content type
const LESSON_HOURS = 0.25; // 15 minutes per lesson
const MODULE_HOURS = 2; // 2 hours per module
const EXPERIMENT_HOURS = 0.5; // 30 minutes per experiment

export const useStudyHours = (selectedArea: string) => {
  const { user } = useAuth();
  const [studyHours, setStudyHours] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const calculateStudyHours = async () => {
      if (!user) {
        setStudyHours(0);
        setLoading(false);
        return;
      }

      try {
        // Fetch completed lessons count
        const { count: lessonsCount } = await supabase
          .from('completed_lessons')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('stem_area', selectedArea);

        // Fetch completed modules count
        const { count: modulesCount } = await supabase
          .from('completed_modules')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('stem_area', selectedArea);

        // Fetch completed experiments count
        const { count: experimentsCount } = await supabase
          .from('completed_experiments')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('stem_area', selectedArea);

        // Calculate total hours
        const totalHours = 
          (lessonsCount || 0) * LESSON_HOURS +
          (modulesCount || 0) * MODULE_HOURS +
          (experimentsCount || 0) * EXPERIMENT_HOURS;

        setStudyHours(totalHours);
      } catch (error) {
        console.error('Error calculating study hours:', error);
        setStudyHours(0);
      } finally {
        setLoading(false);
      }
    };

    calculateStudyHours();
  }, [user, selectedArea]);

  return { studyHours, loading };
};
