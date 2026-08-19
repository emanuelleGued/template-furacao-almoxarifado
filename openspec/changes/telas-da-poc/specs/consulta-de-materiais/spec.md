# Consulta de materiais

Encontrar um material do catálogo e ver seu saldo atual. Cobre o PRD-02. Invariantes aplicáveis: **Saldo derivado**, **Perecível com validade** (`PRD-00-indice.md`).

## ADDED Requirements

### Requirement: Listar o catálogo

O sistema SHALL apresentar os materiais em lista paginada com as colunas código, nome, categoria, unidade de medida, local de guarda e saldo atual. A ordenação inicial SHALL ser por nome, de A a Z. Cada linha SHALL levar à ficha do material.

O saldo exibido SHALL ser sempre calculado a partir das movimentações, nunca lido de um campo do cadastro (**Saldo derivado**).

#### Scenario: Lista inicial
- **WHEN** o usuário abre a consulta e existem materiais cadastrados
- **THEN** a lista aparece ordenada por nome de A a Z, com o saldo atual de cada material

#### Scenario: Abrir a ficha a partir da lista
- **WHEN** o usuário aciona uma linha da lista
- **THEN** o sistema apresenta a ficha daquele material

#### Scenario: Carregando
- **WHEN** a lista está sendo carregada
- **THEN** o esqueleto das linhas é exibido
- **AND** os filtros e a ordenação permanecem visíveis

### Requirement: Aviso de estoque mínimo

Material cujo saldo atual seja igual ou inferior ao estoque mínimo SHALL receber o aviso "Abaixo do mínimo" na sua linha. Material sem estoque mínimo definido SHALL não receber aviso algum.

#### Scenario: Saldo abaixo do mínimo
- **WHEN** um material tem estoque mínimo 10 e saldo atual 4
- **THEN** sua linha exibe o aviso "Abaixo do mínimo"

#### Scenario: Saldo igual ao mínimo
- **WHEN** um material tem estoque mínimo 10 e saldo atual 10
- **THEN** sua linha exibe o aviso "Abaixo do mínimo"

#### Scenario: Sem estoque mínimo definido
- **WHEN** um material não tem estoque mínimo definido e seu saldo é zero
- **THEN** sua linha não exibe aviso

### Requirement: Buscar por nome

O sistema SHALL oferecer um campo de busca por nome que aceite o nome completo ou parte dele, sem diferenciar maiúsculas de minúsculas. A busca SHALL poder ser combinada com os filtros.

#### Scenario: Busca por parte do nome
- **WHEN** o usuário busca por "papel" e existe o material "Papel A4 branco"
- **THEN** esse material aparece no resultado

#### Scenario: Busca sem diferenciar caixa
- **WHEN** o usuário busca por "PAPEL" e existe o material "Papel A4 branco"
- **THEN** esse material aparece no resultado

#### Scenario: Busca combinada com filtro
- **WHEN** o usuário busca por "papel" e filtra pela categoria uso comum
- **THEN** o resultado contém apenas materiais que atendem às duas condições

### Requirement: Filtrar por categoria e validade

O sistema SHALL oferecer filtro por categoria entre perecível, componente de TI, uso comum, limpeza e ferramenta. Ao escolher perecível, o sistema SHALL apresentar também o filtro de validade, com as opções vencido e não vencido. O filtro de validade SHALL desaparecer quando a categoria deixar de ser perecível.

A situação de vencido SHALL decorrer da data de validade do material comparada à data atual (**Perecível com validade**).

#### Scenario: Filtro de validade aparece com perecível
- **WHEN** o usuário escolhe a categoria perecível
- **THEN** o filtro de validade passa a ser apresentado

#### Scenario: Filtro de validade some ao trocar de categoria
- **WHEN** o filtro de validade está visível e o usuário troca a categoria para limpeza
- **THEN** o filtro de validade deixa de ser apresentado e deixa de ser aplicado

#### Scenario: Filtrar vencidos
- **WHEN** o usuário filtra pela categoria perecível com validade vencido
- **THEN** o resultado contém apenas materiais perecíveis cuja data de validade é anterior à data atual

### Requirement: Ordenar a lista

O sistema SHALL permitir ordenar somente por nome ou por saldo atual, em ordem crescente ou decrescente. Saldos iguais SHALL ser desempatados pelo nome em ordem alfabética, de modo que a ordem não mude entre páginas.

#### Scenario: Desempate estável por nome
- **WHEN** dois materiais têm o mesmo saldo e o usuário ordena por saldo
- **THEN** eles aparecem em ordem alfabética entre si
- **AND** não trocam de posição ao navegar entre as páginas

### Requirement: Paginar preservando busca, filtros e ordenação

A lista SHALL ser paginada. A busca, os filtros e a ordenação SHALL ser preservados ao navegar entre as páginas.

O número de materiais por página é **dúvida em aberto — Consulta / paginação** (`PRD-00-indice.md`) e SHALL ter um valor único definido antes da implementação.

#### Scenario: Filtro preservado ao paginar
- **WHEN** o usuário filtra pela categoria perecível com validade vencido e vai para a página seguinte
- **THEN** o filtro e a ordenação continuam aplicados

### Requirement: Lista sem resultados

O sistema SHALL distinguir os dois motivos de uma lista vazia e oferecer a ação correspondente a cada um.

#### Scenario: Catálogo vazio
- **WHEN** não existe nenhum material cadastrado e não há busca nem filtro aplicado
- **THEN** o sistema exibe "Nenhum material cadastrado ainda." com a ação **Cadastrar material**

#### Scenario: Nenhum resultado para os filtros
- **WHEN** existem materiais cadastrados mas nenhum corresponde à busca ou aos filtros
- **THEN** o sistema exibe "Nenhum material corresponde à busca." com a ação **Limpar filtros**

#### Scenario: Limpar filtros restaura a lista
- **WHEN** o usuário aciona **Limpar filtros**
- **THEN** a busca e os filtros são descartados e a lista completa é apresentada
