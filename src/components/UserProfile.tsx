
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { User, Edit3, Save, X, Trophy, Star, Calendar, BookOpen } from "lucide-react";

interface UserData {
  name: string;
  email: string;
  age: number;
  interests: string[];
}

interface UserProfileProps {
  user: UserData;
  userPoints: number;
  userLevel: number;
  onUpdateUser: (userData: UserData) => void;
}

export const UserProfile = ({ user, userPoints, userLevel, onUpdateUser }: UserProfileProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(user);

  const handleSave = () => {
    onUpdateUser(editForm);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm(user);
    setIsEditing(false);
  };

  const nextLevelPoints = userLevel * 500;
  const progressPercentage = (userPoints % 500) / 5;

  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const achievements = [
    { name: "Primeira Lição", icon: BookOpen, earned: true },
    { name: "Cientista Iniciante", icon: Star, earned: true },
    { name: "Exploradora", icon: Trophy, earned: false },
    { name: "Mestre em STEM", icon: Trophy, earned: false },
  ];

  const stats = [
    { label: "Dias consecutivos", value: "7", icon: Calendar },
    { label: "Módulos concluídos", value: "12", icon: BookOpen },
    { label: "Pontos totais", value: userPoints.toString(), icon: Star },
    { label: "Nível atual", value: userLevel.toString(), icon: Trophy },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Meu Perfil</h2>
        <p className="text-gray-600">Gerencie suas informações e acompanhe seu progresso</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informações do Perfil */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">Informações Pessoais</h3>
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <Edit3 className="w-4 h-4" />
                <span>Editar</span>
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button
                  onClick={handleSave}
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Salvar</span>
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <X className="w-4 h-4" />
                  <span>Cancelar</span>
                </Button>
              </div>
            )}
          </div>

          <div className="flex items-start space-x-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src="" />
              <AvatarFallback className="text-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                {getUserInitials(user.name)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-4">
              {!isEditing ? (
                <>
                  <div>
                    <Label className="text-sm text-gray-600">Nome</Label>
                    <p className="text-lg font-medium">{user.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Email</Label>
                    <p className="text-lg">{user.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Idade</Label>
                    <p className="text-lg">{user.age} anos</p>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <Label htmlFor="edit-name">Nome</Label>
                    <Input
                      id="edit-name"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-email">Email</Label>
                    <Input
                      id="edit-email"
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-age">Idade</Label>
                    <Input
                      id="edit-age"
                      type="number"
                      min="6"
                      max="18"
                      value={editForm.age}
                      onChange={(e) => setEditForm({ ...editForm, age: parseInt(e.target.value) })}
                    />
                  </div>
                </>
              )}

              <div>
                <Label className="text-sm text-gray-600 mb-2 block">Áreas de Interesse</Label>
                <div className="flex flex-wrap gap-2">
                  {user.interests.map((interest, index) => (
                    <Badge key={index} variant="secondary" className="bg-purple-100 text-purple-700">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Progresso */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Meu Progresso</h3>
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl font-bold text-white">{userLevel}</span>
              </div>
              <p className="font-medium">Nível {userLevel}</p>
              <p className="text-sm text-gray-600">{userPoints} pontos</p>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Próximo nível</span>
                <span>{nextLevelPoints - (userPoints % 500)} pontos</span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
            </div>
          </div>
        </Card>
      </div>

      {/* Estatísticas */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Estatísticas</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                <Icon className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Conquistas */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Conquistas</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {achievements.map((achievement, index) => {
            const Icon = achievement.icon;
            return (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 text-center transition-all ${
                  achievement.earned
                    ? "border-yellow-300 bg-yellow-50"
                    : "border-gray-200 bg-gray-50 opacity-50"
                }`}
              >
                <Icon
                  className={`w-8 h-8 mx-auto mb-2 ${
                    achievement.earned ? "text-yellow-500" : "text-gray-400"
                  }`}
                />
                <p className="text-sm font-medium">{achievement.name}</p>
                {achievement.earned && (
                  <Badge className="mt-2 bg-yellow-500 text-white">Conquistado!</Badge>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
