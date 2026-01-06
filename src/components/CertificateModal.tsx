import { useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Share2, Award } from "lucide-react";

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  moduleName: string;
  completionDate: string;
  moduleHours?: string;
}

export const CertificateModal = ({
  isOpen,
  onClose,
  userName,
  moduleName,
  completionDate,
  moduleHours = "3 horas",
}: CertificateModalProps) => {
  const certificateRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    // In a real app, this would generate a PDF
    alert("Certificado baixado! (Em um app real, geraria um PDF)");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Certificado de ${moduleName}`,
        text: `${userName} completou o módulo ${moduleName} no ScienceGirls!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(
        `🎉 ${userName} completou o módulo "${moduleName}" no ScienceGirls! #ScienceGirls #STEM`
      );
      alert("Link copiado para a área de transferência!");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Award className="w-6 h-6 text-yellow-500" />
            <span>Parabéns! Você ganhou um certificado!</span>
          </DialogTitle>
        </DialogHeader>

        {/* Certificate Preview */}
        <div
          ref={certificateRef}
          className="bg-gradient-to-br from-purple-100 via-pink-50 to-purple-100 p-8 rounded-lg border-4 border-purple-300 relative overflow-hidden"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-purple-400 rounded-tl-lg"></div>
          <div className="absolute top-0 right-0 w-20 h-20 border-t-4 border-r-4 border-purple-400 rounded-tr-lg"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 border-b-4 border-l-4 border-purple-400 rounded-bl-lg"></div>
          <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-purple-400 rounded-br-lg"></div>

          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Award className="w-10 h-10 text-white" />
              </div>
            </div>

            <h2 className="text-3xl font-bold text-purple-800">
              Certificado de Conclusão
            </h2>

            <p className="text-gray-600">Este certificado é conferido a</p>

            <h3 className="text-2xl font-bold text-gray-800 py-2 border-b-2 border-purple-300 inline-block">
              {userName}
            </h3>

            <p className="text-gray-600">
              por concluir com sucesso o módulo
            </p>

            <h4 className="text-xl font-semibold text-purple-700">
              "{moduleName}"
            </h4>

            <div className="pt-4">
              <p className="text-sm text-gray-500">
                Carga horária: {moduleHours}
              </p>
              <p className="text-sm text-gray-500">
                Concluído em {completionDate}
              </p>
            </div>

            <div className="pt-6 flex justify-center">
              <div className="text-center">
                <div className="w-48 border-t-2 border-purple-400 mx-auto mb-2"></div>
                <p className="text-lg font-script italic text-purple-700">Maria Silva Santos</p>
                <p className="text-xs text-gray-500">Diretora de Educação</p>
                <p className="text-sm font-semibold text-purple-600 mt-1">ScienceGirls</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-4 mt-4">
          <Button
            onClick={handleDownload}
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <Download className="w-4 h-4 mr-2" />
            Baixar Certificado
          </Button>
          <Button
            onClick={handleShare}
            variant="outline"
            className="flex-1"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Compartilhar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
