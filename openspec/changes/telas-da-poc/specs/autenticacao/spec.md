# Autenticação

Entrada no sistema, proteção das telas com sessão e saída. Cobre o PRD-01. Invariante aplicável: **Usuário nunca excluído** (`PRD-00-indice.md`).

## ADDED Requirements

### Requirement: Entrar no sistema

O sistema SHALL permitir a entrada com e-mail e senha, ambos obrigatórios. A senha SHALL não ser exibida em tela. Somente usuário em atividade SHALL conseguir entrar. Concluída a entrada, o sistema SHALL apresentar a consulta de materiais.

A mensagem de credencial inválida SHALL não distinguir e-mail de senha, para não revelar quais e-mails existem.

#### Scenario: Entrada aceita
- **WHEN** um usuário em atividade informa e-mail e senha corretos e aciona Entrar
- **THEN** o sistema estabelece a sessão e apresenta a consulta de materiais

#### Scenario: Senha incorreta
- **WHEN** o usuário informa um e-mail existente com a senha errada e aciona Entrar
- **THEN** o sistema recusa com "Não foi possível entrar. Confira o e-mail e a senha."
- **AND** o e-mail digitado permanece no campo

#### Scenario: E-mail inexistente
- **WHEN** o usuário informa um e-mail que não pertence a nenhum usuário
- **THEN** o sistema recusa com a mesma mensagem apresentada para senha incorreta, sem indicar qual dos dois falhou

#### Scenario: Usuário inativo
- **WHEN** um usuário cujo acesso foi inativado informa a senha correta e aciona Entrar
- **THEN** o sistema recusa com "Este acesso está inativo. Fale com o responsável pelo almoxarifado."
- **AND** nenhuma sessão é estabelecida

#### Scenario: Campo obrigatório vazio
- **WHEN** o usuário aciona Entrar sem preencher o e-mail ou a senha
- **THEN** a mensagem aparece junto ao campo vazio, antes de a submissão ser enviada

#### Scenario: Ação indisponível durante a verificação
- **WHEN** a entrada está sendo verificada
- **THEN** a ação Entrar fica indisponível
- **AND** o e-mail digitado não é limpo

### Requirement: Guarda das telas com sessão

Toda tela que não seja a de entrada SHALL exigir sessão ativa. Acesso sem sessão SHALL levar à tela de entrada, e não a um erro.

A sessão SHALL ter expiração absoluta: passado o prazo definido em `docs/Constituicao/tech-stack.md`, ela termina independentemente de atividade. Não há renovação por uso.

#### Scenario: Acesso sem sessão
- **WHEN** alguém sem sessão ativa tenta acessar a consulta de materiais
- **THEN** o sistema apresenta a tela de entrada

#### Scenario: Sessão expirada
- **WHEN** o prazo absoluto da sessão se esgota e o usuário aciona qualquer tela com sessão
- **THEN** o sistema apresenta a tela de entrada e exige nova autenticação

### Requirement: Sair do sistema

A ação **Sair** SHALL estar disponível em todas as telas com sessão ativa. Acioná-la SHALL encerrar a sessão e apresentar a tela de entrada.

#### Scenario: Encerrar a sessão
- **WHEN** o usuário aciona Sair
- **THEN** a sessão é encerrada e a tela de entrada é apresentada

#### Scenario: Sessão encerrada não dá mais acesso
- **WHEN** o usuário aciona Sair e em seguida tenta acessar a consulta de materiais
- **THEN** o sistema apresenta a tela de entrada e exige nova autenticação

### Requirement: Autoria das movimentações

O usuário da sessão ativa SHALL ser o responsável registrado em toda movimentação gravada. A autoria SHALL não ser informada pelo usuário em nenhum formulário.

#### Scenario: Responsável vem da sessão
- **WHEN** o usuário registra uma movimentação
- **THEN** o responsável gravado é o usuário da sessão ativa, sem que nenhum campo do formulário o informe
