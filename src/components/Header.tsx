
import { Crown, Star } from "lucide-react";

interface HeaderProps {
  userPoints: number;
  userLevel: number;
}

export const Header = ({ userPoints, userLevel }: HeaderProps) => {
  return (
    <header className="bg-white shadow-lg border-b-4 border-purple-400">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <Crown className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              ScienceGirls
            </h1>
            <p className="text-gray-600 text-sm">Descobrindo o mundo da ciência!</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 bg-yellow-100 px-4 py-2 rounded-full">
            <Star className="w-5 h-5 text-yellow-500" />
            <span className="font-semibold text-yellow-700">{userPoints} pontos</span>
          </div>
          
          <div className="flex items-center space-x-2 bg-purple-100 px-4 py-2 rounded-full">
            <Crown className="w-5 h-5 text-purple-500" />
            <span className="font-semibold text-purple-700">Nível {userLevel}</span>
          </div>
          
          <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">M</span>
          </div>
        </div>
      </div>
    </header>
  );
};
