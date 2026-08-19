Minimundo — Controle de Almoxarifado

Contexto
O Laboratório IDE.IA guarda num depósito o material que se gasta durante o trabalho, como papel, toners, cabos, pilhas, álcool isopropílico e pequenas peças de reposição. Hoje tudo isso é controlado por uma planilha, que já não dá conta: o saldo não corresponde ao que está na prateleira, ninguém sabe quem levou os últimos cabos e o toner é comprado em duplicidade.

Por isso, o laboratório precisa de um sistema próprio para cadastrar, consultar, alterar e excluir materiais, além de registrar tudo o que entra e sai do depósito. Cada cadastro representa um item do catálogo, como papel A4, toner preto ou álcool isopropílico, e não cada unidade física separadamente. O saldo também não é informado manualmente: o sistema o calcula a partir das entradas e saídas registradas, evitando as diferenças provocadas pelas alterações feitas diretamente na planilha.
Usuários e acesso
O sistema é operado por administradores, cada um com nome completo, e-mail, senha, indicador de atividade e as datas de criação e de última alteração. O e-mail identifica a pessoa no acesso, por isso não se repete, e a senha nunca é armazenada de forma legível. O login exige e-mail e senha, vale apenas para quem está em atividade, e a sessão termina com o logout.

Nenhum usuário é excluído. Quem deixa o laboratório é inativado, podendo ser reativado depois, e assim a autoria das movimentações antigas continua preservada. Não há níveis de permissão, pois todos os usuários possuem o nível de administrador ativo acessa todas as funcionalidades.
O que é um material
Um material é um item de consumo mantido no catálogo do almoxarifado. Papel, álcool e cabo de rede, por exemplo, são cadastrados da mesma forma, ainda que pertençam a categorias diferentes. Cada material recebe um código único, gerado pelo sistema, que não pode ser alterado e pode ser usado na etiqueta da prateleira. O nome também deve ser único: se já existir um cadastro chamado "Papel A4 branco", a chegada de novas resmas deve ser registrada como entrada desse material, e não como um novo cadastro.

O cadastro reúne o código, o nome, a descrição, a categoria, a unidade de medida e o local onde o material é guardado. Também pode conter observações e um estoque mínimo, que é opcional, nunca pode ser negativo e serve para avisar quando uma nova compra precisa ser solicitada. A unidade de medida é obrigatória e deve ser escolhida entre unidade, caixa, pacote, resma, metro e litro.

Como exemplo, o material "Papel A4 branco" pode pertencer à categoria de uso comum, ser controlado em resmas, ficar na prateleira B2 e ter estoque mínimo de cinco resmas. Se dez resmas forem compradas, o cadastro continua sendo o mesmo e uma entrada de quantidade dez é acrescentada ao seu histórico. Depois da primeira movimentação, a unidade de medida não pode mais ser alterada, pois quantidades registradas em unidades diferentes não poderiam ser somadas corretamente.
A categoria do material
Todo material deve estar associado a uma categoria, escolhida entre perecível, componente de TI, uso comum, limpeza e ferramenta. A categoria faz parte do cadastro do material e permite organizar a consulta e os relatórios, mas não altera a maneira como as entradas e saídas são registradas. Por isso, ela pode ser corrigida a qualquer momento.

Os materiais perecíveis registram também a data de fabricação e a data de validade. Na consulta, considera-se vencido o item cuja validade seja anterior à data atual; os demais aparecem como não vencidos. O sistema também destaca o que já venceu e o que está próximo do vencimento. Já a categoria componente de TI reúne peças de consumo controladas por quantidade, como cabos e conectores.
As movimentações e o saldo
Cada entrada ou saída é registrada como uma movimentação individual vinculada a um material. O registro guarda o tipo da movimentação, a quantidade, o motivo, o usuário responsável e a data e a hora atribuídas pelo sistema. A quantidade deve ser sempre maior que zero e informada na unidade de medida definida no cadastro do material.

Uma entrada aumenta o saldo disponível e pode ter como origem uma compra, uma doação ou uma devolução. Ao registrá-la, o usuário escolhe o motivo adequado e informa apenas uma quantidade positiva; é o tipo da movimentação que determina o acréscimo ao saldo.

Uma saída reduz o saldo e pode representar o atendimento a um pedido, o consumo interno, um descarte ou uma perda. Além dos dados comuns às movimentações, a saída guarda o nome de quem retirou o material. Antes de concluir o registro, o sistema verifica a quantidade disponível e recusa, com uma explicação, qualquer saída que deixaria o saldo negativo.

O saldo atual é calculado pela soma das entradas menos a soma das saídas. Movimentações já gravadas não podem ser editadas nem apagadas. Quando houver um erro, a correção é feita por meio de um estorno: uma movimentação inversa, de mesma quantidade, vinculada ao registro original e acompanhada de uma justificativa. Tanto a movimentação original quanto o estorno permanecem visíveis no histórico.
As operações sobre o cadastro
A tela de consulta apresenta os materiais em uma lista paginada. Cada linha mostra, pelo menos, o código, o nome, a categoria, a unidade de medida, o local de guarda e o saldo atual. A ordenação inicial é pelo nome, em ordem alfabética crescente. O usuário pode alterar a ordenação somente pelo nome ou pelo saldo atual, tanto em ordem crescente quanto decrescente. Quando dois materiais tiverem o mesmo saldo, o nome em ordem alfabética é usado como desempate, mantendo a ordem estável entre as páginas.

A busca é feita pelo nome do material e aceita um nome completo ou apenas parte dele, sem diferenciar letras maiúsculas de minúsculas. Os resultados também podem ser filtrados por categoria, e os dois critérios podem ser usados ao mesmo tempo. Quando a categoria perecível for selecionada, a tela disponibiliza ainda um filtro de validade com as opções vencido e não vencido. Os filtros e a ordenação escolhidos são mantidos enquanto o usuário navega entre as páginas.

Ao abrir um resultado, o usuário acessa a ficha completa do material, com seus dados cadastrais, o saldo atual e o histórico de movimentações, exibido das mais recentes para as mais antigas. No caso de um perecível, a ficha também mostra as datas de fabricação e de validade e informa claramente se o material está vencido.

Um novo cadastro só é aceito quando todos os dados obrigatórios estiverem preenchidos, inclusive a categoria e, para os perecíveis, as datas de fabricação e de validade. O sistema também verifica se o nome já está sendo usado e não grava nenhuma parte do cadastro caso uma dessas validações falhe.

Na alteração, o sistema repete as validações do cadastro. O código gerado nunca muda, o nome continua sujeito à regra de unicidade e a unidade de medida fica bloqueada depois da primeira movimentação. Os demais dados, inclusive a categoria, podem ser corrigidos. O saldo não aparece como um campo editável, pois qualquer mudança de quantidade deve ser feita por uma nova movimentação.

A exclusão só é permitida para materiais que ainda não possuam movimentações. Antes de excluir, o sistema apresenta uma confirmação com o nome do material. Depois da primeira entrada ou saída, o cadastro não pode mais ser apagado, pois suas informações são necessárias para preservar o histórico do estoque.

