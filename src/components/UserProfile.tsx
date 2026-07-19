import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Edit3, Save, X, LogOut, Camera, Loader2, BookOpen, Beaker, Trophy, Flame, Star, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const MAX_IMAGE_DIMENSION = 200;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const resizeImageToBlob = (file: File, maxDimension: number): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to create blob'));
            }
          },
          'image/jpeg',
          0.8
        );
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

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

const areaLabels: Record<string, string> = {
  science: "Ciência",
  technology: "Tecnologia",
  engineering: "Engenharia",
  math: "Matemática",
};

export const UserProfile = ({ user, userPoints, userLevel, onUpdateUser, onLogout, stats }: UserProfileProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(user);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user: authUser } = useAuth();

  const handleSave = () => {
    onUpdateUser(editForm);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm(user);
    setIsEditing(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !authUser) return;

    if (file.size > MAX_FILE_SIZE) {
      toast.error('Imagem muito grande. O tamanho máximo é 2MB.');
      return;
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error('Tipo de arquivo não permitido. Use JPEG, PNG, WebP ou GIF.');
      return;
    }

    setIsUploadingImage(true);

    try {
      const resizedBlob = await resizeImageToBlob(file, MAX_IMAGE_DIMENSION);
      const fileName = `${authUser.id}/${Date.now()}.jpg`;

      const { data, error } = await supabase.storage
        .from('profile-images')
        .upload(fileName, resizedBlob, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('profile-images')
        .getPublicUrl(data.path);

      const publicUrl = urlData.publicUrl;
      setEditForm({ ...editForm, profileImage: publicUrl });
      toast.success('Imagem atualizada!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Erro ao processar imagem. Tente novamente.');
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-800 dark:text-white mb-1">Meu Perfil</h2>
          <p className="text-gray-500 dark:text-gray-400">Gerencie suas informações</p>
        </div>
        <Button onClick={onLogout} variant="outline" className="text-red-600 dark:text-red-400 border-red-300 dark:border-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl">
          <LogOut className="w-4 h-4 mr-2" />
          Sair da Conta
        </Button>
      </div>

      {/* Profile Header Card */}
      <Card className="p-6 dark:bg-gray-800/50 dark:border-gray-700 rounded-2xl">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative">
            <Avatar className="w-24 h-24 ring-4 ring-purple-200 dark:ring-purple-800 ring-offset-2 ring-offset-white dark:ring-offset-gray-800">
              <AvatarImage src={editForm.profileImage || user.profileImage} />
              <AvatarFallback className="text-2xl bg-gradient-to-br from-pink-400 to-purple-500 text-white font-bold">
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
                  disabled={isUploadingImage}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingImage}
                  className="absolute bottom-0 right-0 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white hover:bg-purple-600 disabled:opacity-50 shadow-lg"
                >
                  {isUploadingImage ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Camera className="w-4 h-4" />
                  )}
                </button>
              </>
            )}
          </div>

          <div className="text-center sm:text-left flex-1">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{user.name}</h3>
            <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
            <div className="flex items-center gap-3 mt-3 justify-center sm:justify-start">
              <div className="flex items-center gap-1.5 bg-purple-50 dark:bg-purple-900/30 px-3 py-1 rounded-full">
                <Sparkles className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-bold text-purple-600 dark:text-purple-300">{userPoints} XP</span>
              </div>
              <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-900/20 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-700">
                <Star className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-bold text-amber-700 dark:text-amber-300">Nível {userLevel}</span>
              </div>
            </div>
          </div>

          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} variant="outline" size="sm" className="rounded-xl">
              <Edit3 className="w-4 h-4 mr-2" />
              Editar
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button onClick={handleSave} size="sm" disabled={isUploadingImage} className="rounded-xl">
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </Button>
              <Button onClick={handleCancel} variant="outline" size="sm" disabled={isUploadingImage} className="rounded-xl">
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="p-4 text-center bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800 rounded-2xl">
          <BookOpen className="w-6 h-6 text-purple-500 mx-auto mb-1" />
          <p className="text-2xl font-black text-purple-600 dark:text-purple-300">{stats.lessonsCompleted}</p>
          <p className="text-xs text-purple-500 dark:text-purple-400 font-semibold">Lições</p>
        </Card>
        <Card className="p-4 text-center bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border-emerald-200 dark:border-emerald-800 rounded-2xl">
          <Beaker className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-300">{stats.experimentsCompleted}</p>
          <p className="text-xs text-emerald-500 dark:text-emerald-400 font-semibold">Experimentos</p>
        </Card>
        <Card className="p-4 text-center bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border-amber-200 dark:border-amber-800 rounded-2xl">
          <Trophy className="w-6 h-6 text-amber-500 mx-auto mb-1" />
          <p className="text-2xl font-black text-amber-600 dark:text-amber-300">{stats.modulesCompleted}</p>
          <p className="text-xs text-amber-500 dark:text-amber-400 font-semibold">Módulos</p>
        </Card>
        <Card className="p-4 text-center bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200 dark:border-orange-800 rounded-2xl">
          <Flame className="w-6 h-6 text-orange-500 mx-auto mb-1" />
          <p className="text-2xl font-black text-orange-600 dark:text-orange-300">{stats.daysStreak}</p>
          <p className="text-xs text-orange-500 dark:text-orange-400 font-semibold">Dias seguidos</p>
        </Card>
      </div>

      {/* Personal Info */}
      <Card className="p-6 dark:bg-gray-800/50 dark:border-gray-700 rounded-2xl">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Informações Pessoais</h3>

        <div className="space-y-4">
          {!isEditing ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
                  <Label className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nome</Label>
                  <p className="text-base font-medium text-gray-800 dark:text-white mt-1">{user.name}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
                  <Label className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</Label>
                  <p className="text-base text-gray-800 dark:text-white mt-1">{user.email}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
                  <Label className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Idade</Label>
                  <p className="text-base text-gray-800 dark:text-white mt-1">{user.age} anos</p>
                </div>
              </div>
            </>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">Nome</Label>
                <Input
                  id="edit-name"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="rounded-xl"
                />
              </div>
              <div>
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="rounded-xl"
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
                  className="rounded-xl"
                />
              </div>
            </div>
          )}

          <div>
            <Label className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 block">Áreas de Interesse</Label>
            <div className="flex flex-wrap gap-2">
              {user.interests.map((interest, index) => (
                <Badge key={index} variant="secondary" className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full px-3 py-1">
                  {areaLabels[interest] || interest}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
