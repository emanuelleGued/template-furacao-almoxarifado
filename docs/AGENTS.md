# Documentação do projeto

Este diretório concentra os insumos de planejamento e as decisões de referência do projeto. Antes de propor ou implementar mudanças, consulte os documentos aplicáveis.

## PRDs

O diretório [`prds/`](./prds/) concentra a documentação de requisitos de produto do projeto. Seus arquivos descrevem o escopo e o comportamento esperado das telas e servem como referência para as changes e a implementação. Consulte [`prds/AGENTS.md`](./prds/AGENTS.md) para a organização interna do diretório.

## Constituição

O diretório [`Constituicao/`](./Constituicao/) registra decisões técnicas globais do projeto. Diferentemente dos PRDs, esses documentos não descrevem uma tela específica: eles definem as restrições e padrões que devem ser respeitados em todas as changes.

| Documento | O que representa |
| --- | --- |
| [`Constituicao/tech-stack.md`](./Constituicao/tech-stack.md) | Tecnologias, versões e dependências permitidas no projeto. |
| [`Constituicao/arquitetura.md`](./Constituicao/arquitetura.md) | Organização do sistema, responsabilidades dos componentes e regras de dependência. |
| [`Constituicao/conventions.md`](./Constituicao/conventions.md) | Padrões de código, testes, documentação e convenções em geral do repositório. |

Mantenha cada decisão no documento ao qual ela pertence. Este arquivo é somente um índice e guia de uso: não replique aqui o conteúdo dos PRDs ou da constituição.
