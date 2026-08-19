# PRD-02 — Consulta de materiais

**Funcionalidades:** Consulta / Listar, Buscar por nome, Filtrar por categoria e validade, Ordenar por nome e saldo. **Invariantes aplicáveis:** Saldo derivado, Perecível com validade ([PRD-00](./PRD-00-indice.md#invariantes-do-domínio)).

## Objetivo

Encontrar um material do catálogo e ver seu saldo atual.

## Usuário e contexto

Usuário que precisa saber se um item existe, onde está guardado e quanto resta antes de atender um pedido ou solicitar compra. Regras da consulta: ver minimundo, *As operações sobre o cadastro*.

## Comportamento esperado

**Listar**

- Colunas: código, nome, categoria, unidade de medida, local de guarda e saldo atual.
- Lista paginada. Ao abrir, a ordenação é por nome, de A a Z.
- Cada linha leva à ficha do material.
- Material com saldo igual ou abaixo do estoque mínimo recebe o aviso "Abaixo do mínimo" na linha. Sem estoque mínimo definido, não há aviso.
- Carregando: a lista mostra o esqueleto das linhas e mantém filtros e ordenação visíveis.
- Vazio, sem filtros: "Nenhum material cadastrado ainda." com a ação **Cadastrar material**.
- Vazio, com filtros: "Nenhum material corresponde à busca." com a ação **Limpar filtros**.

**Buscar por nome**

- Um campo de busca por nome, aceitando o nome completo ou parte dele, sem diferenciar maiúsculas de minúsculas.
- A busca e os filtros podem ser usados juntos.

**Filtrar**

- Filtro por categoria: perecível, componente de TI, uso comum, limpeza ou ferramenta.
- Ao escolher perecível, aparece também o filtro de validade, com as opções vencido e não vencido. Ele desaparece se a categoria mudar.
- Filtros e ordenação são mantidos ao navegar entre as páginas.

**Ordenar**

- Somente por nome ou por saldo atual, em ordem crescente ou decrescente.
- Saldos iguais são desempatados pelo nome em ordem alfabética, para que a ordem não mude entre páginas.

## Navegação e integrações

- Entrada: primeira tela depois de entrar ([PRD-01](./PRD-01-login.md)).
- Saída: ficha do material ([PRD-05](./PRD-05-ficha-material.md)) e cadastro de material ([PRD-03](./PRD-03-cadastro-material.md)).
- O saldo de cada linha vem das movimentações do material, não de um campo do cadastro.
- A situação de vencido depende das datas do perecível, definidas no cadastro ([PRD-03](./PRD-03-cadastro-material.md)).

## Critérios de aceite

- **CA-01** — **Dado que** existem materiais cadastrados, **quando** abro a consulta, **então** vejo a lista ordenada por nome de A a Z, com o saldo atual de cada material.
- **CA-02** — **Dado que** busco por "papel", **quando** confirmo, **então** vejo "Papel A4 branco" no resultado, independentemente de maiúsculas e minúsculas.
- **CA-03** — **Dado que** filtrei pela categoria perecível e escolhi a validade vencido, **quando** vou para a página seguinte, **então** o filtro e a ordenação continuam aplicados.
- **CA-04** — **Dado que** dois materiais têm o mesmo saldo, **quando** ordeno por saldo, **então** eles aparecem em ordem alfabética entre si e não trocam de posição ao paginar.
- **CA-05** — **Dado que** nenhum material corresponde ao filtro, **quando** a lista carrega, **então** vejo a mensagem de nenhum resultado e a ação de limpar filtros.

## Observações e decisões

- O aviso "Abaixo do mínimo" é a forma que o estoque mínimo assume nesta POC; não há notificação nem relatório.
- Dúvida em aberto — **Consulta / paginação:** quantos materiais por página?
