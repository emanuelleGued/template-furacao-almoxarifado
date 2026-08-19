# Cadastro de materiais

Criar um material no catálogo e corrigir os dados de um material existente. Cobre o PRD-03 e o PRD-04. Invariantes aplicáveis: **Nome único e código imutável**, **Perecível com validade**, **Unidade travada**, **Saldo derivado** (`PRD-00-indice.md`).

As duas operações compartilham os mesmos campos e as mesmas validações; o que as separa está registrado nos requisitos de cada uma.

## ADDED Requirements

### Requirement: Campos do material

O material SHALL ter como obrigatórios nome, descrição, categoria, unidade de medida e local de guarda, e como opcionais observações e estoque mínimo. O estoque mínimo SHALL não aceitar valor negativo.

A categoria SHALL ser uma entre perecível, componente de TI, uso comum, limpeza e ferramenta. A unidade de medida SHALL ser uma entre unidade, caixa, pacote, resma, metro e litro.

Nenhum formulário SHALL apresentar campo de saldo: o saldo decorre exclusivamente das movimentações (**Saldo derivado**).

#### Scenario: Campo obrigatório vazio
- **WHEN** o usuário aciona a gravação sem preencher um campo obrigatório
- **THEN** a mensagem aparece junto ao campo, antes de a submissão ser enviada
- **AND** nada é gravado

#### Scenario: Estoque mínimo negativo
- **WHEN** o usuário informa um estoque mínimo negativo e aciona a gravação
- **THEN** o sistema recusa com "Informe o estoque mínimo como zero ou mais."
- **AND** nada é gravado

#### Scenario: Nenhum campo de saldo
- **WHEN** o usuário abre o formulário de criação ou o de alteração
- **THEN** não existe campo para informar ou editar o saldo

### Requirement: Datas do material perecível

Ao escolher a categoria perecível, o sistema SHALL apresentar os campos data de fabricação e data de validade e torná-los obrigatórios. Ao trocar para qualquer outra categoria, SHALL deixar de apresentá-los e de exigi-los (**Perecível com validade**).

A relação exigida entre as duas datas é **dúvida em aberto — Catálogo / perecível** (`PRD-00-indice.md`): não está definido se a validade precisa ser posterior à fabricação, nem se a fabricação pode ser futura. Enquanto não houver decisão, o sistema SHALL exigir apenas a presença das duas datas.

#### Scenario: Datas aparecem ao escolher perecível
- **WHEN** o usuário escolhe a categoria perecível
- **THEN** os campos data de fabricação e data de validade passam a ser apresentados e exigidos

#### Scenario: Datas somem ao sair de perecível
- **WHEN** a categoria era perecível e o usuário a troca para ferramenta
- **THEN** os campos de data deixam de ser apresentados e deixam de ser exigidos

#### Scenario: Perecível sem validade
- **WHEN** o usuário escolhe perecível e aciona a gravação sem informar a data de validade
- **THEN** o sistema recusa e nada é gravado

### Requirement: Criar material

Ao criar, o sistema SHALL gerar o código e SHALL não apresentar campo de código. O material criado SHALL começar com saldo zero. Concluída a criação, o sistema SHALL apresentar a ficha do material com a confirmação "Material salvo."

Nenhuma parte do cadastro SHALL ser gravada se qualquer validação falhar.

Um aviso permanente SHALL acompanhar a unidade de medida: "Depois da primeira entrada ou saída, a unidade não poderá mais ser alterada."

#### Scenario: Criação aceita
- **WHEN** o usuário preenche nome, descrição, categoria, unidade e local e aciona **Salvar material**
- **THEN** o material é criado com código gerado pelo sistema e saldo zero
- **AND** a ficha do material é apresentada com a confirmação "Material salvo."

#### Scenario: Sem campo de código na criação
- **WHEN** o usuário abre o formulário de criação
- **THEN** não existe campo de código

