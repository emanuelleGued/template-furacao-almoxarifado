# PRD-00 — Índice

## Projeto

- **Nome:** Controle de Almoxarifado — Laboratório IDE.IA
- **Objetivo:** substituir a planilha por um sistema em que o saldo é consequência das movimentações registradas, para que o saldo exibido corresponda ao que está na prateleira (ver minimundo, *Contexto*).
- **Escopo desta POC:** as funcionalidades marcadas como "na POC" na tabela de funcionalidades.

## Telas

| Tela | Rota | PRD | Status |
| --- | --- | --- | --- |
| Login | `/login` | [PRD-01](./PRD-01-login.md) | planejada |
| Consulta de materiais | `/materiais` | [PRD-02](./PRD-02-consulta-materiais.md) | planejada |
| Cadastro de material | `/materiais/novo` | [PRD-03](./PRD-03-cadastro-material.md) | planejada |
| Alteração de material | `/materiais/:codigo/editar` | [PRD-04](./PRD-04-alteracao-material.md) | planejada |
| Ficha do material | `/materiais/:codigo` | [PRD-05](./PRD-05-ficha-material.md) | planejada |
| Registrar movimentação | `/materiais/:codigo/movimentacoes/nova` | [PRD-06](./PRD-06-movimentacao.md) | planejada |
| Cadastro de usuário | `/usuarios/novo` | [PRD-07](./PRD-07-cadastro-usuario.md) | planejada |

## Funcionalidades e ações

| Funcionalidade | Ação | Escopo | PRD |
| --- | --- | --- | --- |
| Acesso | Entrar | na POC | PRD-01 |
| Acesso | Sair | na POC | PRD-01 |
| Usuários | Cadastrar usuário | na POC | PRD-07 |
| Usuários | Alterar dados e trocar senha | fora da POC | — |
| Usuários | Inativar e reativar | fora da POC | — |
| Catálogo de materiais | Criar material | na POC | PRD-03 |
| Catálogo de materiais | Alterar material | na POC | PRD-04 |
| Catálogo de materiais | Excluir material | na POC | PRD-05 |
| Catálogo de materiais | Ver ficha do material | na POC | PRD-05 |
| Consulta | Listar materiais paginados | na POC | PRD-02 |
| Consulta | Buscar por nome | na POC | PRD-02 |
| Consulta | Filtrar por categoria e por validade | na POC | PRD-02 |
| Consulta | Ordenar por nome e por saldo | na POC | PRD-02 |
| Movimentações e saldo | Registrar entrada | na POC | PRD-06 |
| Movimentações e saldo | Registrar saída | na POC | PRD-06 |
| Movimentações e saldo | Estornar movimentação | na POC | PRD-05 |
| Movimentações e saldo | Consultar histórico e saldo atual | na POC | PRD-05 |

Cortes desta POC: **Alteração, inativação e reativação de usuários** — o cadastro basta para dar acesso a quem opera, e ninguém é excluído de todo modo; corrigir dados e inativar podem esperar. **Destaque de próximo do vencimento** — a marcação de vencido já sustenta a decisão de descarte. **Relatórios** — ficha e histórico já entregam a rastreabilidade. O **estoque mínimo** permanece como campo do cadastro e aviso na consulta, sem sistema de notificação.

## Fluxo

```text
/login ──▶ /materiais ──┬──▶ /materiais/novo
                        │
                        ├──▶ /usuarios/novo   (pelo menu, de qualquer tela autenticada)
                        │
                        └──▶ /materiais/:codigo ──┬──▶ /materiais/:codigo/editar
                                                  ├──▶ /materiais/:codigo/movimentacoes/nova
                                                  ├──▶ estornar (confirmação na ficha)
                                                  └──▶ excluir (confirmação na ficha)
```

## Invariantes do domínio

Escritos aqui uma única vez. Os PRDs de tela citam pelo nome.

- **Saldo derivado** — o saldo é a soma das entradas menos a soma das saídas, nunca um campo informado ou editável (minimundo, *As movimentações e o saldo*).
- **Movimentação imutável** — movimentação gravada não é editada nem apagada; a correção é um estorno vinculado, com justificativa, e original e estorno permanecem visíveis no histórico (minimundo, *As movimentações e o saldo*).
- **Saída nunca negativa** — antes de gravar, o sistema recusa, com explicação, qualquer saída que deixaria o saldo negativo (minimundo, *As movimentações e o saldo*).
- **Unidade travada** — depois da primeira movimentação, a unidade de medida do material não pode mais ser alterada (minimundo, *O que é um material*).
- **Nome único e código imutável** — o nome do material não se repete; o código é gerado pelo sistema, único e nunca alterado (minimundo, *O que é um material*).
- **Exclusão só sem movimentação** — material com qualquer movimentação não pode ser excluído; a exclusão exige confirmação exibindo o nome (minimundo, *As operações sobre o cadastro*).
- **Usuário nunca excluído** — quem sai é inativado e pode ser reativado; o login vale só para usuário em atividade; a senha nunca é armazenada de forma legível; não há níveis de permissão (minimundo, *Usuários e acesso*).
- **Perecível com validade** — material perecível exige data de fabricação e data de validade; está vencido quando a validade é anterior à data atual (minimundo, *A categoria do material*).
- **Data e hora do servidor** — a data e a hora da movimentação são atribuídas pelo sistema, não informadas pelo usuário (minimundo, *As movimentações e o saldo*).

## Termos e decisões importantes

- **Material:** item do catálogo, não a unidade física. Novas compras do mesmo item são entradas, não novos cadastros.
- **Categoria:** perecível, componente de TI, uso comum, limpeza ou ferramenta. Organiza consulta e relatórios e pode ser corrigida a qualquer momento.
- **Unidade de medida:** unidade, caixa, pacote, resma, metro ou litro.
- **Motivo de entrada:** compra, doação ou devolução. **Motivo de saída:** pedido, consumo interno, descarte ou perda.
- **Campos obrigatórios do material:** nome, descrição, categoria, unidade de medida e local de guarda; para perecível, também fabricação e validade. Observações e estoque mínimo são opcionais, e o estoque mínimo nunca é negativo.
- **Rotas:** definidas nesta POC; o minimundo não trata de navegação.
- **Usuário:** todo usuário tem nível de administrador e acessa todas as funcionalidades. Não há perfis nem níveis de permissão.
- **Primeiro usuário semeado:** decisão desta POC. A instalação cria o primeiro usuário, porque a tela de cadastro exige sessão ativa.
- **Exclusão na ficha:** decisão desta POC. O botão fica apenas em `/materiais/:codigo`, onde os dados e a existência de histórico estão visíveis.

## Dúvidas em aberto

- **Consulta / paginação:** quantos materiais por página?
- **Catálogo / perecível:** a validade precisa ser posterior à data de fabricação? E a fabricação pode ser futura?
- **Movimentações / perecível vencido:** o sistema permite registrar saída de material vencido, ou apenas descarte?
- **Movimentações / estorno:** um estorno pode ser estornado?
- **Acesso:** a sessão expira por inatividade, ou só termina no logout?
- **Usuários / senha:** existe regra mínima de senha (tamanho, composição)?
- **Usuários / demais ações:** em que tela ficam alterar dados, trocar senha, inativar e reativar? O minimundo descreve as ações, não a tela.
