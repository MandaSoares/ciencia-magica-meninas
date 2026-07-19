import { Instagram } from "lucide-react";

interface FooterProps {
  onNavigate?: (page: string) => void;
}

export const Footer = ({ onNavigate }: FooterProps) => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-8 transition-colors">
      <div className="max-w-4xl mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => onNavigate?.('about')}
              className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors text-sm font-medium"
            >
              Sobre o Projeto
            </button>
            <button
              onClick={() => onNavigate?.('blog')}
              className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors text-sm font-medium"
            >
              Blog
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Siga-nos:</span>
            <a
              href="https://instagram.com/conscientistas"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white hover:opacity-90 transition-opacity"
            >
              <Instagram className="w-4 h-4" />
            </a>
          </div>
        </div>
        
        <div className="text-center mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            © 2025 Conscientistas. Inspirando meninas a descobrir o mundo STEM.
          </p>
        </div>
      </div>
    </footer>
  );
};
