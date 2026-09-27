import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Brand } from "@/components/Brand";
import { StemBackdrop } from "@/components/StemBackdrop";

/**
 * RASCUNHO — revisar com advogada(o) antes do lançamento.
 * Preencher os campos entre [COLCHETES] (responsável, contato, encarregada).
 */
const CONTROLLER = "[NOME DA PESSOA OU ORGANIZAÇÃO RESPONSÁVEL] — [CPF/CNPJ]";
const CONTACT_EMAIL = "[privacidade@seudominio.com.br]";
const DPO = "[NOME DA ENCARREGADA PELO TRATAMENTO DE DADOS]";
const LAST_UPDATE = "[DD/MM/AAAA]";

const Shell = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="min-h-screen relative isolate">
    <StemBackdrop />
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="w-4 h-4" /> Voltar
      </Link>
      <div className="flex items-center gap-3 mb-6">
        <Brand size={40} textClassName="text-lg" />
      </div>
      <article className="bg-white/95 dark:bg-gray-800/95 rounded-3xl shadow-xl p-6 sm:p-10 prose prose-pink dark:prose-invert max-w-none">
        <h1>{title}</h1>
        <p className="text-sm text-muted-foreground">Última atualização: {LAST_UPDATE}</p>
        {children}
      </article>
      <nav className="flex gap-6 justify-center mt-6 text-sm text-muted-foreground">
        <Link to="/privacidade" className="hover:text-foreground">Privacidade</Link>
        <Link to="/termos" className="hover:text-foreground">Termos de Uso</Link>
      </nav>
    </div>
  </div>
);

