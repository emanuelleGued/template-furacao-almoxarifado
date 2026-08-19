## Why

O repositório tem a documentação completa da POC — minimundo, sete PRDs de tela e a constituição — e agora tem também uma referência visual fechada, o `Almoxarifado IDE.IA.dc.html`, que desenha todas as telas sobre o design system do laboratório IDE.IA. Não tem uma linha de código: `src/`, `app/` e `package.json` não existem.

Esta change constrói a aplicação descrita por esses documentos. Ela existe agora porque a referência visual foi o último insumo que faltava: até aqui, implementar qualquer tela exigiria inventar aparência, e inventar aparência num projeto que já tem marca é retrabalho garantido.

## What Changes

- **Inicialização do projeto.** Aplicação Next.js 15 com App Router, TypeScript `strict`, Tailwind, shadcn/ui, Prisma sobre PostgreSQL e Vitest, exatamente na composição fixada em `docs/Constituicao/tech-stack.md`. Nenhuma dependência fora daquela lista.
- **As quatro camadas** de `docs/Constituicao/arquitetura.md`, com o domínio isolado de Next.js e de Prisma.
- **As sete telas da POC**, uma por rota, conforme a tabela de telas do `PRD-00-indice.md`: `/login`, `/materiais`, `/materiais/novo`, `/materiais/:codigo`, `/materiais/:codigo/editar`, `/materiais/:codigo/movimentacoes/nova` e `/usuarios/novo`. Mais os dois diálogos de confirmação — estorno e exclusão — que a referência visual posiciona dentro da ficha.
- **A identidade IDE.IA aplicada a uma superfície de produto.** Os tokens de cor do design system entram integralmente; a escala tipográfica e a de espaçamento, não — ver a decisão registrada em `design.md`.
- **O primeiro usuário semeado**, porque a tela de cadastro exige sessão ativa (decisão *Primeiro usuário semeado*, `PRD-00-indice.md`).
- **Um comportamento que a referência visual acrescenta aos PRDs:** ao tentar cadastrar um material com nome já existente, a tela oferece abrir o material existente em vez de apenas recusar. Nenhum PRD descreve isso. Entra como requisito novo, registrado aqui de forma explícita para não passar como detalhe de implementação.

## Capabilities

### New Capabilities

- `casca-da-aplicacao` — navegação entre as áreas com sessão ativa, marca, encerramento de sessão e o retorno visível de uma ação concluída.
- `autenticacao` — entrada no sistema, guarda das telas com sessão e saída. Cobre PRD-01.
- `consulta-de-materiais` — listar, buscar, filtrar, ordenar e paginar o catálogo, com o aviso de estoque mínimo e os dois estados vazios. Cobre PRD-02.
- `cadastro-de-materiais` — criar e alterar material, com as validações compartilhadas entre as duas operações. Cobre PRD-03 e PRD-04.
- `ficha-do-material` — dados do material, saldo atual, histórico de movimentações e exclusão. Cobre PRD-05.
- `movimentacoes` — registrar entrada e saída, e estornar uma movimentação existente. Cobre PRD-06.
- `cadastro-de-usuarios` — criar usuário com acesso ao sistema. Cobre PRD-07.

### Modified Capabilities

Nenhuma. `openspec/specs/` está vazio; toda capacidade desta change é nova.

## Impact

- **Código:** o repositório inteiro. Não há código anterior a alterar ou quebrar.
- **Banco:** primeiro schema Prisma e primeira migration. Exige PostgreSQL disponível em desenvolvimento — hoje o projeto não documenta como subi-lo.
- **Configuração:** primeiro `.env.example`, com a URL do banco e o segredo do Auth.js.
- **Documentação:** resolvida nesta change. O `PRD-00-indice.md` ganhou a decisão **Escala da quantidade**, e `docs/Constituicao/arquitetura.md` passou a citá-la pelo nome, no lugar da referência `D-03` que apontava para o vazio.
- **Ferramental:** o CLI do OpenSpec exige Node 20+. O repositório está em Node 16.20.2, onde `openspec` falha ao carregar. Node 20.19.2 já está instalado na máquina.

## Não-objetivos

Fora de escopo por decisão já registrada na tabela de cortes do `PRD-00-indice.md`: alteração, inativação e reativação de usuários; destaque de material próximo do vencimento; relatórios; e qualquer sistema de notificação de estoque mínimo — o mínimo permanece como campo do cadastro e aviso na consulta.

Fora de escopo por decisão desta change:

- **Tela de lista de usuários.** O PRD-07 registra que ela não existe nesta POC.
- **Níveis de permissão.** Todo usuário é administrador (*Usuário*, `PRD-00-indice.md`).
- **Testes de integração de repositório e de ponta a ponta.** Ambas as faixas estão adiadas em `tech-stack.md`; ligá-las exige alterar aquele documento.
- **Integração contínua.** Proibida em `tech-stack.md`.
- **Modo escuro.** A referência visual desenha uma única superfície clara.

## Pergunta bloqueante resolvida

**Qual a escala decimal da quantidade?** A pergunta existia porque `arquitetura.md` remetia a uma decisão `D-03` do `PRD-00-indice.md` que não estava lá — o PRD-00 nunca numerou decisões, e nenhum de seus itens tratava de escala. Sem ela não era possível escrever o tipo da coluna no Prisma, o construtor de `Quantidade` nem o schema Zod.

Resolvida antes do início da implementação: o `PRD-00-indice.md` passou a registrar a decisão **Escala da quantidade** — três casas decimais para toda unidade de medida, com a exibição cortando os zeros à direita. `arquitetura.md` cita a decisão pelo nome, como o resto da documentação faz com os invariantes.

Nenhuma fase desta change está bloqueada.
