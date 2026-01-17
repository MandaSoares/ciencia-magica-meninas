import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Bold, Italic, Underline, List, Link } from "lucide-react";
import { ImageUpload } from "./ImageUpload";

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

  const wrapSelection = (before: string, after: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    onChange(newText);
    
    // Reset cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const insertAtCursor = (text: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const newText = value.substring(0, start) + text + value.substring(start);
    onChange(newText);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + text.length, start + text.length);
    }, 0);
  };

  const handleBold = () => wrapSelection("**", "**");
  const handleItalic = () => wrapSelection("*", "*");
  const handleUnderline = () => wrapSelection("<u>", "</u>");
  const handleList = () => insertAtCursor("\n• ");
  const handleLink = () => {
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

  const handleImageInsert = (imageUrl: string) => {
    insertAtCursor(`\n![imagem](${imageUrl})\n`);
  };

  return (
    <div className="space-y-2">
      <Label>{label} {required && "*"}</Label>
      
      <div className="flex flex-wrap gap-1 p-2 bg-gray-100 rounded-t-lg border border-b-0 border-gray-200">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleBold}
          className="h-8 w-8 p-0"
          title="Negrito"
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleItalic}
          className="h-8 w-8 p-0"
          title="Itálico"
        >
          <Italic className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleUnderline}
          className="h-8 w-8 p-0"
          title="Sublinhado"
        >
          <Underline className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleList}
          className="h-8 w-8 p-0"
          title="Lista"
        >
          <List className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleLink}
          className="h-8 w-8 p-0"
          title="Link"
        >
          <Link className="w-4 h-4" />
        </Button>
      </div>

      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="rounded-t-none border-t-0"
      />

      {showImageUpload && (
        <div className="pt-2">
          <ImageUpload
            value=""
            onChange={handleImageInsert}
            label="Inserir Imagem no Texto"
            folder={imageFolder}
          />
        </div>
      )}

      <p className="text-xs text-gray-500">
        Dica: Use **texto** para negrito, *texto* para itálico
      </p>
    </div>
  );
};
