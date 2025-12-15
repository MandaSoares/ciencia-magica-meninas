import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Edit3, Save, X, LogOut, Camera } from "lucide-react";

interface UserData {
  name: string;
  email: string;
  age: number;
  interests: string[];
  profileImage?: string;
}

interface UserProfileProps {
  user: UserData;
  userPoints: number;
  userLevel: number;
  onUpdateUser: (userData: UserData) => void;
  onLogout: () => void;
  stats: {
    modulesCompleted: number;
    experimentsCompleted: number;
    lessonsCompleted: number;
    daysStreak: number;
  };
}

export const UserProfile = ({ user, userPoints, userLevel, onUpdateUser, onLogout, stats }: UserProfileProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(user);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    onUpdateUser(editForm);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm(user);
    setIsEditing(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm({ ...editForm, profileImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };


  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Meu Perfil</h2>
          <p className="text-gray-600">Gerencie suas informações</p>
        </div>
        <Button onClick={onLogout} variant="outline" className="text-red-600 border-red-300 hover:bg-red-50">
          <LogOut className="w-4 h-4 mr-2" />
          Sair da Conta
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">Informações Pessoais</h3>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
              <Edit3 className="w-4 h-4 mr-2" />
              Editar
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button onClick={handleSave} size="sm">
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </Button>
              <Button onClick={handleCancel} variant="outline" size="sm">
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-start space-x-6">
          <div className="relative">
            <Avatar className="w-24 h-24">
              <AvatarImage src={editForm.profileImage || user.profileImage} />
              <AvatarFallback className="text-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                {getUserInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            {isEditing && (
              <>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white hover:bg-purple-600"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

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

    </div>
  );
};
