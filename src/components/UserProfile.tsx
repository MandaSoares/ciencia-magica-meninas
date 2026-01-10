import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Edit3, Save, X, LogOut, Camera } from "lucide-react";
import { toast } from "sonner";

// Maximum file size: 2MB
const MAX_FILE_SIZE = 2 * 1024 * 1024;
// Maximum image dimension for avatar (will resize to this)
const MAX_IMAGE_DIMENSION = 200;
// Allowed image types
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

/**
 * Resize an image to fit within maxDimension while maintaining aspect ratio
 * Returns a compressed base64 string
 */
const resizeImage = (file: File, maxDimension: number): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        
        // Calculate new dimensions maintaining aspect ratio
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
        
        // Compress as JPEG with 80% quality for smaller size
        const resizedBase64 = canvas.toDataURL('image/jpeg', 0.8);
        resolve(resizedBase64);
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast.error('Imagem muito grande. O tamanho máximo é 2MB.');
      return;
    }
    
    // Validate file type
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error('Tipo de arquivo não permitido. Use JPEG, PNG, WebP ou GIF.');
      return;
    }
    
    try {
      // Resize image to reduce database storage
      const resizedImage = await resizeImage(file, MAX_IMAGE_DIMENSION);
      setEditForm({ ...editForm, profileImage: resizedImage });
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error('Erro ao processar imagem. Tente novamente.');
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
