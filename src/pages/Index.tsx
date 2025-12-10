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

interface UserData {
  name: string;
  email: string;
  age: number;
  interests: string[];
}

const Index = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [userPoints, setUserPoints] = useState(1250);
  const [userLevel, setUserLevel] = useState(3);
  const [user, setUser] = useState<UserData | null>(null);
  const [showInterestSelection, setShowInterestSelection] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const [showRegistration, setShowRegistration] = useState(false);
  const addPoints = (points: number) => {
    setUserPoints(prev => prev + points);
    // Level up logic
    if (userPoints + points >= userLevel * 500) {
      setUserLevel(prev => prev + 1);
    }
  };

  const handleRegistrationComplete = (userData: Omit<UserData, 'interests'>) => {
    setUser({ ...userData, interests: [] });
    setShowInterestSelection(true);
  };

  const handleInterestSelectionComplete = (interests: string[]) => {
    if (user) {
      setUser({ ...user, interests });
      setShowInterestSelection(false);
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

  // Show landing page first
  if (showLanding && !user) {
    return (
      <LandingPage 
        onGetStarted={() => {
          setShowLanding(false);
          setShowRegistration(true);
        }}
        onLogin={() => {
          setShowLanding(false);
          setShowRegistration(true);
        }}
      />
    );
  }

  // Show registration if no user
  if (showRegistration && !user) {
    return <Registration onComplete={handleRegistrationComplete} />;
  }

  // Show interest selection if user exists but hasn't selected interests
  if (showInterestSelection || user.interests.length === 0) {
    return (
      <STEMInterestSelection 
        userName={user.name}
        onComplete={handleInterestSelectionComplete}
      />
    );
  }

  // Show main app
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
