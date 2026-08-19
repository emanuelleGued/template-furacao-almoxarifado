# Documentação do projeto

Este diretório concentra os insumos de planejamento e as decisões de referência do projeto. Antes de propor ou implementar mudanças, consulte os documentos aplicáveis.

## Pré-requisitos

**Ferramentas:** Node.js 20.19 ou superior e a CLI do OpenSpec instalada globalmente — ver [`README.md`](../README.md). Os comandos `openspec` falham em versões anteriores do Node; confirme com `node --version` antes de usar a CLI.

**Leitura obrigatória, nesta ordem:**

1. [`prds/minimundo.md`](./prds/minimundo.md) — o domínio.
2. [`prds/PRD-00-indice.md`](./prds/PRD-00-indice.md) — escopo, telas, funcionalidades e invariantes.
3. O PRD da tela afetada pela mudança.
4. Os documentos da [`Constituicao/`](./Constituicao/) que se aplicam ao escopo.

## Minimundo

[`prds/minimundo.md`](./prds/minimundo.md) é a **única fonte de verdade do domínio**. Requisito, campo, papel de usuário ou regra que não esteja lá não existe: não invente.

Não parafraseie o minimundo nos PRDs, nas changes ou no código — cite a seção de origem (por exemplo, "ver minimundo, *As movimentações e o saldo*") e escreva apenas o que aquele artefato acrescenta. Ambiguidade que bloqueia o trabalho vira pergunta ao responsável; ambiguidade que não bloqueia vira "Dúvida em aberto", nomeada pela funcionalidade afetada.

## PRDs

O diretório [`prds/`](./prds/) concentra a documentação de requisitos de produto. Consulte [`prds/AGENTS.md`](./prds/AGENTS.md) para a organização interna do diretório e [`prds/PRD-00-indice.md`](./prds/PRD-00-indice.md) como ponto de entrada.

Convenções em vigor:

- **Um PRD por tela, uma tela por rota.** Diálogos e confirmações não ganham PRD próprio: são ações dentro do PRD da tela que os hospeda.
- **Os invariantes do domínio estão escritos uma única vez**, em `PRD-00-indice.md`. Os demais PRDs, as changes e o design citam pelo nome e não repetem o texto.
- **PRD é enxuto por decisão:** até uma página, com 3 a 5 critérios de aceite. Documento longo aqui é defeito, não zelo.
- O escopo de cada funcionalidade — na POC ou fora dela — está na tabela de funcionalidades do `PRD-00-indice.md`. Ampliar escopo é decisão explícita, registrada ali.

## Constituição

O diretório [`Constituicao/`](./Constituicao/) registra decisões técnicas globais do projeto. Diferentemente dos PRDs, esses documentos não descrevem uma tela específica: eles definem as restrições e padrões que devem ser respeitados em todas as changes.

| Documento | O que representa | Situação |
| --- | --- | --- |
| [`Constituicao/tech-stack.md`](./Constituicao/tech-stack.md) | Tecnologias, versões e dependências permitidas no projeto. | Definido para a POC: Next.js com App Router, Prisma e SQLite, sobre Node.js 20.19 ou superior. |
| [`Constituicao/arquitetura.md`](./Constituicao/arquitetura.md) | Organização do sistema, responsabilidades dos componentes e regras de dependência. | Ainda sem decisões registradas. |
| [`Constituicao/conventions.md`](./Constituicao/conventions.md) | Padrões de código, testes, documentação e convenções em geral do repositório. | Ainda sem decisões registradas. |

Documento sem decisão registrada significa decisão não tomada: proponha e confirme antes de escrever, em vez de presumir. Mantenha cada decisão no documento ao qual ela pertence. Este arquivo é somente um índice e guia de uso: não replique aqui o conteúdo do minimundo, dos PRDs ou da constituição.
