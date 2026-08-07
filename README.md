# Template SDD com OpenSpec

Este repositório é um ponto de partida para organizar projetos com Spec-Driven Development (SDD) e [OpenSpec](https://openspec.dev/). Ele não inclui uma aplicação ou stack pronta: cada equipe define as escolhas técnicas e implementa o próprio projeto.

## O que este template oferece

- Estrutura de documentação de produto por tela em `docs/prds/`.
- Documentos de constituição para registrar stack, arquitetura e convenções em `docs/Constituicao/`.
- Configuração e regras do OpenSpec em `openspec/config.yaml`.
- Instruções para agentes em `AGENTS.md`, `docs/AGENTS.md` e `docs/prds/AGENTS.md`.

## PRDs são opcionais

Os PRDs ajudam a transformar uma necessidade de produto em uma change mais clara: registram o comportamento esperado das telas, regras e critérios de aceite antes da proposta e da implementação. Eles são recomendados quando o projeto possui interface, fluxos ou regras de negócio que precisam ser alinhados.

Se o projeto não for usar essa dinâmica, remova a pasta `docs/prds/` e retire as referências a ela destes arquivos:

- `docs/AGENTS.md` — seção **PRDs**;
- `openspec/config.yaml` — referências a `docs/prds/AGENTS.md` e `docs/prds/` no campo `context`.

O restante do fluxo do OpenSpec continua funcionando normalmente sem PRDs.

## Pré-requisitos

- Git
- Node.js 20.19 ou superior
- Um assistente de código compatível com as instruções do repositório

Verifique a versão do Node.js:

```bash
node --version
```

## Começando

Instale o OpenSpec globalmente:

```bash
npm install -g @fission-ai/openspec@latest
```

Verifique a instalação:

```bash
openspec --version
openspec list
```

> O OpenSpec já está inicializado neste repositório. Não é necessário executar `openspec init` após o clone.

## Como usar o repositório

### 1. Registre as decisões técnicas

Preencha, conforme necessário:

- `docs/Constituicao/tech-stack.md`
- `docs/Constituicao/arquitetura.md`
- `docs/Constituicao/conventions.md`

### 2. Organize os requisitos de produto

Crie `docs/prds/PRD-00-indice.md` a partir de `docs/prds/TEMPLATE_PRD_INDICE.md` para listar as telas e seus fluxos.

Para cada tela relevante, crie um arquivo `PRD-XX-<nome-da-tela>.md` a partir de `docs/prds/TEMPLATE_PRD_TELA.md`.

Os templates são somente uma base: adapte a documentação ao que fizer sentido para o projeto. Depois de criar os PRDs necessários, remova `TEMPLATE_PRD_INDICE.md` e `TEMPLATE_PRD_TELA.md` para que apenas os documentos reais do projeto permaneçam no diretório.

### 3. Crie uma change no OpenSpec

Com os PRDs e documentos técnicos relevantes preenchidos, peça ao assistente de código para explorar e propor a mudança. Exemplos:

```text
Explore o fluxo de cadastro de clientes usando os PRDs relacionados.
```

```text
Crie uma change OpenSpec para implementar a tela de cadastro de clientes.
```

A change reúne os artefatos de planejamento em `openspec/changes/<nome-da-change>/`:

- `proposal.md`: objetivo, escopo e não-objetivos;
- `design.md`: decisões técnicas, alternativas e riscos;
- `specs/`: requisitos e cenários;
- `tasks.md`: etapas de implementação e validação.

### 4. Implemente e valide

Depois que a change estiver pronta, peça ao assistente para implementar as tarefas. Ao final, valide a mudança:

```bash
/openspec apply <nome-da-change>
```

Quando a implementação estiver concluída, arquive a change para preservar o histórico:

```bash
/openspec archive <nome-da-change>
```

## Fluxo resumido

```text
Decisões técnicas + PRDs
          ↓
Change OpenSpec
          ↓
Implementação
          ↓
Validação e arquivamento
```

## Documentação Oficial do OpenSpec


```
Consulte a [documentação oficial do openspec](https://openspec.dev/docs) e a [referência da CLI](https://openspec.dev/docs/reference/cli) para outras opções de instalação e comandos.  

```