#### Scenario: Cancelar a criação
- **WHEN** o usuário aciona **Cancelar**
- **THEN** o sistema volta à consulta de materiais e nada é gravado

#### Scenario: Ação indisponível durante a gravação
- **WHEN** a gravação está em curso
- **THEN** a ação de salvar fica indisponível
- **AND** o que foi digitado é preservado

### Requirement: Nome único do material

O nome do material SHALL não se repetir no catálogo, e a verificação SHALL considerar o catálogo inteiro, não apenas a página exibida (**Nome único e código imutável**).

Ao criar, a recusa SHALL oferecer um atalho para abrir o material existente, porque novas unidades de um item já cadastrado são entrada, não novo cadastro. Ao alterar, a recusa SHALL apenas pedir outro nome.

#### Scenario: Nome duplicado ao criar
- **WHEN** já existe "Papel A4 branco" e o usuário tenta criar outro material com esse nome
- **THEN** o sistema recusa com "Já existe um material com este nome. Para registrar novas unidades, abra o material e adicione uma entrada."
- **AND** oferece um atalho para a ficha do material existente
- **AND** nada é gravado

#### Scenario: Atalho leva ao material existente
- **WHEN** o usuário aciona o atalho oferecido na recusa por nome duplicado
- **THEN** o sistema apresenta a ficha do material que já ocupa aquele nome

#### Scenario: Nome duplicado ao alterar
- **WHEN** o usuário informa um nome já usado por outro material e aciona **Salvar alterações**
- **THEN** o sistema recusa com "Já existe outro material com este nome. Escolha um nome diferente."
- **AND** nada é gravado

#### Scenario: Manter o próprio nome ao alterar
- **WHEN** o usuário altera o local de guarda sem mudar o nome e aciona **Salvar alterações**
- **THEN** o sistema aceita, sem acusar duplicidade com o próprio material

### Requirement: Alterar material

O formulário de alteração SHALL abrir preenchido com os dados atuais e SHALL repetir todas as validações da criação. Nome, descrição, categoria, local de guarda, observações e estoque mínimo SHALL ser editáveis.

O código SHALL ser exibido apenas para leitura e SHALL nunca mudar (**Nome único e código imutável**).

Concluída a alteração, o sistema SHALL apresentar a ficha com a confirmação "Alterações salvas." Nenhuma alteração SHALL ser gravada parcialmente se uma validação falhar.

#### Scenario: Formulário preenchido
- **WHEN** o usuário abre a alteração de um material
- **THEN** os campos aparecem preenchidos com os dados atuais
- **AND** o código é exibido apenas para leitura

#### Scenario: Alteração não afeta saldo nem histórico
- **WHEN** o usuário altera o local de guarda e aciona **Salvar alterações**
- **THEN** o saldo e o histórico do material permanecem exatamente como estavam

#### Scenario: Cancelar a alteração
- **WHEN** o usuário aciona **Cancelar**
- **THEN** o sistema volta à ficha do material e nada é gravado

#### Scenario: Material inexistente
- **WHEN** o usuário abre a alteração de um material que não existe mais
- **THEN** o sistema exibe "Este material não existe mais." com a ação **Voltar para a consulta**

### Requirement: Trava da unidade de medida

Enquanto o material não tiver nenhuma movimentação, a unidade de medida SHALL ser alterável. Depois da primeira movimentação, o campo SHALL aparecer desabilitado com a explicação "A unidade não pode mudar porque já existem movimentações registradas nesta unidade.", e os demais campos SHALL continuar editáveis (**Unidade travada**).

#### Scenario: Unidade alterável sem movimentação
- **WHEN** o material ainda não tem movimentações e o usuário troca a unidade e salva
- **THEN** a alteração é aceita

#### Scenario: Unidade travada com movimentação
- **WHEN** o material já tem movimentações e o usuário abre a alteração
- **THEN** a unidade de medida aparece desabilitada com a explicação do bloqueio
- **AND** os demais campos continuam editáveis
