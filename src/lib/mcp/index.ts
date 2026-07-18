import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listLearningPaths from "./tools/list-learning-paths";
import listModules from "./tools/list-modules";
import listExperiments from "./tools/list-experiments";
import listCareerAreas from "./tools/list-career-areas";
import listBlogPosts from "./tools/list-blog-posts";
import getMyProgress from "./tools/get-my-progress";

// The OAuth issuer must be the direct supabase.co host. Build it from the
// project ref (inlined at build time by Vite) so this stays import-safe.
const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "ciencia-magica-meninas-mcp",
  title: "Ciência Mágica Meninas MCP",
  version: "0.1.0",
  instructions:
    "Ferramentas do app Ciência Mágica Meninas: consulta a trilhas de aprendizagem, módulos, experimentos do laboratório, áreas de atuação (carreiras STEM), posts do blog e o progresso da usuária autenticada. Todas as ferramentas respeitam as permissões da conta conectada.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [
    listLearningPaths,
    listModules,
    listExperiments,
    listCareerAreas,
    listBlogPosts,
    getMyProgress,
  ],
});