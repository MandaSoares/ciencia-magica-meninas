import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, Target, Users, Sparkles, BookOpen, Award, Globe } from "lucide-react";

interface AboutProps {
  onBack: () => void;
}

export const About = ({ onBack }: AboutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="max-w-4xl mx-auto p-6">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Sobre o ScienceGirls
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Inspirando meninas a descobrir o fascinante mundo da ciência, tecnologia, engenharia e matemática.
          </p>
        </div>

        <div className="grid gap-8 mb-12">
          <Card className="p-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-3">Nossa Missão</h2>
                <p className="text-gray-600 leading-relaxed">
                  Acreditamos que toda menina tem potencial para se tornar uma cientista, engenheira, programadora ou matemática. 
                  Nossa missão é quebrar barreiras e estereótipos, oferecendo uma plataforma educacional gamificada que torna 
                  o aprendizado de STEM divertido, acessível e inspirador.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Heart className="w-6 h-6 text-pink-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-3">Por Que Existimos</h2>
                <p className="text-gray-600 leading-relaxed">
                  Estudos mostram que meninas começam a perder interesse em STEM já na infância, muitas vezes por falta de 
                  representatividade e incentivo. O ScienceGirls nasceu para mudar essa realidade, apresentando modelos 
                  inspiradores de mulheres cientistas e criando experiências de aprendizado que valorizam a curiosidade 
                  e a criatividade feminina.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-3">Como Funciona</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Nossa plataforma oferece uma jornada de aprendizado personalizada:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    <strong>Trilhas:</strong> Conteúdos introdutórios rápidos para despertar interesse
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                    <strong>Módulos:</strong> Cursos completos com projetos finais e certificados
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <strong>Laboratório Virtual:</strong> Experimentos práticos e seguros
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <strong>Áreas de Atuação:</strong> Carreiras inspiradoras de mulheres em STEM
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-2">10.000+</h3>
            <p className="text-gray-600">Meninas aprendendo</p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-2">5.000+</h3>
            <p className="text-gray-600">Certificados emitidos</p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-2">50+</h3>
            <p className="text-gray-600">Módulos disponíveis</p>
          </Card>
        </div>

        <Card className="p-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Junte-se a nós!</h2>
          <p className="mb-6 opacity-90">
            Faça parte dessa comunidade de meninas incríveis que estão transformando o futuro através da ciência.
          </p>
          <Button 
            onClick={onBack}
            className="bg-white text-purple-600 hover:bg-gray-100"
          >
            Começar a Aprender
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default About;
