# Casca da aplicação

Estrutura comum a todas as telas com sessão ativa: navegação, marca, saída e o retorno de uma ação concluída. O comportamento de cada tela está nas demais capacidades desta change.

## ADDED Requirements

### Requirement: Navegação entre as áreas da POC

Toda tela com sessão ativa SHALL oferecer a mesma navegação, dando acesso às duas áreas que a POC expõe: a consulta de materiais e o cadastro de usuário. A navegação SHALL indicar a área em que o usuário está.

Não existe entrada de navegação para lista de usuários, relatórios ou configurações — nenhuma delas faz parte da POC (tabela de cortes, `PRD-00-indice.md`).

#### Scenario: Alcançar o cadastro de usuário a partir de qualquer tela autenticada
- **WHEN** o usuário está em qualquer tela com sessão ativa e aciona a entrada de navegação do cadastro de usuário
- **THEN** o sistema apresenta a tela de cadastro de usuário

#### Scenario: Voltar à consulta pela navegação
- **WHEN** o usuário está na ficha de um material e aciona a entrada de navegação de materiais
- **THEN** o sistema apresenta a consulta de materiais

#### Scenario: Área corrente indicada
- **WHEN** o usuário está na consulta de materiais
- **THEN** a navegação indica a área de materiais como a área corrente

### Requirement: Retorno de ação concluída

Ao concluir uma operação que grava dados, o sistema SHALL exibir uma confirmação curta na tela de destino, com o texto definido pelo PRD da operação. A confirmação SHALL desaparecer sem exigir ação do usuário e SHALL não bloquear a tela.

#### Scenario: Confirmação após gravar
- **WHEN** o usuário conclui o cadastro de um material
- **THEN** a ficha do material é apresentada com a confirmação "Material salvo."

#### Scenario: Confirmação não bloqueia a tela
- **WHEN** uma confirmação está visível
- **THEN** o usuário consegue acionar qualquer ação da tela sem antes dispensá-la

### Requirement: Identidade visual IDE.IA

Todas as telas SHALL usar a identidade visual do laboratório IDE.IA: a paleta de marca, a tipografia da marca e a marca gráfica. A aplicação SHALL apresentar uma única superfície clara; não há alternância de tema.

A aparência SHALL ser servida inteiramente pela própria aplicação, sem requisição a domínio externo — nem fonte, nem folha de estilo, nem imagem.

#### Scenario: Nenhuma requisição externa para renderizar
- **WHEN** qualquer tela da aplicação é carregada
- **THEN** nenhum recurso de aparência é obtido de um domínio de terceiro

#### Scenario: Texto legível sobre a cor de marca
- **WHEN** um texto é apresentado sobre a cor verde da marca
- **THEN** o texto usa uma cor escura, e não a própria cor de marca, preservando o contraste
