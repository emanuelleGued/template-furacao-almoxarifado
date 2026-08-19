# PRD-04 — Alteração de material

**Funcionalidades:** Catálogo de materiais / Alterar material. **Invariantes aplicáveis:** Nome único e código imutável, Unidade travada, Saldo derivado, Perecível com validade ([PRD-00](./PRD-00-indice.md#invariantes-do-domínio)).

## Objetivo

Corrigir os dados de um material já cadastrado sem afetar seu histórico nem seu saldo.

## Usuário e contexto

Usuário que percebeu um dado errado ou desatualizado: o material mudou de prateleira, a categoria estava incorreta, o estoque mínimo precisa subir. Regras da alteração: ver minimundo, *As operações sobre o cadastro*.

## Comportamento esperado

**Editar os dados**

- O formulário abre preenchido com os dados atuais e repete todas as validações do cadastro ([PRD-03](./PRD-03-cadastro-material.md)).
- O código é exibido apenas para leitura e nunca muda.
- Editáveis: nome, descrição, categoria, local de guarda, observações e estoque mínimo.
- A categoria pode ser corrigida a qualquer momento. Ao passar para perecível, as datas de fabricação e validade tornam-se obrigatórias; ao sair de perecível, elas deixam de ser exibidas.
- Não existe campo de saldo: qualquer mudança de quantidade é feita por uma nova movimentação.

**Unidade de medida**

- Enquanto o material não tem movimentação, a unidade pode ser alterada.
- Depois da primeira entrada ou saída, o campo aparece desabilitado, com a explicação "A unidade não pode mudar porque já existem movimentações registradas nesta unidade."

**Salvar**

- Ação: **Salvar alterações**, com a confirmação "Alterações salvas." e retorno à ficha.
- Nenhuma alteração é gravada parcialmente se uma validação falhar.
- Nome já usado por outro material: "Já existe outro material com este nome. Escolha um nome diferente."
- Carregando: a ação fica indisponível durante a gravação, preservando o que foi digitado.
- Material não encontrado: "Este material não existe mais." com a ação **Voltar para a consulta**.

## Navegação e integrações

- Entrada: ação **Editar** na ficha do material ([PRD-05](./PRD-05-ficha-material.md)).
- Saída: ficha do material. A ação **Cancelar** volta à ficha sem gravar.
- Depende do histórico de movimentações apenas para saber se a unidade está travada ([PRD-06](./PRD-06-movimentacao.md)).
- A alteração de categoria muda como o material aparece nos filtros da consulta ([PRD-02](./PRD-02-consulta-materiais.md)), mas não afeta suas movimentações.

## Critérios de aceite

- **Dado que** um material já tem movimentações, **quando** abro a alteração, **então** a unidade de medida está desabilitada com a explicação do bloqueio, e os outros campos continuam editáveis.
- **Dado que** um material ainda não tem movimentações, **quando** troco a unidade e salvo, **então** a alteração é aceita.
- **Dado que** troco a categoria para perecível, **quando** salvo sem informar a validade, **então** o sistema recusa e nada é gravado.
- **Dado que** informo um nome já usado por outro material, **quando** salvo, **então** o sistema recusa e pede um nome diferente.
- **Dado que** alterei o local de guarda, **quando** salvo, **então** o saldo e o histórico permanecem exatamente como estavam.

## Observações e decisões

- O código só aparece nesta tela como referência para a etiqueta da prateleira.
