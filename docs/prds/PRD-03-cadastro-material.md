# PRD-03 — Cadastro de material

**Funcionalidades:** Catálogo de materiais / Criar material. **Invariantes aplicáveis:** Nome único e código imutável, Perecível com validade, Saldo derivado ([PRD-00](./PRD-00-indice.md#invariantes-do-domínio)).

## Objetivo

Incluir no catálogo um item de consumo que ainda não existe, para que ele possa receber entradas e saídas.

## Usuário e contexto

Usuário que recebeu no depósito um item novo, ainda sem cadastro. O cadastro representa o item do catálogo, não a unidade física: ver minimundo, *O que é um material*.

## Comportamento esperado

**Preencher o cadastro**

- Campos obrigatórios: nome, descrição, categoria, unidade de medida e local de guarda.
- Campos opcionais: observações e estoque mínimo. O estoque mínimo não aceita valor negativo.
- Categoria: perecível, componente de TI, uso comum, limpeza ou ferramenta.
- Unidade de medida: unidade, caixa, pacote, resma, metro ou litro.
- Ao escolher a categoria perecível, os campos data de fabricação e data de validade aparecem e passam a ser obrigatórios. Trocar de categoria os remove.
- Não há campo de código nem de saldo: o código é gerado ao salvar e o saldo começa em zero, formado só por movimentações.
- Um aviso permanente junto à unidade de medida: "Depois da primeira entrada ou saída, a unidade não poderá mais ser alterada."

**Salvar**

- Ação: **Salvar material**. Ao concluir, a confirmação é "Material salvo." e o usuário vai para a ficha do material.
- Nenhuma parte do cadastro é gravada se qualquer validação falhar.
- Campo obrigatório vazio: a mensagem aparece junto ao campo, antes de enviar.
- Nome já em uso: "Já existe um material com este nome. Para registrar novas unidades, abra o material e adicione uma entrada." com um atalho para a ficha do material existente.
- Estoque mínimo negativo: "Informe o estoque mínimo como zero ou mais."
- Carregando: a ação **Salvar material** fica indisponível durante a gravação, preservando o que foi digitado.

## Navegação e integrações

- Entrada: ação **Cadastrar material** na consulta ([PRD-02](./PRD-02-consulta-materiais.md)), inclusive na tela vazia.
- Saída: ficha do material recém-criado ([PRD-05](./PRD-05-ficha-material.md)). A ação **Cancelar** volta à consulta sem gravar.
- A verificação de nome único consulta o catálogo inteiro, não apenas a página exibida.
- O material criado fica com saldo zero até a primeira entrada ([PRD-06](./PRD-06-movimentacao.md)).

## Critérios de aceite

- **CA-01** — **Dado que** preenchi nome, descrição, categoria, unidade e local, **quando** salvo, **então** o material é criado com código gerado pelo sistema e saldo zero, e vejo sua ficha.
- **CA-02** — **Dado que** escolhi a categoria perecível, **quando** salvo sem a data de validade, **então** o sistema recusa e nada é gravado.
- **CA-03** — **Dado que** já existe "Papel A4 branco", **quando** tento salvar outro material com esse nome, **então** o sistema recusa e me oferece abrir o material existente para registrar uma entrada.
- **CA-04** — **Dado que** informei estoque mínimo negativo, **quando** salvo, **então** o sistema pede um valor de zero ou mais e não grava.

## Observações e decisões

- Leitura adotada do minimundo: descrição e local de guarda são obrigatórios, porque só observações e estoque mínimo são descritos como opcionais.
- Dúvida em aberto — **Catálogo / perecível:** a validade precisa ser posterior à data de fabricação? E a fabricação pode ser futura?
