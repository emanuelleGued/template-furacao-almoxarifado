# Convenções do projeto

Regras de escrita, nomeação, teste e colaboração. As camadas e as invariantes estão em [`arquitetura.md`](./arquitetura.md); as tecnologias estão em [`tech-stack.md`](./tech-stack.md).

## Idioma

| Onde | Idioma |
| --- | --- |
| Termos do domínio no código (identificadores, tipos, funções, tabelas, colunas) | Português |
| Estruturas exigidas pelo framework e pelas bibliotecas (`page.tsx`, `layout.tsx`, `loading.tsx`, props de componentes de shadcn/ui, chaves de configuração) | Como a ferramenta exige, em inglês |
| Mensagens exibidas ao usuário, rótulos, textos de erro e de confirmação | Português do Brasil |
| Comentários, documentação, PRDs, artefatos de OpenSpec e mensagens de commit | Português |
| Códigos de erro e nomes de enum no código e no banco | Português, sem acento |

Identificadores nunca usam acento nem cedilha: `movimentacao`, `perecivel`, `estoqueMinimo`. O texto exibido ao usuário usa a grafia correta: "movimentação", "perecível", "estoque mínimo".

**Os dois idiomas nunca se misturam dentro do mesmo identificador.** Um nome é inteiro em português ou inteiro em inglês, e o português é o padrão para tudo que nomeia domínio:

| Correto | Errado |
| --- | --- |
| `repositorioDeMateriais` | `materialRepository`, `materiaisRepo` |
| `calcularSaldo` | `calculateSaldo`, `getSaldoAtual` |
| `listaDeMovimentacoes` | `movimentacaoList`, `movimentacoesArray` |
| `FormularioDeSaida` | `SaidaForm`, `FormDeSaida` |
| `estoque_minimo` | `min_estoque`, `estoque_min_value` |

A regra vale para arquivos, pastas, tabelas, colunas, tipos, funções, variáveis e props. A exceção é o identificador que a ferramenta impõe (`page.tsx`, `params`, `searchParams`, props de componentes de shadcn/ui): ele fica inteiro em inglês, e o nome que envolve esse identificador não vira híbrido por causa dele.

Termos do domínio são usados exatamente como o minimundo os define: material, movimentação, entrada, saída, estorno, saldo, categoria, unidade de medida, local de guarda, estoque mínimo, usuário. Sinônimos como "produto", "item", "estoque" no lugar de "saldo", ou "transação" no lugar de "movimentação", não são aceitos no código nem na interface.

## Nomes

| Elemento | Convenção | Exemplo |
| --- | --- | --- |
| Arquivo e pasta | kebab-case | `registrar-saida.ts`, `unidade-de-medida.ts` |
| Arquivos reservados do App Router | nome exigido pelo Next.js | `page.tsx`, `layout.tsx`, `actions.ts` |
| Componente React | PascalCase no export, kebab-case no arquivo | `FormularioDeSaida` em `formulario-de-saida.tsx` |
| Função, método e variável | camelCase, verbo no início para função | `calcularSaldo`, `registrarSaida`, `saldoAtual` |
| Caso de uso | verbo no infinitivo, nome do domínio | `cadastrarMaterial`, `estornarMovimentacao` |
| Tipo, interface e classe | PascalCase, sem prefixo `I` | `Material`, `RepositorioDeMateriais` |
| Erro de domínio | PascalCase começando por `ErroDe` | `ErroDeSaldoInsuficiente`, `ErroDeNomeDuplicado` |
| Constante de módulo | SCREAMING_SNAKE_CASE | `ITENS_POR_PAGINA` |
| Model do Prisma | PascalCase singular | `Material`, `Movimentacao`, `Usuario` |
| Tabela | snake_case plural, via `@@map` | `materiais`, `movimentacoes`, `usuarios` |
| Coluna | snake_case, via `@map` | `estoque_minimo`, `data_de_validade`, `criado_em` |
| Enum e seus membros | Tipo em PascalCase; membro em SCREAMING_SNAKE_CASE, idêntico ao valor persistido no banco | `Categoria.PERECIVEL`, `Categoria.COMPONENTE_DE_TI`, `UnidadeDeMedida.RESMA` |
| Schema Zod | camelCase começando por `schemaDe` | `schemaDeCadastroDeMaterial`, `schemaDeRegistroDeSaida` |
| Teste de Vitest | mesmo nome do arquivo testado, com sufixo `.test.ts` | `calcular-saldo.test.ts` |
| Teste de Playwright | kebab-case do fluxo, com sufixo `.spec.ts`, em `tests/e2e` | `tests/e2e/registrar-saida.spec.ts` |

