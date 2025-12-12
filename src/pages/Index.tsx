import { useState } from "react";
import { Header } from "@/components/Header";
import { Navigation } from "@/components/Navigation";
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
import { AreaSelection } from "@/components/AreaSelection";
import { Footer } from "@/components/Footer";

interface UserData {
  name: string;
  email: string;
  age: number;
  interests: string[];
  profileImage?: string;
}

interface UserStats {
  modulesCompleted: number;
  experimentsCompleted: number;
  lessonsCompleted: number;
  daysStreak: number;
  completedLevels: Set<string>;
  completedModules: Set<string>;
}

type AuthView = 'landing' | 'login' | 'register' | 'interests' | 'app';

const Index = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [userPoints, setUserPoints] = useState(0);
  const [userLevel, setUserLevel] = useState(1);
  const [user, setUser] = useState<UserData | null>(null);
  const [authView, setAuthView] = useState<AuthView>('landing');
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [showAddAreaModal, setShowAddAreaModal] = useState(false);
  const [userStats, setUserStats] = useState<UserStats>({
    modulesCompleted: 0,
    experimentsCompleted: 0,
    lessonsCompleted: 0,
    daysStreak: 1,
    completedLevels: new Set(),
    completedModules: new Set(),
  });

  const addPoints = (points: number) => {
    setUserPoints(prev => {
      const newPoints = prev + points;
      if (newPoints >= userLevel * 500) {
        setUserLevel(l => l + 1);
      }
      return newPoints;
    });
  };

  const handleLessonComplete = () => {
    setUserStats(prev => ({
      ...prev,
      lessonsCompleted: prev.lessonsCompleted + 1,
    }));
  };

  const handleModuleComplete = (moduleId: string) => {
    setUserStats(prev => ({
      ...prev,
      modulesCompleted: prev.modulesCompleted + 1,
      completedModules: new Set([...prev.completedModules, moduleId]),
    }));
  };

  const handleExperimentComplete = () => {
    setUserStats(prev => ({
      ...prev,
      experimentsCompleted: prev.experimentsCompleted + 1,
    }));
  };

  const handleRegistrationComplete = (userData: Omit<UserData, 'interests'>) => {
    setUser({ ...userData, interests: [] });
    setUserPoints(0);
    setUserLevel(1);
    setUserStats({
      modulesCompleted: 0,
      experimentsCompleted: 0,
      lessonsCompleted: 0,
      daysStreak: 1,
      completedLevels: new Set(),
      completedModules: new Set(),
    });
    setAuthView('interests');
  };

  const handleLogin = (userData: UserData) => {
    setUser(userData);
    setAuthView('app');
  };

  const handleLogout = () => {
    setUser(null);
    setUserPoints(0);
    setUserLevel(1);
    setSelectedArea(null);
    setAuthView('landing');
  };

  const handleInterestSelectionComplete = (interests: string[]) => {
    if (user) {
      setUser({ ...user, interests });
      setAuthView('app');
    }
  };

  const handleUpdateUser = (userData: UserData) => {
    setUser(userData);
  };

  const handleSelectArea = (area: string) => {
    setSelectedArea(area);
  };

  const handleAddArea = () => {
    // Show area selection for adding new areas
    setShowAddAreaModal(true);
  };

  const handleAddNewInterest = (interest: string) => {
    if (user && !user.interests.includes(interest)) {
      const newInterests = [...user.interests, interest];
      setUser({ ...user, interests: newInterests });
      setSelectedArea(interest);
    }
    setShowAddAreaModal(false);
  };

  const getNavItems = () => {
    return [
      { id: "dashboard", label: "Início" },
      { id: "path", label: "Trilha" },
      { id: "modules", label: "Módulos" },
      { id: "areas", label: "Áreas de Atuação" },
      { id: "lab", label: "Laboratório" },
      { id: "achievements", label: "Conquistas" },
      { id: "profile", label: "Meu Perfil" },
    ];
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <Dashboard 
            userPoints={userPoints} 
            userLevel={userLevel} 
            userName={user?.name || "Estudante"}
            selectedAreas={user?.interests || [selectedArea || "science"]}
            currentActiveArea={selectedArea || "science"}
            onAreaChange={handleSelectArea}
            onAddArea={handleAddArea}
          />
        );
      case "path":
        return (
          <LearningPath 
            onPointsEarned={addPoints} 
            selectedArea={selectedArea || "Ciência"}
            onLessonComplete={handleLessonComplete}
          />
        );
      case "modules":
        return (
          <ScienceModules 
            onPointsEarned={addPoints} 
            selectedArea={selectedArea || "science"}
            userName={user?.name || "Estudante"}
            onModuleComplete={handleModuleComplete}
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
            onExperimentComplete={handleExperimentComplete}
          />
        );
      case "achievements":
        return (
          <Achievements 
            userPoints={userPoints} 
            userLevel={userLevel}
            stats={userStats}
          />
        );
      case "profile":
        return user ? (
          <UserProfile 
            user={user} 
            userPoints={userPoints} 
            userLevel={userLevel}
            onUpdateUser={handleUpdateUser}
            onLogout={handleLogout}
            stats={userStats}
          />
        ) : null;
      default:
        return (
          <Dashboard 
            userPoints={userPoints} 
            userLevel={userLevel} 
            userName={user?.name || "Estudante"} 
            selectedAreas={user?.interests || [selectedArea || "science"]}
            currentActiveArea={selectedArea || "science"}
            onAreaChange={handleSelectArea}
            onAddArea={handleAddArea}
          />
        );
    }
  };

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
        onLogin={handleLogin}
        onBack={() => setAuthView('landing')}
        onGoToRegister={() => setAuthView('register')}
      />
    );
  }

  if (authView === 'register') {
    return (
      <Registration 
        onComplete={handleRegistrationComplete}
        onBack={() => setAuthView('landing')}
        onGoToLogin={() => setAuthView('login')}
      />
    );
  }

  if (authView === 'interests' && user) {
    return (
      <STEMInterestSelection 
        userName={user.name}
        onComplete={handleInterestSelectionComplete}
      />
    );
  }

  // Show area selection if user has multiple interests and hasn't selected one
  if (user && user.interests.length > 1 && !selectedArea) {
    return (
      <AreaSelection 
        interests={user.interests}
        onSelectArea={handleSelectArea}
      />
    );
  }

  // Set default area if only one interest
  if (user && user.interests.length === 1 && !selectedArea) {
    setSelectedArea(user.interests[0]);
  }

  // Modal for adding new area
  if (showAddAreaModal) {
    const availableAreas = ['science', 'technology', 'engineering', 'math'].filter(
      a => !user?.interests.includes(a)
    );

    if (availableAreas.length === 0) {
      setShowAddAreaModal(false);
    } else {
      return (
        <AreaSelection 
          interests={availableAreas}
          onSelectArea={handleAddNewInterest}
        />
      );
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex flex-col">
      <Header 
        userPoints={userPoints} 
        userLevel={userLevel} 
        userName={user?.name}
        userProfileImage={user?.profileImage}
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
      <Footer />
    </div>
  );
};

export default Index;
