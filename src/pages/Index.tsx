import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Navigation } from "@/components/Navigation";
import { Dashboard } from "@/components/Dashboard";
import { LearningPath } from "@/components/LearningPath";
import { ScienceModules } from "@/components/ScienceModules";
import { AreasDeAtuacao } from "@/components/AreasDeAtuacao";
import { VirtualLab } from "@/components/VirtualLab";
import { Registration } from "@/components/Registration";
import { STEMInterestSelection } from "@/components/STEMInterestSelection";
import { UserProfile } from "@/components/UserProfile";
import { LandingPage } from "@/components/LandingPage";
import { Login } from "@/components/Login";
import { AreaSelection } from "@/components/AreaSelection";
import { Footer } from "@/components/Footer";
import { About } from "@/pages/About";
import { Blog } from "@/pages/Blog";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { useUserProgress } from "@/hooks/useUserProgress";
import { Loader2 } from "lucide-react";

type AuthView = 'landing' | 'login' | 'register' | 'interests' | 'app';
type FooterPage = 'about' | 'blog' | null;

const AppContent = () => {
  const { user, profile, loading: authLoading, signOut, updateProfile } = useAuth();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [authView, setAuthView] = useState<AuthView>('landing');
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [showAddAreaModal, setShowAddAreaModal] = useState(false);
  const [footerPage, setFooterPage] = useState<FooterPage>(null);

  const { progress, stats, isPathCompleted, addPoints, completeLesson, completeModule, completeExperiment } = 
    useUserProgress(selectedArea || 'science');

  // Handle auth state changes
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

  const getNavItems = () => {
    return [
      { id: "dashboard", label: "Início" },
      { id: "path", label: "Trilha" },
      { id: "modules", label: "Módulos" },
      { id: "areas", label: "Áreas de Atuação" },
      { id: "lab", label: "Laboratório" },
      { id: "profile", label: "Meu Perfil" },
    ];
  };

  const handleUpdateUser = async (userData: { name: string; email: string; age: number; interests: string[]; profileImage?: string }) => {
    await updateProfile({
      name: userData.name,
      email: userData.email,
      age: userData.age,
      interests: userData.interests,
      profile_image: userData.profileImage
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
          />
        );
      case "path":
        return (
          <LearningPath 
            onPointsEarned={addPoints} 
            selectedArea={selectedArea || "science"}
            onLessonComplete={completeLesson}
            completedLessons={stats.completedLessonIds}
          />
        );
      case "modules":
        return (
          <ScienceModules 
            onPointsEarned={addPoints} 
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
            onPointsEarned={addPoints}
            selectedArea={selectedArea || "science"}
          />
        );
      case "lab":
        return (
          <VirtualLab 
            onPointsEarned={addPoints}
            onExperimentComplete={completeExperiment}
            selectedArea={selectedArea || "science"}
            completedExperimentIds={stats.completedExperimentIds}
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
              profileImage: profile.profile_image || undefined
            }} 
            userPoints={progress?.points || 0} 
            userLevel={progress?.level || 1}
            onUpdateUser={handleUpdateUser}
            onLogout={handleLogout}
            stats={{
              modulesCompleted: stats.modulesCompleted,
              experimentsCompleted: stats.experimentsCompleted,
              lessonsCompleted: stats.lessonsCompleted,
              daysStreak: 1
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
          />
        );
    }
  };

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Footer pages
  if (footerPage === 'about') {
    return <About onBack={() => setFooterPage(null)} />;
  }

  if (footerPage === 'blog') {
    return <Blog onBack={() => setFooterPage(null)} />;
  }

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
      />
    );
  }

  if (authView === 'register') {
    return (
      <Registration 
        onComplete={() => setAuthView('interests')}
        onBack={() => setAuthView('landing')}
        onGoToLogin={() => setAuthView('login')}
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

  // Show area selection if user has multiple interests and hasn't selected one
  if (profile && profile.interests.length > 1 && !selectedArea) {
    return (
      <AreaSelection 
        interests={profile.interests}
        onSelectArea={handleSelectArea}
      />
    );
  }

  // Set default area if only one interest
  if (profile && profile.interests.length === 1 && !selectedArea) {
    setSelectedArea(profile.interests[0]);
  }

  // Modal for adding new area
  if (showAddAreaModal) {
    const availableAreas = ['science', 'technology', 'engineering', 'math'].filter(
      a => !profile?.interests.includes(a)
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex flex-col">
      <Header 
        userPoints={progress?.points || 0} 
        userLevel={progress?.level || 1} 
        userName={profile?.name}
        userProfileImage={profile?.profile_image || undefined}
      />
      <div className="flex flex-1">
        <Navigation 
          activeSection={activeSection} 
          setActiveSection={setActiveSection}
          navItems={getNavItems()}
        />
        <main className="flex-1 p-6">
          {renderActiveSection()}
        </main>
      </div>
      <Footer onNavigate={handleFooterNavigate} />
    </div>
  );
};

const Index = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default Index;