export const PrivacyPolicy = () => (
  <Shell title="Política de Privacidade">
    <div className="not-prose rounded-2xl bg-pink-50 dark:bg-pink-500/10 p-4 mb-6 text-sm">
      <strong>Resumo para quem tem pressa:</strong> pedimos só o necessário para você estudar (nome ou apelido, email, idade e
      suas áreas favoritas). Não vendemos seus dados, não mostramos anúncios e não usamos rastreadores de publicidade. Você pode
      apagar sua conta e tudo o que está nela quando quiser, direto no seu perfil.
    </div>

    <h2>1. Quem cuida dos seus dados</h2>
    <p>
      A plataforma Conscientistas é mantida por {CONTROLLER} (a "controladora", nos termos da Lei Geral de Proteção de Dados —
      Lei nº 13.709/2018, "LGPD"). A encarregada pelo tratamento de dados pessoais é {DPO}, que pode ser contatada em{" "}
      {CONTACT_EMAIL}.
    </p>

    <h2>2. Crianças e adolescentes</h2>
    <p>
      O Conscientistas é feito para meninas a partir de 6 anos. Tratamos dados de crianças e adolescentes sempre no seu melhor
      interesse (art. 14 da LGPD e Estatuto da Criança e do Adolescente). Para crianças com menos de 12 anos, o cadastro exige o
      consentimento de pelo menos uma mãe, pai ou responsável legal. Responsáveis podem, a qualquer momento, pedir acesso,
      correção ou exclusão dos dados pelo email {CONTACT_EMAIL}.
    </p>

    <h2>3. Quais dados coletamos e por quê</h2>
    <ul>
      <li><strong>Cadastro:</strong> nome ou apelido, email, senha (guardada de forma criptografada — nem nós conseguimos ler) e idade. Usamos para criar sua conta, permitir o login e adaptar o conteúdo à sua idade.</li>
      <li><strong>Registro de consentimento:</strong> data em que os Termos foram aceitos e, quando aplicável, em que a pessoa responsável autorizou o cadastro.</li>
      <li><strong>Preferências:</strong> áreas de interesse (Ciências, Tecnologia, Engenharia, Matemática).</li>
      <li><strong>Foto de perfil (opcional):</strong> recomendamos usar um desenho ou avatar em vez de uma foto sua. A imagem é reduzida e os metadados (como localização) são removidos antes do envio.</li>
      <li><strong>Progresso:</strong> lições, módulos e experimentos concluídos, pontos e nível — para mostrar sua evolução e emitir certificados.</li>
      <li><strong>Comentários, curtidas e denúncias:</strong> o que você escreve nos fóruns fica visível para outras usuárias logadas, junto com seu nome e foto de perfil.</li>
      <li><strong>Dados técnicos:</strong> endereço IP, data e hora de acesso e informações do navegador, registrados pelos nossos provedores de infraestrutura por segurança e para cumprir o Marco Civil da Internet (Lei nº 12.965/2014).</li>
    </ul>
    <p>
      Não pedimos endereço, telefone, escola, CPF nem localização. <strong>Por segurança, os comentários bloqueiam links,
      emails, telefones e perfis de redes sociais.</strong>
    </p>

    <h2>4. Bases legais</h2>
    <p>
      Tratamos dados com base no consentimento (art. 7º, I e art. 14, §1º), na execução do serviço que você pediu (art. 7º, V),
      no cumprimento de obrigação legal (art. 7º, II) e no legítimo interesse de manter a plataforma segura (art. 7º, IX),
      sempre respeitando o melhor interesse de crianças e adolescentes.
    </p>

    <h2>5. Com quem compartilhamos</h2>
    <p>Não vendemos nem alugamos dados. Usamos apenas fornecedores necessários para o site funcionar:</p>
    <ul>
      <li><strong>Supabase</strong> — banco de dados, login e armazenamento de imagens (servidores podem estar fora do Brasil; a transferência segue o art. 33 da LGPD, com cláusulas contratuais de proteção).</li>
      <li><strong>[PROVEDOR DE HOSPEDAGEM, ex.: Vercel/Netlify]</strong> — entrega das páginas do site.</li>
      <li><strong>YouTube (modo de privacidade aprimorada)</strong> — alguns vídeos das lições são incorporados do YouTube pelo domínio youtube-nocookie.com.</li>
    </ul>
    <p>Também podemos compartilhar dados se uma autoridade exigir por lei ou ordem judicial.</p>

    <h2>6. Cookies e armazenamento no navegador</h2>
    <p>
      Não usamos cookies de publicidade nem de rastreamento. Guardamos no seu navegador apenas o necessário: a sessão de login,
      o tema (claro/escuro) e as configurações do lembrete de estudos.
    </p>

    <h2>7. Por quanto tempo guardamos</h2>
    <p>
      Enquanto sua conta existir. Ao excluir a conta, apagamos perfil, foto, progresso, comentários, curtidas e denúncias
      imediatamente. Registros técnicos de acesso podem ser mantidos por até 6 meses, como exige o Marco Civil da Internet, e
      backups são sobrescritos em até [X] dias.
    </p>

    <h2>8. Seus direitos</h2>
    <p>Você (ou sua pessoa responsável) pode, a qualquer momento (art. 18 da LGPD):</p>
    <ul>
      <li>confirmar se tratamos seus dados e acessá-los;</li>
      <li>corrigir dados incompletos ou errados (o nome, a idade e a foto podem ser editados no perfil);</li>
      <li>pedir a exclusão — pelo botão <em>Excluir minha conta</em> no perfil ou pelo email {CONTACT_EMAIL};</li>
      <li>revogar o consentimento;</li>
      <li>pedir a portabilidade dos dados;</li>
      <li>reclamar à Autoridade Nacional de Proteção de Dados (ANPD).</li>
    </ul>
    <p>Respondemos em até 15 dias.</p>

    <h2>9. Segurança</h2>
    <p>
      Usamos conexão criptografada (HTTPS), senhas com hash, controle de acesso por linha no banco de dados, moderação de
      comentários e acesso administrativo restrito. Se acontecer algum incidente de segurança que possa trazer risco a você,
      avisaremos você, as pessoas responsáveis e a ANPD, como manda a lei.
    </p>

    <h2>10. Mudanças nesta política</h2>
    <p>
      Se mudarmos algo importante, avisaremos na plataforma antes de a mudança valer e, quando necessário, pediremos um novo
      consentimento.
    </p>

    <h2>11. Contato</h2>
    <p>Dúvidas, pedidos ou reclamações: {CONTACT_EMAIL}.</p>
  </Shell>
);

