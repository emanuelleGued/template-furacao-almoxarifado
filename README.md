# Almoxarifado — laboratório IDE.IA

Aplicação web para controlar os materiais do almoxarifado: cadastrar itens do catálogo, registrar
o que entra e o que sai, e acompanhar o saldo calculado a partir das movimentações.

O domínio está descrito em [`docs/prds/minimundo.md`](./docs/prds/minimundo.md), que é a única
fonte de verdade sobre as regras. O escopo desta POC, as telas e os invariantes estão em
[`docs/prds/PRD-00-indice.md`](./docs/prds/PRD-00-indice.md).

## Stack

Next.js 15 com App Router, React 19, TypeScript em modo `strict`, Tailwind CSS, shadcn/ui, Prisma
sobre PostgreSQL, Auth.js v5 e Vitest. As decisões estão fixadas em
[`docs/Constituicao/tech-stack.md`](./docs/Constituicao/tech-stack.md) — nenhuma dependência entra
no projeto sem constar lá primeiro.

## Pré-requisitos

- **Node.js 20.19 ou superior.** A versão está fixada em [`.nvmrc`](./.nvmrc); com nvm, rode
  `nvm use`. O CLI do OpenSpec também exige Node 20+.
- **pnpm**, habilitado pelo corepack:

  ```bash
  corepack enable pnpm
  ```

- **PostgreSQL**, na versão 16 ou superior.

## Subindo o PostgreSQL de desenvolvimento

Com Docker, um contêiner dedicado ao projeto resolve:

```bash
docker run -d \
  --name almoxarifado-db \
  -e POSTGRES_USER=almoxarifado \
  -e POSTGRES_PASSWORD=almoxarifado \
  -e POSTGRES_DB=almoxarifado \
  -p 5432:5432 \
  -v almoxarifado-db:/var/lib/postgresql/data \
  postgres:16
```

Depois disso, `docker start almoxarifado-db` e `docker stop almoxarifado-db` sobem e param a
instância. O volume `almoxarifado-db` preserva os dados entre reinícios.

Uma instalação nativa do PostgreSQL também serve; o que importa é ter um banco acessível e a URL
correspondente no `.env`.

## Configuração

Copie o exemplo versionado e preencha os valores:

```bash
cp .env.example .env
```

O [`.env.example`](./.env.example) lista todas as variáveis exigidas e descreve cada uma. Para o
contêiner sugerido acima, a URL de conexão é:

```text
DATABASE_URL=postgresql://almoxarifado:almoxarifado@localhost:5432/almoxarifado?schema=public
```

Gere o segredo da sessão com `openssl rand -base64 32` e preencha `AUTH_SECRET`. As variáveis
`USUARIO_INICIAL_*` definem o primeiro usuário, criado pelo seed — a tela de cadastro de usuário
exige sessão ativa, então alguém precisa existir antes dela.

O `.env` nunca é versionado, e nenhuma credencial aparece no código, em teste ou na documentação.

## Rodando

```bash
pnpm install
pnpm dev
```

## Portão local

Não há integração contínua. A verificação é local e obrigatória antes de concluir qualquer change:

```bash
pnpm verificar
```

O comando roda lint, checagem de formatação, checagem de tipos e Vitest, nessa ordem. As faixas de
teste de integração de repositório e de ponta a ponta estão adiadas e não fazem parte do portão —
ligá-las exige alterar [`docs/Constituicao/tech-stack.md`](./docs/Constituicao/tech-stack.md).

Cada etapa também roda isolada: `pnpm lint`, `pnpm format:check`, `pnpm typecheck`, `pnpm test`.

## Organização do código

As quatro camadas e as regras de quem pode importar quem estão em
[`docs/Constituicao/arquitetura.md`](./docs/Constituicao/arquitetura.md):

```text
src/app, src/components   Web — rotas, telas, Server Actions, componentes
src/application           Casos de uso, portas e modelos de leitura
src/domain                Regras de negócio em TypeScript puro
src/infrastructure        Prisma, repositórios, Auth.js, hash de senha
```

O ESLint impede que o domínio importe Next.js, React ou Prisma, e que a aplicação conheça a
infraestrutura. As convenções de nome, teste e commit estão em
[`docs/Constituicao/conventions.md`](./docs/Constituicao/conventions.md).

## Fluxo de trabalho

O projeto usa [OpenSpec](https://openspec.dev/) para planejar e registrar mudanças. Uma change
reúne os artefatos em `openspec/changes/<nome>/`:

- `proposal.md` — objetivo, escopo e não-objetivos;
- `design.md` — decisões técnicas, alternativas e riscos;
- `specs/` — requisitos e cenários;
- `tasks.md` — etapas de implementação e validação.

```bash
openspec list
openspec status --change <nome>
openspec validate <nome> --strict
```

As instruções para agentes estão em [`AGENTS.md`](./AGENTS.md),
[`docs/AGENTS.md`](./docs/AGENTS.md) e [`docs/prds/AGENTS.md`](./docs/prds/AGENTS.md).
