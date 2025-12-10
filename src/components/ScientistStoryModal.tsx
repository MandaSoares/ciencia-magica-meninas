import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Award, Calendar, BookOpen } from "lucide-react";

interface Scientist {
  name: string;
  field: string;
  year: string;
  image: string;
  achievement: string;
  description: string;
  facts: string[];
  fullStory: string;
}

interface ScientistStoryModalProps {
  scientist: Scientist | null;
  isOpen: boolean;
  onClose: () => void;
  areaLabel: string;
}

export const ScientistStoryModal = ({ 
  scientist, 
  isOpen, 
  onClose,
  areaLabel 
}: ScientistStoryModalProps) => {
  if (!scientist) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center space-x-4">
            <img
              src={scientist.image}
              alt={scientist.name}
              className="w-20 h-20 rounded-full object-cover"
            />
            <div>
              <DialogTitle className="text-2xl">{scientist.name}</DialogTitle>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                  {scientist.field}
                </Badge>
                <span className="text-sm text-gray-500">{scientist.year}</span>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Achievement */}
          <div className="flex items-start space-x-3 p-4 bg-yellow-50 rounded-lg">
            <Award className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-800">Principal Conquista</h3>
              <p className="text-gray-700">{scientist.achievement}</p>
            </div>
          </div>

          {/* Full Story */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-purple-500" />
              <h3 className="text-lg font-semibold text-gray-800">História Completa</h3>
            </div>
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {scientist.fullStory}
              </p>
            </div>
          </div>

          {/* Interesting Facts */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-800">Fatos Interessantes</h3>
            <ul className="space-y-2">
              {scientist.facts.map((fact, index) => (
                <li key={index} className="flex items-start">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">{fact}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Timeline */}
          <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded-lg">
            <Calendar className="w-5 h-5 text-gray-500" />
            <span className="text-gray-600">Período de vida: {scientist.year}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
