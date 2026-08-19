# Movimentações

Registrar o que entrou ou saiu do depósito, para que o saldo acompanhe a prateleira. Cobre o PRD-06. Invariantes aplicáveis: **Saldo derivado**, **Saída nunca negativa**, **Movimentação imutável**, **Data e hora do servidor**, **Unidade travada** (`PRD-00-indice.md`).

## ADDED Requirements

### Requirement: Contexto do material e escolha do tipo

O material SHALL vir definido pela ficha de origem, com nome, unidade de medida e saldo atual visíveis no topo da tela.

O tipo — entrada ou saída — SHALL ser escolhido antes dos demais campos, porque determina os motivos apresentados e os campos seguintes. O tipo SHALL determinar se o saldo aumenta ou diminui; a quantidade SHALL ser sempre positiva.

#### Scenario: Contexto visível
- **WHEN** o usuário abre o registro de movimentação a partir da ficha
- **THEN** o nome do material, sua unidade de medida e seu saldo atual aparecem no topo

#### Scenario: Campos dependem do tipo
- **WHEN** o usuário ainda não escolheu o tipo
- **THEN** os campos que dependem do tipo não estão disponíveis para preenchimento

#### Scenario: Motivos trocam com o tipo
- **WHEN** o usuário escolhe entrada e depois troca para saída
- **THEN** os motivos apresentados passam a ser os de saída

#### Scenario: Material inexistente
- **WHEN** o usuário abre o registro para um material que não existe
- **THEN** o sistema exibe "Este material não existe." com a ação **Voltar para a consulta**

### Requirement: Registrar entrada

A entrada SHALL exigir motivo entre compra, doação e devolução, e quantidade maior que zero informada na unidade de medida do material.

Concluída, o sistema SHALL apresentar a ficha com a confirmação "Entrada registrada.", com saldo e histórico já atualizados.

#### Scenario: Entrada aceita
- **WHEN** um material tem saldo 5 resmas e o usuário registra entrada de 10 por compra
- **THEN** o saldo passa a 15 resmas
- **AND** a movimentação aparece no histórico com o usuário responsável e a data e hora do sistema

#### Scenario: Motivo de entrada obrigatório
- **WHEN** o usuário escolhe entrada e aciona a gravação sem informar o motivo
- **THEN** a mensagem aparece junto ao campo, antes de a submissão ser enviada
- **AND** nada é gravado

### Requirement: Registrar saída

A saída SHALL exigir motivo entre pedido, consumo interno, descarte e perda, quantidade maior que zero na unidade de medida do material, e o nome de quem retirou.

Antes de gravar, o sistema SHALL conferir o saldo disponível e SHALL recusar qualquer saída que deixaria o saldo negativo (**Saída nunca negativa**).

Concluída, o sistema SHALL apresentar a ficha com a confirmação "Saída registrada."

Se o sistema permite saída de material vencido, ou apenas descarte, é **dúvida em aberto — Movimentações / perecível vencido** (`PRD-00-indice.md`).

#### Scenario: Saída aceita
- **WHEN** um material tem saldo 10 resmas e o usuário registra saída de 3 por pedido, informando quem retirou
- **THEN** o saldo passa a 7 resmas
- **AND** a ficha é apresentada com a confirmação "Saída registrada."

#### Scenario: Saldo insuficiente
- **WHEN** um material tem saldo 3 resmas e o usuário tenta registrar saída de 4
- **THEN** o sistema recusa com "Saída recusada: o saldo disponível é de 3 resmas."
- **AND** nada é gravado

#### Scenario: Saída exatamente igual ao saldo
- **WHEN** um material tem saldo 3 resmas e o usuário registra saída de 3
- **THEN** a saída é aceita e o saldo passa a zero

#### Scenario: Quem retirou é obrigatório
- **WHEN** o usuário escolhe saída e confirma sem informar quem retirou
- **THEN** o sistema recusa e pede o nome
- **AND** nada é gravado

### Requirement: Quantidade da movimentação

A quantidade SHALL ser obrigatória e maior que zero, expressa na unidade de medida do material.

A escala decimal admitida para a quantidade é **pergunta bloqueante** desta change: `docs/Constituicao/arquitetura.md` remete a uma decisão do `PRD-00-indice.md` que não existe naquele documento. A implementação SHALL não presumir uma escala.

#### Scenario: Quantidade zero
- **WHEN** o usuário informa quantidade zero e confirma
- **THEN** o sistema recusa com "Informe uma quantidade maior que zero."
- **AND** nada é gravado

#### Scenario: Quantidade negativa
- **WHEN** o usuário informa quantidade negativa e confirma
- **THEN** o sistema recusa com "Informe uma quantidade maior que zero."
- **AND** nada é gravado

### Requirement: Autoria e momento atribuídos pelo sistema

O usuário responsável e a data e hora SHALL não ser campos do formulário: vêm da sessão ativa e do servidor (**Data e hora do servidor**).

#### Scenario: Sem campos de autoria e data
- **WHEN** o usuário abre o registro de movimentação
- **THEN** não existe campo para informar o responsável, a data ou a hora

#### Scenario: Momento atribuído na gravação
- **WHEN** a movimentação é gravada
- **THEN** a data e a hora registradas são as do servidor no instante da gravação

### Requirement: Movimentação gravada é definitiva

Movimentação gravada SHALL não ser editada nem apagada; a correção acontece por estorno na ficha do material (**Movimentação imutável**).

A primeira movimentação de um material SHALL travar sua unidade de medida (**Unidade travada**) e SHALL passar a impedir sua exclusão (**Exclusão só sem movimentação**).

#### Scenario: Sem edição após gravar
- **WHEN** o usuário registra a movimentação e volta à ficha
- **THEN** ela aparece no topo do histórico
- **AND** não oferece nenhuma ação de editar ou apagar

#### Scenario: Primeira movimentação trava a unidade
- **WHEN** um material sem movimentações recebe a primeira entrada
- **THEN** sua unidade de medida deixa de ser alterável na tela de alteração
- **AND** sua exclusão deixa de ser oferecida na ficha

#### Scenario: Cancelar o registro
- **WHEN** o usuário aciona **Cancelar**
- **THEN** o sistema volta à ficha do material e nada é gravado

#### Scenario: Ação indisponível durante a gravação
- **WHEN** a gravação está em curso
- **THEN** a ação de registrar fica indisponível
- **AND** o que foi digitado é preservado
