import { useState, useEffect, lazy, Suspense } from "react";
import { Header } from "@/components/Header";
import { Navigation } from "@/components/Navigation";
import { MobileNav } from "@/components/MobileNav";
import { Dashboard } from "@/components/Dashboard";
import { LearningPath } from "@/components/LearningPath";
import { ScienceModules } from "@/components/ScienceModules";
import { AreasDeAtuacao } from "@/components/AreasDeAtuacao";
import { VirtualLab } from "@/components/VirtualLab";
import { Achievements } from "@/components/Achievements";
import { Registration } from "@/components/Registration";
import { STEMInterestSelection } from "@/components/STEMInterestSelection";
import { UserProfile } from "@/components/UserProfile";
import { LandingPage } from "@/components/LandingPage";
import { Login } from "@/components/Login";
import { ForgotPassword } from "@/components/ForgotPassword";
const AdminPanel = lazy(() => import("@/components/AdminPanel").then(m => ({ default: m.AdminPanel })));
const ModeratorPanel = lazy(() => import("@/components/ModeratorPanel").then(m => ({ default: m.ModeratorPanel })));
import { AreaSelection } from "@/components/AreaSelection";
import { Footer } from "@/components/Footer";
const About = lazy(() => import("@/pages/About").then(m => ({ default: m.About })));
const Blog = lazy(() => import("@/pages/Blog").then(m => ({ default: m.Blog })));
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { ThemeProvider } from "@/hooks/useTheme";
import { useUserProgress } from "@/hooks/useUserProgress";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { useStudyHours } from "@/hooks/useStudyHours";
import { Loader2, Shield, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type AuthView = 'landing' | 'login' | 'register' | 'interests' | 'app' | 'forgotPassword' | 'admin' | 'moderator';
type FooterPage = 'about' | 'blog' | null;

const AppContent = () => {
  const { user, profile, loading: authLoading, signOut, updateProfile, isPasswordRecovery, clearPasswordRecovery, linkNotice, clearLinkNotice } = useAuth();
  const { isAdmin, isModerator, loading: adminLoading } = useAdminCheck();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [authView, setAuthView] = useState<AuthView>('landing');
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [showAddAreaModal, setShowAddAreaModal] = useState(false);
  const [footerPage, setFooterPage] = useState<FooterPage>(null);

  const { progress, stats, streak, isPathCompleted, recordActivity, completeLesson, completeModule, completeExperiment } =
    useUserProgress(selectedArea || 'science');

  const { studyHours } = useStudyHours(selectedArea || 'science');

  useEffect(() => {
    if (!authLoading) {
      if (user && profile) {
        if (profile.interests && profile.interests.length > 0) {
          setAuthView('app');
          if (!selectedArea && profile.interests.length === 1) {
            setSelectedArea(profile.interests[0]);
          }
        } else {
          setAuthView('interests');
        }
      } else if (!user) {
        setAuthView('landing');
      }
    }
  }, [user, profile, authLoading, selectedArea]);

  // Volta de um link de email (confirmação ok, expirado ou inválido)
  useEffect(() => {
    if (authLoading || !linkNotice) return;
    if (user) {
      if (linkNotice.kind === 'confirmed') toast.success(linkNotice.message);
      clearLinkNotice();
    } else {
      setAuthView('login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, linkNotice?.kind, linkNotice?.message, user?.id]);

  const handleLogout = async () => {
    await signOut();
    setSelectedArea(null);
    setAuthView('landing');
  };

  const handleInterestSelectionComplete = async (interests: string[]) => {
    await updateProfile({ interests });
    setSelectedArea(interests[0]);
    setAuthView('app');
  };

  const handleSelectArea = (area: string) => {
    setSelectedArea(area);
  };

  const handleAddArea = () => {
    setShowAddAreaModal(true);
  };

  const handleAddNewInterest = async (interest: string) => {
    if (profile && !profile.interests.includes(interest)) {
      const newInterests = [...profile.interests, interest];
      await updateProfile({ interests: newInterests });
      setSelectedArea(interest);
    }
    setShowAddAreaModal(false);
  };

  const handleFooterNavigate = (page: string) => {
    if (page === 'about' || page === 'blog') {
      setFooterPage(page);
    }
  };

  const getNavItems = () => [
    { id: "dashboard", label: "Início" },
    { id: "path", label: "Trilha" },
    { id: "modules", label: "Módulos" },
    { id: "areas", label: "Áreas de Atuação" },
    { id: "lab", label: "Laboratório" },
    { id: "achievements", label: "Conquistas" },
    { id: "profile", label: "Meu Perfil" },
  ];

  const handleUpdateUser = async (userData: { name: string; email: string; age: number; interests: string[]; profileImage?: string }) => {
    await updateProfile({
      name: userData.name,
      age: userData.age,
      interests: userData.interests,
      profile_image: userData.profileImage,
    });
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <Dashboard
            userPoints={progress?.points || 0}
            userLevel={progress?.level || 1}
            userName={profile?.name || "Estudante"}
            selectedAreas={profile?.interests || [selectedArea || "science"]}
            currentActiveArea={selectedArea || "science"}
            onAreaChange={handleSelectArea}
            onAddArea={handleAddArea}
            modulesCompleted={stats.modulesCompleted}
            experimentsCompleted={stats.experimentsCompleted}
            studyHours={studyHours}
          />
        );
      case "path":
        return (
          <LearningPath
            selectedArea={selectedArea || "science"}
            onLessonComplete={completeLesson}
            completedLessons={stats.completedLessonIds}
          />
        );
      case "modules":
        return (
          <ScienceModules
            onActivity={recordActivity}
            selectedArea={selectedArea || "science"}
            userName={profile?.name || "Estudante"}
            onModuleComplete={completeModule}
            completedModuleIds={stats.completedModuleIds}
            isPathCompleted={isPathCompleted}
          />
        );
      case "areas":
        return (
          <AreasDeAtuacao
            onActivity={recordActivity}
            selectedArea={selectedArea || "science"}
          />
        );
      case "lab":
        return (
          <VirtualLab
            onActivity={recordActivity}
            onExperimentComplete={completeExperiment}
            selectedArea={selectedArea || "science"}
            completedExperimentIds={stats.completedExperimentIds}
          />
        );
      case "achievements":
        return (
          <Achievements
            userPoints={progress?.points || 0}
            userLevel={progress?.level || 1}
            selectedArea={selectedArea || "science"}
            stats={{
              modulesCompleted: stats.modulesCompleted,
              experimentsCompleted: stats.experimentsCompleted,
              lessonsCompleted: stats.lessonsCompleted,
              daysStreak: streak.longest, // conquista "7 dias seguidos" não se perde se a sequência quebrar
              completedLevels: new Set(Array.from(stats.completedLessonIds || new Set()).map(String)),
              completedModules: new Set(Array.from(stats.completedModuleIds || new Set()).map(String)),
            }}
          />
        );
      case "profile":
        return profile ? (
          <UserProfile
            user={{
              name: profile.name,
              email: profile.email,
              age: profile.age || 0,
              interests: profile.interests,
              profileImage: profile.profile_image || undefined,
            }}
            userPoints={progress?.points || 0}
            userLevel={progress?.level || 1}
            onUpdateUser={handleUpdateUser}
            onLogout={handleLogout}
            stats={{
              modulesCompleted: stats.modulesCompleted,
              experimentsCompleted: stats.experimentsCompleted,
              lessonsCompleted: stats.lessonsCompleted,
              daysStreak: streak.current,
            }}
          />
        ) : null;
      default:
        return (
          <Dashboard
            userPoints={progress?.points || 0}
            userLevel={progress?.level || 1}
            userName={profile?.name || "Estudante"}
            selectedAreas={profile?.interests || [selectedArea || "science"]}
            currentActiveArea={selectedArea || "science"}
            onAreaChange={handleSelectArea}
            onAddArea={handleAddArea}
            modulesCompleted={stats.modulesCompleted}
            experimentsCompleted={stats.experimentsCompleted}
            studyHours={studyHours}
          />
        );
    }
  };

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Link de "esqueci minha senha": a usuária chega logada temporariamente e
  // precisa definir a nova senha antes de qualquer outra tela.
  if (isPasswordRecovery) {
    return (
      <ForgotPassword
        initialStep="newPassword"
        onBack={() => { clearPasswordRecovery(); setAuthView('login'); }}
        onGoToLogin={() => { clearPasswordRecovery(); setAuthView('login'); }}
        onPasswordUpdated={() => clearPasswordRecovery()}
      />
    );
  }

  const pageLoader = (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );

  if (footerPage === 'about') return <Suspense fallback={pageLoader}><About onBack={() => setFooterPage(null)} /></Suspense>;
  if (footerPage === 'blog') return <Suspense fallback={pageLoader}><Blog onBack={() => setFooterPage(null)} /></Suspense>;

  if (authView === 'landing') {
    return (
      <LandingPage
        onGetStarted={() => setAuthView('register')}
        onLogin={() => setAuthView('login')}
      />
    );
  }

  if (authView === 'login') {
    return (
      <Login
        onLogin={() => {}}
        onBack={() => setAuthView('landing')}
        onGoToRegister={() => setAuthView('register')}
        onForgotPassword={() => setAuthView('forgotPassword')}
      />
    );
  }

  if (authView === 'forgotPassword') {
    return (
      <ForgotPassword
        onBack={() => setAuthView('login')}
        onGoToLogin={() => setAuthView('login')}
      />
    );
  }

  if (authView === 'admin' && isAdmin) return <Suspense fallback={pageLoader}><AdminPanel onBack={() => setAuthView('app')} /></Suspense>;
  if (authView === 'moderator' && isModerator && !isAdmin) return <Suspense fallback={pageLoader}><ModeratorPanel onBack={() => setAuthView('app')} /></Suspense>;

  if (authView === 'register') {
    return (
      <Registration
        onComplete={() => setAuthView('interests')}
        onBack={() => setAuthView('landing')}
        onGoToLogin={() => setAuthView('login')}
        onForgotPassword={() => setAuthView('forgotPassword')}
      />
    );
  }

  if (authView === 'interests' && user) {
    return (
      <STEMInterestSelection
        userName={profile?.name || ''}
        onComplete={handleInterestSelectionComplete}
      />
    );
  }

  if (profile && profile.interests.length > 1 && !selectedArea) {
    return (
      <AreaSelection
        interests={profile.interests}
        onSelectArea={handleSelectArea}
      />
    );
  }

  if (showAddAreaModal) {
    const availableAreas = ['science', 'technology', 'engineering', 'math'].filter(
      (a) => !profile?.interests.includes(a)
    );
    if (availableAreas.length === 0) {
      setShowAddAreaModal(false);
    } else {
      return (
        <AreaSelection
          interests={availableAreas}
          onSelectArea={handleAddNewInterest}
          onBack={() => setShowAddAreaModal(false)}
        />
      );
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950 flex flex-col transition-colors duration-300">
      <Header
        userPoints={progress?.points || 0}
        userLevel={progress?.level || 1}
        userName={profile?.name}
        userProfileImage={profile?.profile_image || undefined}
        streak={streak.current}
        studiedToday={streak.studiedToday}
      />
      {isAdmin && (
        <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border-b border-red-200 px-4 sm:px-6 py-2">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-red-700">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Você está logada como administradora</span>
              <span className="sm:hidden">Admin</span>
            </div>
            <Button
              variant="outline" size="sm"
              onClick={() => setAuthView('admin')}
              className="border-red-300 text-red-700 hover:bg-red-50"
            >
              Painel Admin
            </Button>
          </div>
        </div>
      )}
      {isModerator && !isAdmin && (
        <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-b border-blue-200 px-4 sm:px-6 py-2">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-blue-700">
              <UserCog className="w-4 h-4" />
              <span className="hidden sm:inline">Você está logada como moderadora</span>
              <span className="sm:hidden">Moderadora</span>
            </div>
            <Button
              variant="outline" size="sm"
              onClick={() => setAuthView('moderator')}
              className="border-blue-300 text-blue-700 hover:bg-blue-50"
            >
              Painel Moderacao
            </Button>
          </div>
        </div>
      )}
      <div className="flex flex-1">
        <Navigation
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          navItems={getNavItems()}
        />
        <main className="flex-1 p-4 sm:p-6 pb-24 md:pb-6 overflow-x-hidden">
          {renderActiveSection()}
        </main>
      </div>
      <div className="hidden md:block">
        <Footer onNavigate={handleFooterNavigate} />
      </div>
      <MobileNav activeSection={activeSection} setActiveSection={setActiveSection} />
    </div>
  );
};

const Index = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default Index;
