import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// arquitetura.md, "Camadas e responsabilidades": a ordem das camadas e a ordem
// da dependencia. Web -> Aplicacao -> Dominio, com a Infraestrutura
// implementando as portas declaradas pela Aplicacao. As regras abaixo impedem
// que uma camada importe outra que ela nao pode conhecer.
const IMPORTS_PROIBIDOS_NO_DOMINIO = {
  paths: [
    { name: "next", message: "O dominio nao importa Next.js (arquitetura.md)." },
    { name: "react", message: "O dominio nao importa React (arquitetura.md)." },
    { name: "react-dom", message: "O dominio nao importa React (arquitetura.md)." },
    { name: "@prisma/client", message: "O dominio nao importa Prisma (arquitetura.md)." },
  ],
  patterns: [
    { group: ["next/*"], message: "O dominio nao importa Next.js (arquitetura.md)." },
    {
      group: ["@/app/*", "@/components/*", "@/application/*", "@/infrastructure/*", "@/lib/*"],
      message: "O dominio nao conhece as camadas Web, Aplicacao e Infraestrutura (arquitetura.md).",
    },
  ],
};

const IMPORTS_PROIBIDOS_NA_APLICACAO = {
  paths: [
    { name: "next", message: "A aplicacao nao conhece Next.js (arquitetura.md)." },
    { name: "react", message: "A aplicacao nao conhece React (arquitetura.md)." },
    { name: "react-dom", message: "A aplicacao nao conhece React (arquitetura.md)." },
    { name: "@prisma/client", message: "A aplicacao nao conhece Prisma (arquitetura.md)." },
  ],
  patterns: [
    { group: ["next/*"], message: "A aplicacao nao conhece Next.js (arquitetura.md)." },
    {
      group: ["@/app/*", "@/components/*", "@/infrastructure/*"],
      message:
        "A aplicacao declara portas; quem as implementa e a Infraestrutura, injetada pela camada Web (arquitetura.md).",
    },
  ],
};

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts"],
  },
  {
    files: ["src/domain/**/*.ts"],
    rules: {
      "no-restricted-imports": ["error", IMPORTS_PROIBIDOS_NO_DOMINIO],
    },
  },
  {
    files: ["src/application/**/*.ts"],
    rules: {
      "no-restricted-imports": ["error", IMPORTS_PROIBIDOS_NA_APLICACAO],
    },
  },
];

export default eslintConfig;
