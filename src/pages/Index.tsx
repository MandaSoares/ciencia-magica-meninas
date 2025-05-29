
import { useState } from "react";
import { Header } from "@/components/Header";
import { Navigation } from "@/components/Navigation";
import { Dashboard } from "@/components/Dashboard";
import { LearningPath } from "@/components/LearningPath";
import { ScienceModules } from "@/components/ScienceModules";
import { ScientistProfiles } from "@/components/ScientistProfiles";
import { VirtualLab } from "@/components/VirtualLab";
import { Achievements } from "@/components/Achievements";

const Index = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [userPoints, setUserPoints] = useState(1250);
  const [userLevel, setUserLevel] = useState(3);

  const addPoints = (points: number) => {
    setUserPoints(prev => prev + points);
    // Level up logic
    if (userPoints + points >= userLevel * 500) {
      setUserLevel(prev => prev + 1);
    }
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
      default:
        return <Dashboard userPoints={userPoints} userLevel={userLevel} />;
    }
  };

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