export const TermsOfUse = () => (
  <Shell title="Termos de Uso">
    <h2>1. O que é o Conscientistas</h2>
    <p>
      Uma plataforma gratuita para meninas aprenderem Ciências, Tecnologia, Engenharia e Matemática com trilhas, módulos,
      experimentos e histórias de mulheres cientistas. É mantida por {CONTROLLER}.
    </p>

    <h2>2. Quem pode usar</h2>
    <p>
      Meninas a partir de 6 anos. Menores de 12 anos só podem se cadastrar com autorização de mãe, pai ou responsável legal, e
      recomendamos que responsáveis acompanhem o uso de crianças e adolescentes. Ao aceitar estes Termos, você declara que leu
      também a <Link to="/privacidade">Política de Privacidade</Link>.
    </p>

    <h2>3. Sua conta</h2>
    <ul>
      <li>Use só seu primeiro nome ou um apelido e uma senha forte, que você não compartilha com ninguém.</li>
      <li>Você é responsável pelo que acontece na sua conta. Se achar que alguém entrou nela, troque a senha e nos avise.</li>
      <li>Você pode excluir sua conta quando quiser, pelo seu perfil.</li>
    </ul>

    <h2>4. Regras de convivência</h2>
    <p>O Conscientistas é um espaço seguro e acolhedor. Nos comentários, não é permitido:</p>
    <ul>
      <li>xingar, ofender, humilhar ou praticar bullying;</li>
      <li>preconceito de qualquer tipo (racismo, machismo, LGBTfobia, capacitismo, gordofobia etc.);</li>
      <li>conteúdo sexual ou violento;</li>
      <li>compartilhar dados pessoais seus ou de outras pessoas (endereço, escola, telefone, email, redes sociais, links);</li>
      <li>convidar outras usuárias para conversas fora da plataforma;</li>
      <li>spam, propaganda ou se passar por outra pessoa.</li>
    </ul>
    <p>
      Se vir algo assim, use o botão de denúncia (bandeira). Comentários podem ser ocultados automaticamente após denúncias e
      são revisados pela moderação, que pode apagar conteúdos e suspender ou excluir contas que desrespeitem estas regras.
    </p>

    <h2>5. Conteúdo da plataforma</h2>
    <p>
      Textos, ilustrações, quizzes e materiais do Conscientistas são protegidos por direitos autorais e podem ser usados para
      estudo pessoal e em sala de aula, citando a fonte. Vídeos incorporados pertencem aos seus autores.
    </p>

    <h2>6. Experimentos</h2>
    <p>
      Alguns experimentos do Laboratório envolvem materiais do dia a dia. Faça-os sempre com a supervisão de uma pessoa adulta
      e siga as orientações de segurança de cada atividade.
    </p>

    <h2>7. Certificados e pontuação</h2>
    <p>
      Pontos, níveis, conquistas e certificados são formas de reconhecer seu esforço e não têm valor oficial de ensino,
      a menos que seja informado o contrário.
    </p>

    <h2>8. Disponibilidade</h2>
    <p>
      Fazemos o possível para manter o site no ar e seguro, mas ele pode ficar indisponível para manutenção ou por problemas
      técnicos. Podemos mudar ou encerrar funcionalidades, avisando com antecedência quando possível.
    </p>

    <h2>9. Mudanças nestes Termos</h2>
    <p>Se mudarmos algo importante, avisaremos na plataforma antes de a mudança valer.</p>

    <h2>10. Lei aplicável e contato</h2>
    <p>
      Estes Termos seguem as leis do Brasil. Fica eleito o foro do domicílio da usuária. Dúvidas: {CONTACT_EMAIL}.
    </p>
  </Shell>
);
