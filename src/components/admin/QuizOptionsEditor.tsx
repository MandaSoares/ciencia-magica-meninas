import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuizOption {
  letter: string;
  text: string;
}

interface QuizOptionsEditorProps {
  question: string;
  onQuestionChange: (question: string) => void;
  options: QuizOption[];
  onOptionsChange: (options: QuizOption[]) => void;
  correctAnswer: string;
  onCorrectAnswerChange: (answer: string) => void;
}

const LETTERS = ["A", "B", "C", "D", "E", "F"];

export const QuizOptionsEditor = ({
  question,
  onQuestionChange,
  options,
  onOptionsChange,
  correctAnswer,
  onCorrectAnswerChange
}: QuizOptionsEditorProps) => {
  const addOption = () => {
    if (options.length >= 6) return;
    const nextLetter = LETTERS[options.length];
    onOptionsChange([...options, { letter: nextLetter, text: "" }]);
  };

  const removeOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index);
    // Re-assign letters
    const reindexed = newOptions.map((opt, i) => ({
      ...opt,
      letter: LETTERS[i]
    }));
    onOptionsChange(reindexed);
    
    // Clear correct answer if it was the removed option
    const removedLetter = LETTERS[index];
    if (correctAnswer === removedLetter) {
      onCorrectAnswerChange("");
    } else if (LETTERS.indexOf(correctAnswer) > index) {
      // Adjust correct answer if it was after the removed option
      onCorrectAnswerChange(LETTERS[LETTERS.indexOf(correctAnswer) - 1]);
    }
  };

  const updateOptionText = (index: number, text: string) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], text };
    onOptionsChange(newOptions);
  };

  const setCorrectAnswer = (letter: string) => {
    onCorrectAnswerChange(letter);
  };

  // Generate content string for storage
  const generateContent = (): string => {
    let content = question + "\n";
    options.forEach(opt => {
      content += `${opt.letter}) ${opt.text}\n`;
    });
    return content.trim();
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Pergunta do Quiz *</Label>
        <Input
          value={question}
          onChange={(e) => onQuestionChange(e.target.value)}
          placeholder="Digite a pergunta do quiz..."
        />
      </div>

      <div className="space-y-2">
        <Label>Opções de Resposta</Label>
        {options.map((option, index) => (
          <div key={option.letter} className="flex items-center gap-2">
            <Button
              type="button"
              variant={correctAnswer === option.letter ? "default" : "outline"}
              size="sm"
              className={cn(
                "w-10 h-10 p-0 flex-shrink-0",
                correctAnswer === option.letter && "bg-green-500 hover:bg-green-600"
              )}
              onClick={() => setCorrectAnswer(option.letter)}
              title="Marcar como resposta correta"
            >
              {correctAnswer === option.letter ? (
                <Check className="w-4 h-4" />
              ) : (
                option.letter
              )}
            </Button>
            <Input
              value={option.text}
              onChange={(e) => updateOptionText(index, e.target.value)}
              placeholder={`Opção ${option.letter}`}
              className="flex-1"
            />
            {options.length > 2 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeOption(index)}
                className="h-10 w-10 p-0 text-red-500 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
      </div>

      {options.length < 6 && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addOption}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Opção {LETTERS[options.length]}
        </Button>
      )}

      {correctAnswer && (
        <p className="text-sm text-green-600">
          ✓ Resposta correta: {correctAnswer}
        </p>
      )}
      {!correctAnswer && options.length > 0 && (
        <p className="text-sm text-amber-600">
          Clique na letra para marcar a resposta correta
        </p>
      )}
    </div>
  );
};

// Helper to parse content back to options
export const parseQuizContent = (content: string): { question: string; options: { letter: string; text: string }[] } => {
  const lines = content.split('\n').filter(line => line.trim());
  let question = "";
  const options: { letter: string; text: string }[] = [];
  
  for (const line of lines) {
    const optionMatch = line.match(/^([A-F])\)\s*(.*)$/);
    if (optionMatch) {
      options.push({ letter: optionMatch[1], text: optionMatch[2] });
    } else if (!question) {
      question = line;
    }
  }
  
  return { question, options };
};

// Helper to convert options back to content string
export const optionsToContent = (question: string, options: { letter: string; text: string }[]): string => {
  let content = question + "\n";
  options.forEach(opt => {
    content += `${opt.letter}) ${opt.text}\n`;
  });
  return content.trim();
};
