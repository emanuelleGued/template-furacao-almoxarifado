# PRD-01 — Login

**Funcionalidades:** Acesso / Entrar, Acesso / Sair. **Invariantes aplicáveis:** Usuário nunca excluído ([PRD-00](./PRD-00-indice.md#invariantes-do-domínio)).

## Objetivo

Entrar no sistema com e-mail e senha e encerrar a sessão ao termina com o logout.

## Comportamento esperado

**Entrar**

- Campos: e-mail e senha, ambos obrigatórios. A senha não é exibida em tela.
- Ação: **Entrar**.
- O e-mail identifica a pessoa. Só quem está em atividade consegue entrar.
- Carregando: a ação fica indisponível enquanto o acesso é verificado, sem limpar o e-mail digitado.
- Erro de credencial: "Não foi possível entrar. Confira o e-mail e a senha." Sem indicar qual dos dois falhou.
- Erro de usuário inativo: "Este acesso está inativo. Fale com o responsável pelo almoxarifado."
- Campo vazio: a mensagem aparece junto ao campo, antes de enviar.

**Sair**

- Ação **Sair**, disponível em todas as telas autenticadas.
- Encerra a sessão e devolve o usuário a esta tela.

## Navegação e integrações

- Entrada: qualquer acesso sem sessão ativa cai aqui.
- Saída: após entrar, vai para a consulta de materiais (`/materiais`, [PRD-02](./PRD-02-consulta-materiais.md)).
- Depende dos usuários cadastrados ([PRD-07](./PRD-07-cadastro-usuario.md)); o primeiro deles é semeado na instalação (ver [PRD-00](./PRD-00-indice.md)).
- Fornece o usuário responsável registrado em cada movimentação ([PRD-06](./PRD-06-movimentacao.md), [PRD-05](./PRD-05-ficha-material.md)).

## Critérios de aceite

- **CA-01** — **Dado que** sou um usuário em atividade, **quando** entro com e-mail e senha corretos, **então** chego à consulta de materiais.
- **CA-02** — **Dado que** meu acesso foi inativado, **quando** entro com a senha correta, **então** o sistema recusa e informa que o acesso está inativo.
- **CA-03** — **Dado que** errei a senha, **quando** confirmo, **então** vejo uma única mensagem pedindo para conferir e-mail e senha, e o e-mail digitado permanece no campo.
- **CA-04** — **Dado que** estou com a sessão aberta, **quando** escolho Sair, **então** volto ao login e não consigo acessar `/materiais` sem entrar de novo.

## Observações e decisões

- A mensagem de credencial não distingue e-mail de senha, para não revelar quais e-mails existem.
- Dúvida em aberto — **Acesso:** a sessão expira por inatividade, ou só termina no logout?
