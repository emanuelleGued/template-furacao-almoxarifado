# PRD-07 — Cadastro de usuário

**Funcionalidades:** Usuários / Cadastrar usuário. **Invariantes aplicáveis:** Usuário nunca excluído ([PRD-00](./PRD-00-indice.md#invariantes-do-domínio)).

## Objetivo

Dar acesso próprio a quem vai operar o almoxarifado, para que cada movimentação fique registrada no nome de quem a fez.

## Usuário e contexto

Usuário já autenticado, quando alguém novo passa a trabalhar no laboratório. Todo usuário tem nível de administrador e acessa todas as funcionalidades: não há perfis nem níveis de permissão. Regras: ver minimundo, *Usuários e acesso*.

## Comportamento esperado

**Preencher o cadastro**

- Campos obrigatórios: nome completo, e-mail, senha e confirmação da senha.
- O e-mail identifica a pessoa no acesso e não se repete.
- A senha não é exibida em tela em nenhum momento, nem depois de salva.
- Não há campo de perfil ou permissão: todo usuário é administrador.
- Não há campo de situação: o usuário é criado em atividade.
- As datas de criação e de última alteração são atribuídas pelo sistema e não aparecem no formulário.

**Salvar**

- Ação: **Salvar usuário**, com a confirmação "Usuário salvo." e retorno à consulta de materiais.
- Nenhuma parte do cadastro é gravada se qualquer validação falhar.
- Campo obrigatório vazio: a mensagem aparece junto ao campo, antes de enviar.
- Senha e confirmação diferentes: "As senhas não coincidem."
- E-mail já em uso: "Este e-mail já está em uso por outro usuário. Escolha outro e-mail."
- Carregando: a ação **Salvar usuário** fica indisponível durante a gravação, preservando o que foi digitado, com exceção dos campos de senha.

## Navegação e integrações

- Entrada: pelo menu principal, a partir de qualquer tela com sessão ativa ([PRD-01](./PRD-01-login.md)). Não existe tela de lista de usuários nesta POC.
- Saída: consulta de materiais ([PRD-02](./PRD-02-consulta-materiais.md)). A ação **Cancelar** volta sem gravar.
- Fornece as credenciais que o login valida ([PRD-01](./PRD-01-login.md)) e o usuário responsável registrado nas movimentações ([PRD-06](./PRD-06-movimentacao.md), [PRD-05](./PRD-05-ficha-material.md)).
- A verificação de e-mail único considera todos os usuários, inclusive os inativos.

## Critérios de aceite

- **CA-01** — **Dado que** informei nome completo, e-mail e senha, **quando** salvo, **então** o usuário é criado em atividade e consegue entrar com esse e-mail e senha.
- **CA-02** — **Dado que** o e-mail já pertence a outro usuário, **quando** salvo, **então** o sistema recusa, pede outro e-mail e nada é gravado.
- **CA-03** — **Dado que** a senha e a confirmação não coincidem, **quando** confirmo, **então** o sistema recusa antes de enviar e as senhas são limpas.
- **CA-04** — **Dado que** o usuário foi criado, **quando** ele registra uma movimentação, **então** aparece como responsável no histórico do material.

## Observações e decisões

- Não existe exclusão de usuário: quem sai do laboratório é inativado, o que preserva a autoria das movimentações antigas. A tela onde a inativação acontece está fora desta POC.
- Decisões de interface, não vindas do minimundo: a confirmação da senha, que não é dado armazenado, e a criação do usuário já em atividade.

## Dúvidas em aberto

- **Usuários / senha:** existe regra mínima de senha (tamanho, composição)?
- **Usuários / primeiro acesso:** esta tela exige sessão ativa. O primeiro usuário continua sendo semeado na instalação, ou o sistema precisa de um cadastro inicial sem sessão?
- **Usuários / demais ações:** onde ficam alterar dados, trocar senha, inativar e reativar? O minimundo descreve as ações, mas não a tela em que acontecem.
