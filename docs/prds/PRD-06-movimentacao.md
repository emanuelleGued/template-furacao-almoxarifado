# PRD-06 — Registrar movimentação

**Funcionalidades:** Movimentações e saldo / Registrar entrada, Registrar saída. **Invariantes aplicáveis:** Saldo derivado, Saída nunca negativa, Movimentação imutável, Data e hora do servidor, Unidade travada ([PRD-00](./PRD-00-indice.md#invariantes-do-domínio)).

## Objetivo

Registrar o que entrou ou saiu do depósito, para que o saldo acompanhe a prateleira.

## Usuário e contexto

Usuário no momento em que recebe uma compra ou atende um pedido no balcão do almoxarifado. É a tela mais usada do sistema. Regras: ver minimundo, *As movimentações e o saldo*.

## Comportamento esperado

**Escolher o tipo**

- O material já vem definido pela ficha de origem, com nome, unidade de medida e saldo atual visíveis no topo.
- Tipo: entrada ou saída, escolhido primeiro, porque define os motivos e os campos seguintes.
- É o tipo que determina se o saldo aumenta ou diminui; a quantidade é sempre positiva.

**Registrar entrada**

- Motivo, obrigatório: compra, doação ou devolução.
- Quantidade, obrigatória, maior que zero, informada na unidade de medida do material.
- Ação: **Registrar entrada**, com a confirmação "Entrada registrada." e retorno à ficha.

**Registrar saída**

- Motivo, obrigatório: pedido, consumo interno, descarte ou perda.
- Quantidade, obrigatória, maior que zero, na unidade de medida do material.
- Nome de quem retirou, obrigatório.
- Antes de gravar, o sistema confere o saldo disponível.
- Ação: **Registrar saída**, com a confirmação "Saída registrada." e retorno à ficha.

**Validações e estados**

- Quantidade zero ou negativa: "Informe uma quantidade maior que zero."
- Saldo insuficiente: "Saída recusada: o saldo disponível é de 3 resmas." Nada é gravado.
- Campo obrigatório vazio: a mensagem aparece junto ao campo, antes de enviar.
- Carregando: a ação de registrar fica indisponível durante a gravação, preservando o que foi digitado.
- Material não encontrado: "Este material não existe." com a ação **Voltar para a consulta**.
- O usuário responsável e a data e hora não são campos: vêm da sessão e do servidor.

## Navegação e integrações

- Entrada: ação **Registrar movimentação** na ficha do material ([PRD-05](./PRD-05-ficha-material.md)), inclusive no histórico vazio.
- Saída: ficha do material, com o saldo e o histórico já atualizados. A ação **Cancelar** volta à ficha sem gravar.
- Depende do usuário autenticado ([PRD-01](./PRD-01-login.md)) para registrar a autoria, e do saldo calculado a partir das movimentações anteriores para validar a saída.
- A movimentação gravada trava a unidade de medida do material na alteração ([PRD-04](./PRD-04-alteracao-material.md)) e passa a impedir sua exclusão ([PRD-05](./PRD-05-ficha-material.md)).
- Correções não acontecem aqui: são feitas por estorno, na ficha.

## Critérios de aceite

- **Dado que** um material tem saldo 5 resmas, **quando** registro uma entrada de 10 por compra, **então** o saldo passa a 15 e a movimentação aparece no histórico com meu nome e a data e hora do sistema.
- **Dado que** um material tem saldo 3 resmas, **quando** tento registrar saída de 4, **então** o sistema recusa informando que o saldo disponível é de 3 resmas e nada é gravado.
- **Dado que** escolhi o tipo saída, **quando** confirmo sem informar quem retirou, **então** o sistema recusa e pede o nome.
- **Dado que** informo quantidade zero, **quando** confirmo, **então** o sistema pede uma quantidade maior que zero.
- **Dado que** registrei a movimentação, **quando** volto à ficha, **então** ela aparece no topo do histórico e não oferece nenhuma ação de editar ou apagar.

## Observações e decisões

- Entrada e saída dividem a mesma tela porque compartilham material, quantidade e motivo; o tipo é escolhido antes dos demais campos justamente para que os motivos apresentados sejam sempre os corretos.
- Dúvida em aberto — **Movimentações / perecível vencido:** o sistema permite registrar saída de material vencido, ou apenas descarte?
