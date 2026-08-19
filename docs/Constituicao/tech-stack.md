# Stack tecnológica

Este documento é a fonte de verdade das tecnologias do projeto. Nenhuma dependência é instalada sem estar listada aqui; incluir uma dependência exige alterar este documento primeiro.

## Linguagem, runtime e framework

| Item | Decisão |
| --- | --- |
| Gerenciador de pacotes | pnpm |
| Linguagem | TypeScript em modo `strict` |
| Framework de aplicação | Next.js 15 com App Router |
| Biblioteca de UI | React 19, Server Components por padrão |

A aplicação é uma única aplicação web Next.js. Não há back-end separado, nem API pública, nem cliente móvel.

## Dados

| Item | Decisão |
| --- | --- |
| Banco de dados | PostgreSQL |
| Acesso a dados | Prisma, único caminho de acesso ao banco |
| Evolução do schema | Prisma Migrate |

Nenhum outro cliente de banco, ORM, query builder ou ferramenta de migration é permitido. SQL escrito à mão é permitido apenas via Prisma (`$queryRaw` / `$executeRaw`) e apenas dentro de repositórios, para o bloqueio de linha exigido pela invariante de saldo descrita em [`arquitetura.md`](./arquitetura.md).

## Validação

| Item | Decisão |
| --- | --- |
| Validação de dados de entrada | Zod |

Cada entrada de dados tem um único schema Zod, compartilhado entre o formulário e o servidor. Não existem duas definições da mesma validação.

## Autenticação

| Item | Decisão |
| --- | --- |
| Autenticação | Auth.js v5, provider Credentials |
| Sessão | Cookie `httpOnly`, expiração absoluta de 8 horas |
| Hash de senha | argon2id, via `@node-rs/argon2` |

A expiração é absoluta: passadas 8 horas do login, a sessão termina independentemente de atividade e o usuário autentica de novo. Não existe renovação por uso nem opção de "lembrar-me".

## Interface

| Item | Decisão |
| --- | --- |
| Estilos | Tailwind CSS |
| Componentes | shadcn/ui, com os componentes copiados para o repositório |

Componentes de shadcn/ui fazem parte do código do projeto e são versionados como código próprio.

## Testes

| Faixa | Ferramenta | Situação |
| --- | --- | --- |
| Domínio e casos de uso | Vitest | Vigente |
| Integração de repositório contra PostgreSQL local | Vitest | Adiado |
| Ponta a ponta | Playwright | Adiado |

As faixas adiadas estão registradas como decisão, mas não valem hoje: nenhuma change é bloqueada por elas e o portão local descrito em [`conventions.md`](./conventions.md) não as executa. Ligar uma faixa adiada exige alterar este documento.

## Qualidade de código

| Item | Decisão |
| --- | --- |
| Lint | ESLint |
| Formatação | Prettier |
| Integração contínua | Nenhuma |

Não há ferramenta de integração contínua. A verificação de lint, formatação, checagem de tipos e Vitest é local, na forma definida em [`conventions.md`](./conventions.md). Playwright não faz parte do portão local enquanto a faixa de ponta a ponta estiver adiada.

## Configuração por ambiente

Variável de ambiente é a única forma de configuração do sistema. Não existe arquivo de configuração com valor de ambiente, nem valor de ambiente definido por outro meio.

- `.env.example` é versionado, lista todas as variáveis exigidas e não contém valor real.
- `.env` e qualquer variante com valor real nunca são versionados.
- Nenhuma credencial, segredo, URL de banco ou chave aparece no código, em teste, em seed ou em documentação.
- Variável nova exige atualizar o `.env.example` na mesma change.

## Versões

Os majors fixados são: Next.js 15, React 19, Auth.js 5. Para as demais dependências desta lista, o major é escolhido na configuração inicial do repositório e travado no lockfile do pnpm. Atualizar um major de qualquer item deste documento exige alterar este documento.

O lockfile é versionado e as instalações usam `pnpm install --frozen-lockfile` fora do desenvolvimento local.

## Proibições

Não instalar, importar nem introduzir:

- **Outro gerenciador de pacotes:** npm ou yarn. Não versionar `package-lock.json` nem `yarn.lock`.
- **Outro acesso a dados:** Drizzle, TypeORM, Sequelize, Knex, `pg` usado diretamente, ou qualquer cliente de banco fora do Prisma.
- **Outra ferramenta de schema:** migrations escritas fora do Prisma Migrate, `prisma db push` em ambiente compartilhado, triggers, procedures ou views que contenham regra de negócio.
- **Outra biblioteca de validação:** Yup, Joi, class-validator, Valibot, ou validação manual que substitua o schema Zod.
- **Outra biblioteca de autenticação ou de hash:** Passport, Lucia, jsonwebtoken, bcrypt, scrypt, ou hash implementado no projeto.
- **Outro sistema de estilo ou de componentes:** Material UI, Chakra, Ant Design, Bootstrap, ou CSS-in-JS (styled-components, Emotion).
- **Bibliotecas de estado global ou de busca de dados no cliente:** Redux, Zustand, Jotai, MobX, TanStack Query, SWR, axios, tRPC. Dados chegam à tela por Server Components; escrita acontece por Server Actions.
- **Outras ferramentas de teste:** Jest, Mocha, Jasmine, Cypress, Testing Library, ou qualquer biblioteca de teste de componente. A pirâmide de testes é a definida em [`conventions.md`](./conventions.md).
- **Biblioteca de datas:** date-fns, Day.js, Luxon, Moment. Datas e fusos usam as APIs nativas de JavaScript (`Date`, `Intl`) e os tipos de data do PostgreSQL.
- **Serviços externos:** fila, cache distribuído, storage de arquivos, serviço de e-mail, provedor de observabilidade ou qualquer integração de terceiros. Nada disso está no domínio descrito em `docs/prds/minimundo.md`. Erro inesperado vai para o log padrão do servidor e nada além disso.
- **Serviço ou plataforma de integração contínua**, incluindo workflows do GitHub Actions e hooks de git que rodem a suíte de testes.
- **Geradores de código ou scaffolding** que produzam código não revisado no repositório, com a exceção explícita do CLI do shadcn/ui.
