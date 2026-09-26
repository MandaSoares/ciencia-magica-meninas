import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { getPathByArea } from '@/data/learningPathData';
import { toast } from 'sonner';

export type ActivityKind =
  | 'lesson'
  | 'module_start'
  | 'module_step'
  | 'module'
  | 'experiment_start'
  | 'experiment_step'
  | 'experiment'
  | 'scientist'
  | 'career'
  | 'woman';

interface ActivityResult {
  awarded: number;
  already_done: boolean;
  daily_cap_reached: boolean;
  points: number;
  level: number;
  current_lesson: number;
  streak: number;
  longest_streak: number;
  studied_today: boolean;
  today_xp: number;
}

export interface StreakInfo {
  current: number;
  longest: number;
  studiedToday: boolean;
  todayXp: number;
}

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
  const [streak, setStreak] = useState<StreakInfo>({ current: 0, longest: 0, studiedToday: false, todayXp: 0 });

  const fetchStreak = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase.rpc('get_my_streak');
    if (error || !data) return;
    const d = data as unknown as { streak: number; longest_streak: number; studied_today: boolean; today_xp: number };
    setStreak({ current: d.streak, longest: d.longest_streak, studiedToday: d.studied_today, todayXp: d.today_xp });
  }, [user]);

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
    fetchStreak();
  }, [fetchProgress, fetchStats, fetchStreak]);

  /**
   * Registra uma atividade. O SERVIDOR decide o XP (award_activity), impede
   * repetir a mesma atividade, aplica teto diário e atualiza a sequência.
   */
  const recordActivity = useCallback(async (kind: ActivityKind, ref: string): Promise<ActivityResult | null> => {
    if (!user || !selectedArea) return null;

    const safeRef = ref
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^A-Za-z0-9_.:\- ]/g, '')
      .trim()
      .slice(0, 120);
    if (!safeRef) return null;

    const { data, error } = await supabase.rpc('award_activity', {
      _stem_area: selectedArea,
      _kind: kind,
      _ref: safeRef,
    });

    if (error || !data) {
      console.error('Error recording activity:', error);
      return null;
    }

    const result = data as unknown as ActivityResult;
    setProgress(() => ({
      stemArea: selectedArea,
      points: result.points,
      level: result.level,
      currentLesson: result.current_lesson,
    }));

    const wasStudiedToday = streak.studiedToday;
    setStreak({
      current: result.streak,
      longest: result.longest_streak,
      studiedToday: result.studied_today,
      todayXp: result.today_xp,
    });

    if (result.awarded > 0) {
      toast.success(`+${result.awarded} XP`, { duration: 1500 });
    }
    if (!wasStudiedToday && result.studied_today && result.streak > 0) {
      toast(result.streak === 1 ? '🔥 Sequência iniciada! Volte amanhã para continuar.' : `🔥 ${result.streak} dias seguidos!`);
    }
    return result;
  }, [user, selectedArea, streak.studiedToday]);

  const completeLesson = async (lessonId: number) => {
    if (stats.completedLessonIds.has(lessonId)) return;
    const result = await recordActivity('lesson', String(lessonId));
    if (result) {
      setStats(prev => ({
        ...prev,
        lessonsCompleted: prev.completedLessonIds.has(lessonId) ? prev.lessonsCompleted : prev.lessonsCompleted + 1,
        completedLessonIds: new Set([...prev.completedLessonIds, lessonId])
      }));
    }
  };

  const completeModule = async (moduleId: string) => {
    if (stats.completedModuleIds.has(moduleId)) return;
    const result = await recordActivity('module', moduleId);
    if (result) {
      setStats(prev => ({
        ...prev,
        modulesCompleted: prev.completedModuleIds.has(moduleId) ? prev.modulesCompleted : prev.modulesCompleted + 1,
        completedModuleIds: new Set([...prev.completedModuleIds, moduleId])
      }));
    }
  };

  const completeExperiment = async (experimentId: string) => {
    if (stats.completedExperimentIds.has(experimentId)) return;
    const result = await recordActivity('experiment', experimentId);
    if (result) {
      setStats(prev => ({
        ...prev,
        experimentsCompleted: prev.completedExperimentIds.has(experimentId) ? prev.experimentsCompleted : prev.experimentsCompleted + 1,
        completedExperimentIds: new Set([...prev.completedExperimentIds, experimentId])
      }));
    }
  };

  // Check if path is completed (all lessons done)
  const isPathCompleted = useMemo(() => {
    const pathLevels = getPathByArea(selectedArea);
    const totalLessons = pathLevels.length;
    return stats.lessonsCompleted >= totalLessons && totalLessons > 0;
  }, [selectedArea, stats.lessonsCompleted]);

  return {
    progress,
    stats,
    loading,
    isPathCompleted,
    streak,
    recordActivity,
    completeLesson,
    completeModule,
    completeExperiment,
    refetch: () => {
      fetchProgress();
      fetchStats();
    }
  };
};
