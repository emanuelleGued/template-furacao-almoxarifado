# Cadastro de usuários

Dar acesso próprio a quem vai operar o almoxarifado, para que cada movimentação fique registrada no nome de quem a fez. Cobre o PRD-07. Invariante aplicável: **Usuário nunca excluído** (`PRD-00-indice.md`).

## ADDED Requirements

### Requirement: Campos do usuário

O cadastro SHALL exigir nome completo, e-mail, senha e confirmação da senha. O e-mail SHALL identificar a pessoa no acesso.

A senha SHALL não ser exibida em tela em nenhum momento, nem depois de salva, e SHALL não ser armazenada de forma legível (**Usuário nunca excluído**).

O formulário SHALL não ter campo de perfil ou permissão — todo usuário é administrador — nem campo de situação, nem campos de data de criação ou alteração.

A existência de regra mínima de senha é **dúvida em aberto — Usuários / senha** (`PRD-00-indice.md`).

#### Scenario: Sem campo de perfil ou situação
- **WHEN** o usuário abre o cadastro de usuário
- **THEN** não existe campo de perfil, permissão, situação ou data

#### Scenario: Campo obrigatório vazio
- **WHEN** o usuário aciona **Salvar usuário** sem preencher um campo obrigatório
- **THEN** a mensagem aparece junto ao campo, antes de a submissão ser enviada
- **AND** nada é gravado

### Requirement: Confirmação da senha

A senha e sua confirmação SHALL coincidir. A confirmação SHALL não ser um dado armazenado.

Divergência SHALL ser recusada antes do envio, e ambos os campos de senha SHALL ser limpos.

#### Scenario: Senhas divergentes
- **WHEN** a senha e a confirmação não coincidem e o usuário confirma
- **THEN** o sistema recusa com "As senhas não coincidem." antes de enviar
- **AND** os dois campos de senha são limpos
- **AND** nada é gravado

### Requirement: E-mail único

O e-mail SHALL não se repetir entre usuários. A verificação SHALL considerar todos os usuários, inclusive os inativos.

#### Scenario: E-mail já em uso
- **WHEN** o e-mail informado já pertence a outro usuário e o usuário confirma
- **THEN** o sistema recusa com "Este e-mail já está em uso por outro usuário. Escolha outro e-mail."
- **AND** nada é gravado

#### Scenario: E-mail de usuário inativo
- **WHEN** o e-mail informado pertence a um usuário inativado
- **THEN** o sistema recusa da mesma forma que para um usuário em atividade

### Requirement: Criar o usuário

O usuário SHALL ser criado em atividade e SHALL conseguir entrar imediatamente com o e-mail e a senha informados. Concluída a criação, o sistema SHALL apresentar a consulta de materiais com a confirmação "Usuário salvo."

Nenhuma parte do cadastro SHALL ser gravada se qualquer validação falhar.

#### Scenario: Criação aceita
- **WHEN** o usuário informa nome completo, e-mail e senha coincidente com a confirmação e aciona **Salvar usuário**
- **THEN** o usuário é criado em atividade
- **AND** a consulta de materiais é apresentada com a confirmação "Usuário salvo."

#### Scenario: Usuário criado consegue entrar
- **WHEN** o usuário recém-criado informa esse e-mail e essa senha na tela de entrada
- **THEN** o acesso é aceito

#### Scenario: Usuário criado aparece como responsável
- **WHEN** o usuário recém-criado registra uma movimentação
- **THEN** ele aparece como responsável no histórico do material

#### Scenario: Cancelar o cadastro
- **WHEN** o usuário aciona **Cancelar**
- **THEN** o sistema volta à consulta de materiais e nada é gravado

#### Scenario: Ação indisponível durante a gravação
- **WHEN** a gravação está em curso
- **THEN** a ação **Salvar usuário** fica indisponível
- **AND** o que foi digitado é preservado, com exceção dos campos de senha

### Requirement: Primeiro usuário semeado

A instalação SHALL criar o primeiro usuário, porque esta tela exige sessão ativa (decisão *Primeiro usuário semeado*, `PRD-00-indice.md`). A credencial semeada SHALL vir de configuração por ambiente, nunca de valor fixado no código ou em documentação.

#### Scenario: Acesso inicial possível
- **WHEN** a aplicação é instalada e nenhum usuário foi cadastrado pela tela
- **THEN** existe um usuário em atividade capaz de entrar no sistema

#### Scenario: Credencial não fixada no código
- **WHEN** o primeiro usuário é semeado
- **THEN** sua credencial provém de configuração por ambiente
