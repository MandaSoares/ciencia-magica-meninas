import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ImageUpload } from "./ImageUpload";
import { Image } from "lucide-react";

interface EmojiPickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  showImageOption?: boolean;
  imageFolder?: string;
}

const EMOJI_CATEGORIES = {
  "Ciência": ["🔬", "🧪", "⚗️", "🔭", "🌡️", "💡", "⚡", "🔋", "🧲", "🔥", "💧", "🌪️", "🌈", "✨", "🌍", "🌙", "⭐", "☀️", "🌊", "🌱"],
  "Tecnologia": ["💻", "📱", "🖥️", "⌨️", "🖱️", "🔌", "💾", "📡", "🤖", "🎮", "📲", "💿", "🔧", "⚙️", "🛠️", "📟", "📠", "🔎", "💽", "🖨️"],
  "Engenharia": ["🏗️", "🏢", "🌉", "🚀", "✈️", "🚂", "🚗", "🛸", "⚙️", "🔩", "🔨", "🪛", "📐", "📏", "🧱", "🔧", "⛏️", "🪜", "🏭", "🛠️"],
  "Matemática": ["📊", "📈", "📉", "🔢", "➕", "➖", "✖️", "➗", "🎯", "📐", "📏", "🧮", "📝", "✏️", "💯", "🔷", "🔶", "🔴", "🟢", "🟡"],
  "Geral": ["📝", "📚", "🎨", "🎭", "🎵", "🎬", "🏆", "🥇", "🎓", "💪", "🙌", "👏", "🎉", "🎊", "❤️", "⭐", "🌟", "✨", "🔥", "💫"],
};

export const EmojiPicker = ({
  value,
  onChange,
  label = "Emoji",
  showImageOption = false,
  imageFolder = "step-images"
}: EmojiPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customEmoji, setCustomEmoji] = useState("");
  const [showImages, setShowImages] = useState(false);

  const isUrl = value?.startsWith("http");

  const handleEmojiSelect = (emoji: string) => {
    onChange(emoji);
    setIsOpen(false);
  };

  const handleCustomEmoji = () => {
    if (customEmoji.trim()) {
      onChange(customEmoji.trim());
      setCustomEmoji("");
      setIsOpen(false);
    }
  };

  const handleImageSelect = (url: string) => {
    onChange(url);
    setIsOpen(false);
    setShowImages(false);
  };

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start gap-2">
            {isUrl ? (
              <img src={value} alt="step" className="w-6 h-6 rounded object-cover" />
            ) : (
              <span className="text-xl">{value || "📝"}</span>
            )}
            <span className="text-gray-500">Clique para escolher</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-3" align="start">
          <div className="space-y-3">
            {showImageOption && (
              <div className="flex gap-2 mb-3">
                <Button
                  variant={!showImages ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowImages(false)}
                  className="flex-1"
                >
                  Emoji
                </Button>
                <Button
                  variant={showImages ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowImages(true)}
                  className="flex-1"
                >
                  <Image className="w-4 h-4 mr-1" />
                  Imagem
                </Button>
              </div>
            )}

            {showImages && showImageOption ? (
              <ImageUpload
                value=""
                onChange={handleImageSelect}
                label="Selecionar Imagem"
                folder={imageFolder}
              />
            ) : (
              <>
                {/* Custom Emoji Input */}
                <div className="flex gap-2">
                  <Input
                    value={customEmoji}
                    onChange={(e) => setCustomEmoji(e.target.value)}
                    placeholder="Cole um emoji aqui..."
                    className="flex-1"
                  />
                  <Button size="sm" onClick={handleCustomEmoji} disabled={!customEmoji.trim()}>
                    Usar
                  </Button>
                </div>

                {/* Emoji Categories */}
                <div className="max-h-64 overflow-y-auto space-y-3">
                  {Object.entries(EMOJI_CATEGORIES).map(([category, emojis]) => (
                    <div key={category}>
                      <p className="text-xs font-medium text-gray-500 mb-1">{category}</p>
                      <div className="grid grid-cols-10 gap-1">
                        {emojis.map((emoji) => (
                          <button
                            key={emoji}
                            onClick={() => handleEmojiSelect(emoji)}
                            className="w-7 h-7 text-lg hover:bg-gray-100 rounded flex items-center justify-center transition-colors"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