Booleanos são afirmativos: `ativo`, `vencido`. Nunca `naoAtivo` nem `inativo` como campo de negação.

Nenhum sufixo em inglês é usado para nomear construção do projeto: não existe `...Error`, `...Schema`, `...Service`, `...Dto`. O membro de enum no TypeScript é escrito exatamente como o valor persistido no banco, sem camada de tradução entre os dois.

Os códigos de erro não seguem essa regra de nome porque não são identificadores: eles permanecem no formato `CONTEXTO.CAUSA` definido em [Mensagens de erro](#mensagens-de-erro), como `MOVIMENTACAO.SALDO_INSUFICIENTE`.

## `"use client"`

Server Component é o padrão. `"use client"` é exceção e exige uma destas razões:

- estado de formulário, foco ou validação em tempo real no cliente;
- manipulador de evento de interação (clique, digitação, seleção);
- componente de shadcn/ui que depende de estado do navegador (diálogo, popover, select).

Regras:

- `"use client"` nunca aparece em `page.tsx` nem em `layout.tsx`.
- A diretiva vai no componente mais interno possível. Um formulário interativo é um componente de cliente dentro de uma página de servidor, não uma página inteira convertida.
- Componente de cliente não busca dados: recebe por prop, do servidor, e escreve chamando uma Server Action.
- Componente de cliente não contém regra de negócio, conforme [`arquitetura.md`](./arquitetura.md).

## Testes

| Faixa | Ferramenta | O que cobre | Situação |
| --- | --- | --- | --- |
| Domínio | Vitest | Invariantes e cálculos, sem banco e sem I/O | **Vigente** |
| Caso de uso | Vitest | Fluxo completo da operação, com implementações em memória das portas, sem banco e sem I/O | **Vigente** |
| Integração de repositório | Vitest contra PostgreSQL local | Tradução linha–entidade, transação e bloqueio, incluindo o teste de saída concorrente da invariante 3 | **Adiado** |
| Ponta a ponta | Playwright | Fluxo do usuário na tela, contra a aplicação em execução | **Adiado** |

Faixa vigente é obrigatória e bloqueia a conclusão de uma change. Faixa adiada está registrada como decisão, mas não é escrita, não é executada e não bloqueia nada. Ligar uma faixa adiada exige alterar [`tech-stack.md`](./tech-stack.md) e esta seção.

Regras das faixas vigentes:

- Todo teste roda em Vitest, sem banco, sem servidor, sem rede e sem variável de ambiente. Teste que precise de qualquer um deles pertence a uma faixa adiada e não é escrito agora.
- Toda regra de negócio nasce com teste de domínio ou de caso de uso — o caminho válido e a violação que produz erro de domínio.
- Invariante de entidade é testada construindo a entidade diretamente, sem passar pelo schema Zod. Teste de schema cobre formato de entrada; teste de entidade cobre regra de negócio. Um não substitui o outro.
- As invariantes de [`arquitetura.md`](./arquitetura.md) que são verificáveis sem banco têm teste. As invariantes que só se observam contra o banco — o bloqueio da invariante 3 é o caso — continuam valendo como regra de arquitetura e são cobertas por revisão de código enquanto a faixa de integração estiver adiada.
- Teste não depende de ordem de execução, de dado deixado por outro teste, nem da data do sistema: a data atual entra como valor explícito.
- Não há integração contínua. O portão é local e obrigatório: antes de concluir qualquer change, o autor roda lint, checagem de formatação, checagem de tipos e Vitest na própria máquina, e todos passam. Playwright e integração de repositório não fazem parte do portão enquanto estiverem adiados. Nenhuma task é marcada como concluída sem essa execução.

### Rastreabilidade dos critérios de aceitação

**Todo critério de aceitação de um PRD (CA-xx) precisa de um teste automatizado em Vitest que cite o código do CA no nome do teste.** O código aparece no início do nome, no formato `CA-xx — descrição`:

```ts
it('CA-07 — recusa saída que deixaria o saldo negativo', () => { ... })
```

```ts
it('CA-12 — mantém filtro de categoria ao navegar entre páginas', () => { ... })
```

Enquanto a faixa de ponta a ponta estiver adiada, o CA de comportamento de tela é coberto no caso de uso que produz o dado da tela; nenhum CA fica sem teste por causa do adiamento.

Regras:

- Um CA pode ter mais de um teste; um teste pode citar mais de um CA, separando os códigos por vírgula.
- CA sem teste que cite seu código é change incompleta.
- Alterar um CA no PRD obriga a atualizar o teste que o cita.
- O código do CA é o do PRD da tela; a citação é literal, para que uma busca por `CA-07` encontre o requisito e o teste.

## Mensagens de erro

Toda mensagem exibida ao usuário:

- está em português do Brasil, em uma frase, com pontuação final;
- diz o que aconteceu e, quando existe ação possível, o que fazer;
- usa os termos do domínio como o usuário os vê na tela;
- não expõe nome de tabela, nome de coluna, SQL, stack trace nem nome de exceção;
- não culpa o usuário e não usa "erro inesperado" como texto único quando a causa é conhecida.

Cada erro de domínio tem código estável no formato `CONTEXTO.CAUSA`, em maiúsculas e sem acento: `MATERIAL.NOME_DUPLICADO`, `MATERIAL.UNIDADE_IMUTAVEL`, `MOVIMENTACAO.SALDO_INSUFICIENTE`, `USUARIO.INATIVO`. Código e mensagem padrão ficam juntos, no domínio, em um único catálogo — a tela não reescreve a mensagem do domínio.

Erro de validação de campo é exibido junto do campo. Erro de operação é exibido na tela que originou a ação. Erro inesperado registra o detalhe técnico no servidor e exibe uma única mensagem genérica.

## Migrations e seed

- Toda mudança de schema é uma migration do Prisma Migrate, versionada no repositório, na mesma change que o código que a usa.
- Nome da migration em snake_case e descritivo do efeito: `cria_tabela_movimentacoes`, `adiciona_indice_material_nome`.
- Migration já aplicada fora do ambiente local nunca é editada nem removida. Correção é uma migration nova.
- `prisma db push` e `prisma migrate reset` são permitidos apenas no banco local do desenvolvedor.
- Migration não contém regra de negócio: sem trigger, sem procedure, sem view que calcule saldo.
- Nenhuma migration cria coluna de saldo, nem apaga ou altera linhas de movimentações, nem remove usuários — isso violaria as invariantes de [`arquitetura.md`](./arquitetura.md).
- Migration que apaga coluna ou tabela com dados exige uma change própria, com o motivo registrado.
- Restrições de unicidade, chaves estrangeiras, `not null` e `check` que reforcem regras do domínio são declaradas no schema.
- Migration não insere dado de negócio. Carga de dado é seed, em script separado.
- O seed é idempotente: rodar duas vezes produz o mesmo estado. Ele lê configuração de variáveis de ambiente, nunca traz credencial no código, e não altera nem remove registro existente.
- O seed do primeiro administrador é o único dado que o seed cria, na forma definida em [`arquitetura.md`](./arquitetura.md). Não existe seed de material nem de movimentação em ambiente compartilhado.
- Variável de ambiente usada pelo seed segue a seção "Configuração por ambiente" de [`tech-stack.md`](./tech-stack.md).

## Commits

Formato Conventional Commits, com descrição em português, no imperativo, sem ponto final e com no máximo 72 caracteres na primeira linha:

```text
feat(material): registra estorno vinculado a movimentacao original
```

- Tipos aceitos: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `style`, `perf`, `build`, `ci`.
- O escopo, quando existir, é a área do domínio ou o diretório afetado: `material`, `movimentacao`, `usuario`, `auth`, `docs`, `skills`.
- Um commit resolve um assunto. Mudança de schema, código e teste da mesma regra podem estar no mesmo commit; refatoração ampla não se mistura com mudança de comportamento.
- O corpo do commit, quando necessário, explica o motivo e cita a change do OpenSpec ou o PRD afetado.

## TypeScript e lint

- `strict` ligado; `any` e `@ts-ignore` não são aceitos. Quando um tipo externo for insuficiente, o tipo é declarado no projeto.
- Sem asserção de não-nulo (`!`) para contornar tipo: a ausência é tratada explicitamente.
- Sem exportação default, exceto onde o Next.js exige (`page.tsx`, `layout.tsx`).
- Regra de lint desativada exige comentário na linha explicando o motivo.
- Prettier é a única autoridade de formatação; nenhuma discussão de formatação em revisão.
