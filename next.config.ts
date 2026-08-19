import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Existe um package-lock.json fora do repositorio, no diretorio do usuario.
  // Sem isto o Next elege aquele diretorio como raiz do workspace e rastreia
  // arquivos que nao pertencem ao projeto.
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
