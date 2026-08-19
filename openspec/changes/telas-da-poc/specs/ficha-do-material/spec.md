# Ficha do material

Ver tudo sobre um material — dados, saldo e histórico — e agir a partir daí. Cobre o PRD-05. Invariantes aplicáveis: **Saldo derivado**, **Movimentação imutável**, **Exclusão só sem movimentação**, **Perecível com validade**, **Data e hora do servidor** (`PRD-00-indice.md`).

## ADDED Requirements

### Requirement: Dados cadastrais e saldo

A ficha SHALL apresentar código, nome, descrição, categoria, unidade de medida, local de guarda, observações e estoque mínimo, além do saldo atual.

O saldo SHALL ser exibido na unidade de medida do material, SHALL ser sempre calculado a partir das movimentações e SHALL não ser editável em nenhum lugar da tela (**Saldo derivado**).

Saldo igual ou inferior ao estoque mínimo SHALL receber o aviso "Abaixo do mínimo".

#### Scenario: Saldo calculado
- **WHEN** um material teve entrada de 10 e saída de 3 resmas e o usuário abre a ficha
- **THEN** o saldo exibido é 7 resmas
- **AND** não existe campo para editá-lo

#### Scenario: Aviso de estoque mínimo
- **WHEN** o saldo atual é igual ou inferior ao estoque mínimo definido
- **THEN** a ficha exibe o aviso "Abaixo do mínimo"

#### Scenario: Material inexistente
- **WHEN** o usuário abre a ficha de um material que não existe
- **THEN** o sistema exibe "Este material não existe." com a ação **Voltar para a consulta**

### Requirement: Situação do material perecível

Material perecível SHALL exibir data de fabricação, data de validade e a situação decorrente da comparação entre a validade e a data atual (**Perecível com validade**).

#### Scenario: Perecível vencido
- **WHEN** a data de validade é anterior à data atual
- **THEN** a ficha exibe a situação no formato "Vencido em 12/03/2026"

#### Scenario: Perecível dentro da validade
- **WHEN** a data de validade é igual ou posterior à data atual
- **THEN** a ficha exibe a situação no formato "Válido até 12/03/2027"

#### Scenario: Material não perecível
- **WHEN** o material não é da categoria perecível
- **THEN** a ficha não exibe datas nem situação de validade

### Requirement: Histórico de movimentações

O histórico SHALL apresentar as movimentações da mais recente para a mais antiga, com tipo, quantidade, motivo, usuário responsável, data e hora. Saída SHALL exibir também o nome de quem retirou.

Estorno SHALL aparecer identificado como tal e ligado à movimentação de origem, e a movimentação estornada SHALL continuar visível (**Movimentação imutável**).

O histórico SHALL não oferecer nenhuma ação de editar ou apagar uma movimentação.

#### Scenario: Ordem do histórico
- **WHEN** o usuário abre a ficha de um material com movimentações
- **THEN** as movimentações aparecem da mais recente para a mais antiga

#### Scenario: Saída mostra quem retirou
- **WHEN** o histórico contém uma saída
- **THEN** aquela linha exibe o nome de quem retirou, além do usuário responsável pelo registro

#### Scenario: Estorno vinculado
- **WHEN** uma movimentação foi estornada
- **THEN** o estorno aparece identificado e ligado à movimentação de origem
- **AND** a movimentação estornada continua visível no histórico

#### Scenario: Sem ação de editar ou apagar
- **WHEN** o usuário examina qualquer linha do histórico
- **THEN** nenhuma ação de editar ou apagar aquela movimentação é oferecida

#### Scenario: Carregando
- **WHEN** a ficha está sendo carregada
- **THEN** os dados cadastrais e o saldo aparecem primeiro
- **AND** o histórico exibe o esqueleto das linhas

#### Scenario: Histórico vazio
- **WHEN** o material não tem nenhuma movimentação
- **THEN** o sistema exibe "Nenhuma movimentação registrada." com a ação **Registrar movimentação**

### Requirement: Estornar uma movimentação

Cada movimentação do histórico SHALL oferecer a ação **Estornar**, que SHALL abrir uma confirmação exibindo tipo, quantidade e data da movimentação original, com um campo de justificativa obrigatório.

Confirmar SHALL criar uma movimentação inversa de mesma quantidade, vinculada à original, com data e hora atribuídas pelo sistema (**Data e hora do servidor**). Nada SHALL ser editado nem apagado (**Movimentação imutável**).

O sistema SHALL recusar, antes de gravar, o estorno que deixaria o saldo negativo (**Saída nunca negativa**).

Se um estorno pode ser estornado é **dúvida em aberto — Movimentações / estorno** (`PRD-00-indice.md`).

#### Scenario: Estorno aceito
- **WHEN** o usuário estorna uma saída informando a justificativa
- **THEN** o saldo volta ao valor anterior àquela saída
- **AND** o histórico exibe a saída original e o estorno vinculado a ela
- **AND** o sistema confirma com "Estorno registrado."

#### Scenario: Justificativa vazia
- **WHEN** o usuário confirma o estorno sem escrever a justificativa
- **THEN** o sistema recusa com "Descreva o motivo do estorno."
- **AND** nada é gravado

#### Scenario: Estorno que deixaria o saldo negativo
- **WHEN** o estorno de uma entrada deixaria o saldo negativo
- **THEN** o sistema recusa antes de gravar com "Estorno recusado: ele deixaria o saldo negativo. O saldo disponível é de N <unidade>."
- **AND** nada é gravado

#### Scenario: Cancelar o estorno
- **WHEN** o usuário cancela a confirmação de estorno
- **THEN** nada é gravado e o histórico permanece inalterado

### Requirement: Excluir o material

A ação **Excluir material** SHALL aparecer somente nesta tela. Ela SHALL estar habilitada apenas enquanto o material não tiver nenhuma movimentação (**Exclusão só sem movimentação**).

Com movimentações, a ação SHALL aparecer desabilitada com a explicação "Este material não pode ser excluído porque já possui movimentações."

Habilitada, SHALL abrir uma confirmação exibindo o nome do material, com as ações **Excluir material** e **Cancelar**. Concluída a exclusão, o sistema SHALL apresentar a consulta com a mensagem "Material excluído."

#### Scenario: Exclusão bloqueada por movimentação
- **WHEN** o material já tem movimentações e o usuário abre a ficha
- **THEN** a ação de excluir aparece desabilitada com a explicação do bloqueio

#### Scenario: Exclusão confirmada
- **WHEN** o material não tem movimentações e o usuário aciona **Excluir material**
- **THEN** o sistema exibe a confirmação "Excluir 'Papel A4 branco'? Esta ação não pode ser desfeita."
- **AND** ao confirmar, apresenta a consulta sem aquele material e a mensagem "Material excluído."

#### Scenario: Cancelar a exclusão
- **WHEN** o usuário cancela a confirmação de exclusão
- **THEN** o material permanece no catálogo e a ficha continua apresentada
