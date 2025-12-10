import { useState } from "react";
import { Header } from "@/components/Header";
import { Navigation } from "@/components/Navigation";
import { Dashboard } from "@/components/Dashboard";
import { LearningPath } from "@/components/LearningPath";
import { ScienceModules } from "@/components/ScienceModules";
import { ScientistProfiles } from "@/components/ScientistProfiles";
import { VirtualLab } from "@/components/VirtualLab";
import { Achievements } from "@/components/Achievements";
import { Registration } from "@/components/Registration";
import { STEMInterestSelection } from "@/components/STEMInterestSelection";
import { UserProfile } from "@/components/UserProfile";
import { LandingPage } from "@/components/LandingPage";
import { Login } from "@/components/Login";

interface UserData {
  name: string;
  email: string;
  age: number;
  interests: string[];
}

type AuthView = 'landing' | 'login' | 'register' | 'interests' | 'app';

const Index = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [userPoints, setUserPoints] = useState(1250);
  const [userLevel, setUserLevel] = useState(3);
  const [user, setUser] = useState<UserData | null>(null);
  const [authView, setAuthView] = useState<AuthView>('landing');

  const addPoints = (points: number) => {
    setUserPoints(prev => prev + points);
    if (userPoints + points >= userLevel * 500) {
      setUserLevel(prev => prev + 1);
    }
  };

  const handleRegistrationComplete = (userData: Omit<UserData, 'interests'>) => {
    setUser({ ...userData, interests: [] });
    setAuthView('interests');
  };

  const handleLogin = (userData: UserData) => {
    setUser(userData);
    setAuthView('app');
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

  const renderActiveSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <Dashboard userPoints={userPoints} userLevel={userLevel} />;
      case "path":
        return <LearningPath onPointsEarned={addPoints} />;
      case "modules":
        return <ScienceModules onPointsEarned={addPoints} />;
      case "scientists":
        return <ScientistProfiles onPointsEarned={addPoints} />;
      case "lab":
        return <VirtualLab onPointsEarned={addPoints} />;
      case "achievements":
        return <Achievements userPoints={userPoints} userLevel={userLevel} />;
      case "profile":
        return user ? (
          <UserProfile 
            user={user} 
            userPoints={userPoints} 
            userLevel={userLevel}
            onUpdateUser={handleUpdateUser}
          />
        ) : null;
      default:
        return <Dashboard userPoints={userPoints} userLevel={userLevel} />;
    }
  };

  // Landing page
  if (authView === 'landing') {
    return (
      <LandingPage 
        onGetStarted={() => setAuthView('register')}
        onLogin={() => setAuthView('login')}
      />
    );
  }

  // Login page
  if (authView === 'login') {
    return (
      <Login 
        onLogin={handleLogin}
        onBack={() => setAuthView('landing')}
        onGoToRegister={() => setAuthView('register')}
      />
    );
  }

  // Registration page
  if (authView === 'register') {
    return (
      <Registration 
        onComplete={handleRegistrationComplete}
        onBack={() => setAuthView('landing')}
        onGoToLogin={() => setAuthView('login')}
      />
    );
  }

  // Interest selection
  if (authView === 'interests' && user) {
    return (
      <STEMInterestSelection 
        userName={user.name}
        onComplete={handleInterestSelectionComplete}
      />
    );
  }

  // Main app
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <Header userPoints={userPoints} userLevel={userLevel} />
      <div className="flex">
        <Navigation activeSection={activeSection} setActiveSection={setActiveSection} />
        <main className="flex-1 p-6">
          {renderActiveSection()}
        </main>
      </div>
    </div>
  );
};

export default Index;
