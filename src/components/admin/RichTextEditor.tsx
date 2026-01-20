import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Bold, Italic, Underline, List, Link, Image as ImageIcon, Youtube, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  showImageUpload?: boolean;
  imageFolder?: string;
}

export const RichTextEditor = ({
  value,
  onChange,
  label,
  placeholder = "Digite o conteúdo...",
  rows = 4,
  required = false,
  showImageUpload = false,
  imageFolder = "content"
}: RichTextEditorProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const wrapSelection = useCallback((before: string, after: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    onChange(newText);
    
    // Reset cursor position after React re-renders
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    });
  }, [value, onChange]);

  const insertAtCursor = useCallback((text: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const newText = value.substring(0, start) + text + value.substring(start);
    onChange(newText);
    
    requestAnimationFrame(() => {
      textarea.focus();
      const newCursorPos = start + text.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    });
  }, [value, onChange]);

  const handleBold = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    wrapSelection("**", "**");
  };

  const handleItalic = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    wrapSelection("*", "*");
  };

  const handleUnderline = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    wrapSelection("<u>", "</u>");
  };

  const handleList = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    insertAtCursor("\n• ");
  };

  const handleLink = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = prompt("Digite a URL:");
    if (url) {
      const textarea = textareaRef.current;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = value.substring(start, end) || "texto";
        const linkText = `[${selectedText}](${url})`;
        const newText = value.substring(0, start) + linkText + value.substring(end);
        onChange(newText);
      }
    }
  };

  const handleYoutubeEmbed = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = prompt("Cole a URL do vídeo do YouTube:");
    if (url) {
      // Extract video ID from various YouTube URL formats
      let videoId = '';
      try {
        const urlObj = new URL(url);
        if (urlObj.hostname.includes('youtube.com')) {
          videoId = urlObj.searchParams.get('v') || '';
        } else if (urlObj.hostname === 'youtu.be') {
          videoId = urlObj.pathname.slice(1);
        }
      } catch {
        // Try to extract from embed URL
        const embedMatch = url.match(/embed\/([a-zA-Z0-9_-]+)/);
        if (embedMatch) videoId = embedMatch[1];
      }

      if (videoId) {
        const embedCode = `\n[YOUTUBE:${videoId}]\n`;
        insertAtCursor(embedCode);
      } else {
        toast({ title: "URL inválida", description: "Não foi possível extrair o ID do vídeo", variant: "destructive" });
      }
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Tipo de arquivo inválido",
        description: "Por favor, selecione uma imagem (JPG, PNG, GIF, WEBP)",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (max 2MB)
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: "Arquivo muito grande",
        description: "O tamanho máximo é 2MB",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    try {
      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${imageFolder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('content-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('content-images')
        .getPublicUrl(data.path);

      const publicUrl = urlData.publicUrl;
      
      // Insert image tag in content
      insertAtCursor(`\n[IMG:${publicUrl}]\n`);

      toast({
        title: "Imagem enviada!",
        description: "A imagem foi inserida no texto."
      });
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        title: "Erro ao enviar",
        description: error.message || "Não foi possível enviar a imagem.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleImageClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <Label>{label} {required && "*"}</Label>
      
      <div className="flex flex-wrap gap-1 p-2 bg-gray-100 rounded-t-lg border border-b-0 border-gray-200">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={handleBold}
          className="h-8 w-8 p-0"
          title="Negrito"
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={handleItalic}
          className="h-8 w-8 p-0"
          title="Itálico"
        >
          <Italic className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={handleUnderline}
          className="h-8 w-8 p-0"
          title="Sublinhado"
        >
          <Underline className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={handleList}
          className="h-8 w-8 p-0"
          title="Lista"
        >
          <List className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={handleLink}
          className="h-8 w-8 p-0"
          title="Link"
        >
          <Link className="w-4 h-4" />
        </Button>
        {showImageUpload && (
          <>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onMouseDown={handleImageClick}
              disabled={isUploading}
              className="h-8 w-8 p-0"
              title="Inserir Imagem"
            >
              {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onMouseDown={handleYoutubeEmbed}
              className="h-8 w-8 p-0"
              title="Inserir Vídeo YouTube"
            >
              <Youtube className="w-4 h-4" />
            </Button>
          </>
        )}
      </div>

      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="rounded-t-none border-t-0"
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      <p className="text-xs text-gray-500">
        Dica: Use **texto** para negrito, *texto* para itálico
        {showImageUpload && ". Clique nos ícones para inserir imagens e vídeos."}
      </p>
    </div>
  );
};
