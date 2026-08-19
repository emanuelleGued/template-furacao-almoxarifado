# PRD-05 — Ficha do material

**Funcionalidades:** Catálogo / Ver ficha e Excluir material; Movimentações e saldo / Consultar histórico e saldo atual, Estornar movimentação. **Invariantes aplicáveis:** Saldo derivado, Movimentação imutável, Exclusão só sem movimentação, Perecível com validade, Data e hora do servidor ([PRD-00](./PRD-00-indice.md#invariantes-do-domínio)).

## Objetivo

Ver tudo sobre um material — dados, saldo e o que entrou e saiu — e agir a partir daí: movimentar, corrigir por estorno, editar ou excluir.

## Usuário e contexto

Usuário que precisa saber quanto há de um item e quem levou as últimas unidades. É a tela que responde à pergunta que a planilha não respondia. Regras: ver minimundo, *As movimentações e o saldo* e *As operações sobre o cadastro*.

## Comportamento esperado

**Ver os dados e o saldo**

- Dados cadastrais: código, nome, descrição, categoria, unidade de medida, local de guarda, observações e estoque mínimo.
- Saldo atual, exibido na unidade de medida do material e sempre calculado a partir das movimentações. Não é editável em nenhum lugar da tela.
- Saldo igual ou abaixo do estoque mínimo recebe o aviso "Abaixo do mínimo".
- Material perecível mostra também data de fabricação, data de validade e a situação: "Vencido em 12/03/2026" ou "Válido até 12/03/2027".

**Ver o histórico**

- Movimentações da mais recente para a mais antiga, com tipo, quantidade, motivo, usuário responsável, data e hora.
- Saída mostra também o nome de quem retirou.
- Estorno aparece identificado e ligado à movimentação de origem; a movimentação estornada continua visível.
- Carregando: dados e saldo aparecem primeiro; o histórico mostra o esqueleto das linhas.
- Histórico vazio: "Nenhuma movimentação registrada." com a ação **Registrar movimentação**.
- Material não encontrado: "Este material não existe." com a ação **Voltar para a consulta**.

**Estornar uma movimentação**

- Cada movimentação do histórico oferece a ação **Estornar**, que abre uma confirmação com tipo, quantidade, data da movimentação original e um campo de justificativa obrigatório.
- Confirmar cria uma movimentação inversa de mesma quantidade, vinculada à original, com data e hora do sistema. Nada é editado nem apagado.
- Justificativa vazia: "Descreva o motivo do estorno."
- Se o estorno deixaria o saldo negativo, o sistema recusa antes de gravar: "Estorno recusado: ele deixaria o saldo negativo. O saldo disponível é de N \<unidade\>."
- Confirmação: "Estorno registrado." e o histórico atualiza com as duas movimentações visíveis.

**Excluir o material**

- A ação **Excluir material** só aparece habilitada enquanto o material não tem movimentações.
- Com movimentações, a ação aparece desabilitada com a explicação "Este material não pode ser excluído porque já possui movimentações."
- Habilitada, abre uma confirmação exibindo o nome do material: "Excluir 'Papel A4 branco'? Esta ação não pode ser desfeita." com as ações **Excluir material** e **Cancelar**.
- Concluída, o usuário vai para a consulta com a mensagem "Material excluído."

## Navegação e integrações

- Entrada: uma linha da consulta ([PRD-02](./PRD-02-consulta-materiais.md)), ou o retorno após criar ([PRD-03](./PRD-03-cadastro-material.md)), alterar ([PRD-04](./PRD-04-alteracao-material.md)) ou movimentar ([PRD-06](./PRD-06-movimentacao.md)).
- Saída: alteração, registro de movimentação, ou consulta após excluir.
- Depende das movimentações do material para o saldo, para o histórico, para habilitar a exclusão e para informar à alteração se a unidade está travada.

## Critérios de aceite

- **CA-01** — **Dado que** um material teve entrada de 10 e saída de 3 resmas, **quando** abro a ficha, **então** o saldo exibido é 7 resmas e não existe campo para editá-lo.
- **CA-02** — **Dado que** registrei uma saída errada, **quando** a estorno com justificativa, **então** o saldo volta ao valor anterior e histórico mostra a saída original e o estorno vinculado a ela.
- **CA-03** — **Dado que** tento estornar sem escrever a justificativa, **quando** confirmo, **então** o sistema recusa e pede o motivo.
- **CA-04** — **Dado que** o material já tem movimentações, **quando** abro a ficha, **então** a exclusão aparece desabilitada com a explicação do bloqueio.
- **CA-05** — **Dado que** o material não tem movimentações, **quando** escolho excluir, **então** vejo a confirmação com o nome do material e, ao confirmar, volto à consulta sem ele.

## Observações e decisões

- Decisão desta POC: o botão de excluir fica somente aqui, onde os dados e a existência de histórico estão visíveis.
- Dúvida em aberto — **Movimentações / estorno:** um estorno pode ser estornado?
