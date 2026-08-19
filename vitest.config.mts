import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    // Faixas vigentes: dominio e caso de uso. Ambas rodam sem banco, sem
    // servidor, sem rede e sem variavel de ambiente (conventions.md, Testes).
    environment: "node",
    include: ["src/**/*.test.ts"],
    // A suite ainda esta vazia; a fase 3 traz os primeiros testes de dominio.
    passWithNoTests: true,
  },
});
