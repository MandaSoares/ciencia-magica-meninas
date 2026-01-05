import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Progress {
  stemArea: string;
  points: number;
  level: number;
  currentLesson: number;
}

interface UserStats {
  modulesCompleted: number;
  experimentsCompleted: number;
  lessonsCompleted: number;
  completedModuleIds: Set<string>;
  completedExperimentIds: Set<string>;
  completedLessonIds: Set<number>;
}

export const useUserProgress = (selectedArea: string) => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<Progress | null>(null);
  const [stats, setStats] = useState<UserStats>({
    modulesCompleted: 0,
    experimentsCompleted: 0,
    lessonsCompleted: 0,
    completedModuleIds: new Set(),
    completedExperimentIds: new Set(),
    completedLessonIds: new Set()
  });
  const [loading, setLoading] = useState(true);

  const fetchProgress = useCallback(async () => {
    if (!user || !selectedArea) return;

    // Fetch or create progress for the selected area
    const { data: progressData, error: progressError } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('stem_area', selectedArea)
      .maybeSingle();

    if (progressError) {
      console.error('Error fetching progress:', progressError);
      return;
    }

    if (progressData) {
      setProgress({
        stemArea: progressData.stem_area,
        points: progressData.points,
        level: progressData.level,
        currentLesson: progressData.current_lesson
      });
    } else {
      // Create initial progress for this area
      const { data: newProgress, error: createError } = await supabase
        .from('user_progress')
        .insert({
          user_id: user.id,
          stem_area: selectedArea,
          points: 0,
          level: 1,
          current_lesson: 1
        })
        .select()
        .single();

      if (createError) {
        console.error('Error creating progress:', createError);
      } else if (newProgress) {
        setProgress({
          stemArea: newProgress.stem_area,
          points: newProgress.points,
          level: newProgress.level,
          currentLesson: newProgress.current_lesson
        });
      }
    }
  }, [user, selectedArea]);

  const fetchStats = useCallback(async () => {
    if (!user || !selectedArea) return;

    // Fetch completed modules for selected area
    const { data: modules, error: modulesError } = await supabase
      .from('completed_modules')
      .select('module_id')
      .eq('user_id', user.id)
      .eq('stem_area', selectedArea);

    // Fetch completed experiments for selected area
    const { data: experiments, error: experimentsError } = await supabase
      .from('completed_experiments')
      .select('experiment_id')
      .eq('user_id', user.id)
      .eq('stem_area', selectedArea);

    // Fetch completed lessons for selected area
    const { data: lessons, error: lessonsError } = await supabase
      .from('completed_lessons')
      .select('lesson_id')
      .eq('user_id', user.id)
      .eq('stem_area', selectedArea);

    if (modulesError) console.error('Error fetching modules:', modulesError);
    if (experimentsError) console.error('Error fetching experiments:', experimentsError);
    if (lessonsError) console.error('Error fetching lessons:', lessonsError);

    setStats({
      modulesCompleted: modules?.length || 0,
      experimentsCompleted: experiments?.length || 0,
      lessonsCompleted: lessons?.length || 0,
      completedModuleIds: new Set(modules?.map(m => m.module_id) || []),
      completedExperimentIds: new Set(experiments?.map(e => e.experiment_id) || []),
      completedLessonIds: new Set(lessons?.map(l => l.lesson_id) || [])
    });

    setLoading(false);
  }, [user, selectedArea]);

  useEffect(() => {
    fetchProgress();
    fetchStats();
  }, [fetchProgress, fetchStats]);

  const addPoints = async (points: number) => {
    if (!user || !selectedArea) return;

    const newPoints = (progress?.points || 0) + points;

    const { error } = await supabase
      .from('user_progress')
      .update({ points: newPoints })
      .eq('user_id', user.id)
      .eq('stem_area', selectedArea);

    if (!error) {
      setProgress(prev => prev ? { ...prev, points: newPoints } : null);
    }
  };

  const levelUp = async () => {
    if (!user || !selectedArea) return;

    const newLevel = (progress?.level || 1) + 1;

    const { error } = await supabase
      .from('user_progress')
      .update({ level: newLevel })
      .eq('user_id', user.id)
      .eq('stem_area', selectedArea);

    if (!error) {
      setProgress(prev => prev ? { ...prev, level: newLevel } : null);
    }
  };

  const completeLesson = async (lessonId: number) => {
    if (!user || !selectedArea) return;

    // Check if already completed
    if (stats.completedLessonIds.has(lessonId)) return;

    const { error } = await supabase
      .from('completed_lessons')
      .insert({
        user_id: user.id,
        stem_area: selectedArea,
        lesson_id: lessonId
      });

    if (!error) {
      // Update current lesson
      await supabase
        .from('user_progress')
        .update({ current_lesson: lessonId + 1 })
        .eq('user_id', user.id)
        .eq('stem_area', selectedArea);

      setProgress(prev => prev ? { ...prev, currentLesson: lessonId + 1 } : null);
      setStats(prev => ({
        ...prev,
        lessonsCompleted: prev.lessonsCompleted + 1,
        completedLessonIds: new Set([...prev.completedLessonIds, lessonId])
      }));
    }
  };

  const completeModule = async (moduleId: string) => {
    if (!user || !selectedArea) return;

    // Check if already completed
    if (stats.completedModuleIds.has(moduleId)) return;

    const { error } = await supabase
      .from('completed_modules')
      .insert({
        user_id: user.id,
        stem_area: selectedArea,
        module_id: moduleId
      });

    if (!error) {
      setStats(prev => ({
        ...prev,
        modulesCompleted: prev.modulesCompleted + 1,
        completedModuleIds: new Set([...prev.completedModuleIds, moduleId])
      }));
      await levelUp();
    }
  };

  const completeExperiment = async (experimentId: string) => {
    if (!user || !selectedArea) return;

    // Check if already completed
    if (stats.completedExperimentIds.has(experimentId)) return;

    const { error } = await supabase
      .from('completed_experiments')
      .insert({
        user_id: user.id,
        stem_area: selectedArea,
        experiment_id: experimentId
      });

    if (!error) {
      setStats(prev => ({
        ...prev,
        experimentsCompleted: prev.experimentsCompleted + 1,
        completedExperimentIds: new Set([...prev.completedExperimentIds, experimentId])
      }));
      await levelUp();
    }
  };

  return {
    progress,
    stats,
    loading,
    addPoints,
    levelUp,
    completeLesson,
    completeModule,
    completeExperiment,
    refetch: () => {
      fetchProgress();
      fetchStats();
    }
  };
};
