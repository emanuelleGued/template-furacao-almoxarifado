# Design técnico

Decisões desta change, seus racionais e o que foi descartado. As camadas, as regras de importação e as convenções vêm de `docs/Constituicao/` e não são repetidas aqui.

## Contexto

O repositório não tem código. A referência visual `Almoxarifado IDE.IA.dc.html` desenha as sete telas sobre o design system do laboratório IDE.IA. Ela é um Design Component do Claude Design: um HTML único com todas as telas em ramos condicionais, interpretado por um runtime de preview.

## Decisões

### D1 — A referência visual é a fonte de verdade da aparência; o design system, apenas da paleta

**Decisão.** Os tokens de cor do design system entram integralmente. A escala tipográfica e a de espaçamento não entram: a aparência das telas segue a referência visual.

**Racional.** O design system declara cobrir *slide decks only* — foi derivado de dois arquivos PowerPoint de 1920×1080. Seus tokens refletem isso: corpo em 22px, título em `clamp(36px, 4vw, 56px)`, escala de espaço de 8 a 128px, margem de slide de 120px. A referência visual usa 11, 13, 14 e 15px em 170 das 185 declarações de tamanho de texto, e espaçamentos de base 4px. São escalas de mídias diferentes; importar a de slide produziria uma tabela de almoxarifado ilegível.

As cores, ao contrário, transferem exatamente. Os nove valores usados na referência mapeiam um a um nos tokens: `#1A1A1A` → `--gray-900`, `#5C5C5C` → `--gray-600`, `#E3E3E3` → `--gray-200`, `#22212C` → `--navy-900`, `#58BF62` → `--green-600`, `#3F8A47` → `--green-700`, `#EEF9EF` → `--green-100`, além de branco. Um único valor não tem token, `#F5F5F5`, usado uma vez.

**Alternativa rejeitada.** Importar `_ds/…/styles.css` inteiro e herdar as quatro famílias de tokens. Rejeitada porque traz a escala de slide junto e criaria um conflito permanente entre o que o token diz e o que a tela precisa.

**Consequência registrada.** A escala tipográfica e a de espaçamento da aplicação nascem nesta change. O valor órfão `#F5F5F5` é normalizado para `--gray-200` ou para branco, conforme o uso.

### D2 — A identidade extende o design system para uma superfície de produto

**Decisão.** A aplicação mantém cantos retos e ausência de sombra, e passa a usar bordas de traço fino.

**Racional.** O design system enuncia três regras de forma: cantos retos, sem sombra, sem borda. A referência visual obedece às duas primeiras — 48 declarações de `border-radius: 0` e nenhuma sombra — e quebra a terceira: `#E3E3E3` aparece 55 vezes, como traço de tabela, de cartão e de campo. Uma tabela densa precisa de separação que espaço em branco não dá.

**Alternativa rejeitada.** Obedecer à regra e separar tudo por espaço. Rejeitada porque a referência visual já demonstrou o contrário numa tela real, e porque a regra foi escrita para slides.

**Consequência registrada.** Sem este registro, a ausência de bordas voltaria como "correção" citando o design system.

### D3 — Fontes servidas pela própria aplicação

**Decisão.** As sete variações de Urbanist entram no repositório como `woff2` e são carregadas pelo mecanismo de fontes locais do Next.js. Olney não entra.

**Racional.** `tech-stack.md` proíbe serviços externos, o que exclui Google Fonts. Carregar fonte local pelo mecanismo do próprio framework evita o salto de layout que um `@font-face` manual produz. Olney fica de fora porque a referência visual declara uma única família, `Urbanist`, e não usa Olney em nenhum ponto — trazer uma face comercial que ninguém usa é peso e risco de licença sem contrapartida.

**Alternativa rejeitada.** Copiar a pasta `_ds/` inteira para dentro do projeto. Rejeitada porque traz tokens de slide, ícones de dois conjuntos, padrões decorativos e ilustrações que nenhuma tela usa.

### D4 — Um formulário de material, duas rotas

**Decisão.** Criação e alteração de material compartilham um único componente de formulário, parametrizado pelo título, pelo rótulo da ação e pela exibição do código.

**Racional.** O PRD-04 determina que a alteração "repete todas as validações do cadastro". A referência visual chegou à mesma conclusão de forma independente: desenha uma tela só. Duplicar o formulário garantiria divergência entre as duas cópias na primeira regra nova.

**Alternativa rejeitada.** Dois formulários independentes, um por rota. Rejeitada pelo custo de manter as validações sincronizadas.

**Consequência registrada.** As diferenças reais entre as operações — código somente na alteração, trava da unidade, texto da recusa por nome duplicado — são entradas do componente, não bifurcações internas.

### D5 — Busca, filtros, ordenação e paginação vivem na URL

**Decisão.** O estado da consulta é lido dos parâmetros de busca da rota e resolvido no servidor.

**Racional.** `arquitetura.md` fixa Server Component como padrão e `tech-stack.md` proíbe bibliotecas de estado e de busca de dados no cliente. O requisito de preservar filtros ao paginar é atendido naturalmente pela URL, que ainda dá endereço compartilhável e navegação de histórico de graça.

**Alternativa rejeitada.** Manter o estado da consulta no cliente. Rejeitada por contrariar o padrão da arquitetura e por perder a preservação de filtros na navegação.

### D6 — Duas ilhas de cliente em todo o sistema

**Decisão.** `"use client"` aparece somente no formulário de material e no formulário de movimentação.

**Racional.** A referência visual expõe todos os seus ramos condicionais, e eles se separam em quatro naturezas: roteamento, dados vindos do servidor, resultado de submissão e reatividade dentro do formulário. Só a última exige cliente — a categoria perecível que revela as datas, e o tipo da movimentação que troca a lista de motivos e revela quem retirou. As demais são resolvidas no servidor ou pelo estado da submissão.

**Alternativa rejeitada.** Marcar as páginas de formulário inteiras como cliente. Rejeitada porque arrastaria a busca de dados para o cliente sem necessidade.

### D7 — Saldo derivado e a garantia de que a saída não fica negativa

**Decisão.** O saldo é sempre agregado a partir das movimentações. A validação de saída e a gravação acontecem na mesma transação, com bloqueio das linhas de movimentação do material.

**Racional.** **Saldo derivado** proíbe campo de saldo. **Saída nunca negativa** exige que a conferência e a gravação sejam atômicas: sem bloqueio, dois usuários registrando saída ao mesmo tempo podem, cada um vendo saldo suficiente, produzir saldo negativo. `tech-stack.md` já prevê esse caso ao permitir SQL manual dentro de repositórios exatamente para o bloqueio de linha.

**Alternativa rejeitada.** Manter um campo de saldo materializado e atualizá-lo a cada movimentação. Rejeitada por contrariar o invariante **Saldo derivado**.

**Consequência registrada.** O modelo de leitura `MaterialComSaldo`, declarado na camada de aplicação, é montado pelo repositório por agregação. A entidade `Material` nunca recebe campo de saldo.

### D8 — O runtime da referência visual não é portado

**Decisão.** `support.js` e `_ds_bundle.js` ficam de fora. Os ramos condicionais e as repetições da referência viram construções normais de React.

**Racional.** `support.js` é o `dc-runtime`, o motor que interpreta o Design Component dentro da ferramenta de design. É andaime de preview, não de produto. As propriedades editáveis que ele expõe — número de itens por página e obrigatoriedade da justificativa — são valores de preview, não decisões: a obrigatoriedade da justificativa já é requisito do PRD-05, e o número de itens por página segue em aberto.

### D9 — Ferramental em Node 20

**Decisão.** Os comandos do OpenSpec rodam em Node 20 ou superior.

**Racional.** O CLI usa sintaxe de importação com atributo de tipo, que o Node 16 não interpreta e que faz o comando falhar antes de executar. Node 20.19.2 já está instalado na máquina.

### D10 — Escala decimal única de três casas

**Decisão.** Toda quantidade tem escala decimal de três casas, qualquer que seja a unidade de medida. `Quantidade` guarda milésimos como inteiro; a coluna do banco é decimal com escala 3; a exibição corta os zeros à direita.

**Racional.** Das seis unidades do minimundo, metro e litro admitem fração; unidade, caixa, pacote e resma, não. Uma escala única cobre as duas naturezas com um só caminho no domínio, e o corte de zeros à direita elimina o único efeito visível indesejado — dez resmas continuam aparecendo como "10", não como "10,000".

`arquitetura.md` já havia se comprometido com essa direção ao exigir a conversão entre `Prisma.Decimal` e `Quantidade`: escala zero teria pedido um tipo inteiro, não decimal.

**Alternativa rejeitada — quantidade inteira.** É a leitura mais literal do minimundo, que nunca exibe fração. Rejeitada porque tornaria impossível registrar meio litro de álcool, e porque exigiria reescrever a passagem de `arquitetura.md` que fixa a conversão decimal.

**Alternativa rejeitada — escala por unidade de medida.** Escala zero para unidade, caixa, pacote e resma; três casas para metro e litro. Mais fiel à realidade física, rejeitada pelo custo: `Quantidade` passaria a carregar a unidade, a aritmética entre escalas diferentes precisaria ser proibida no tipo, e cada mensagem de erro mudaria de texto conforme a unidade. Peso alto para uma POC, e a regra "resma não aceita fração" não está enunciada no minimundo.

**Consequência registrada.** A decisão vive no `PRD-00-indice.md` sob o nome **Escala da quantidade**. `arquitetura.md` a cita pelo nome e não repete a escala, como já fazia com os invariantes.

### D11 — As telas vêm antes do Prisma, sobre um adaptador em memória

**Decisão.** A camada de aplicação declara as portas dos repositórios; a primeira implementação delas guarda os dados em memória. As sete telas são construídas contra essas portas e ficam navegáveis sem banco. O adaptador Prisma entra depois, na fase 11, e nenhuma tela muda.

**Racional.** A arquitetura já separa porta de implementação, e `conventions.md` **exige** implementações em memória das portas para a faixa de teste de caso de uso:

> Caso de uso | Vitest | Fluxo completo da operação, com implementações em memória das portas, sem banco e sem I/O

Ou seja, esse adaptador teria de existir de qualquer forma. Antecipá-lo dá três coisas ao mesmo tempo: o dublê que os testes de caso de uso exigem, um ambiente de desenvolvimento que roda sem PostgreSQL instalado, e a prova prática de que a fronteira da porta está no lugar certo — se a troca para o Prisma exigir mexer em tela, a fronteira estava errada.

**Alternativa rejeitada.** Seguir a ordem original, com Prisma e migration antes das telas. Rejeitada porque adia toda a interface para depois de três fases de infraestrutura, e porque não produz o dublê de teste que a faixa de caso de uso vai exigir de qualquer maneira.

**Alternativa rejeitada.** Construir as telas com dados fixos escritos dentro dos componentes. Rejeitada porque não passa pelas portas: seria descartada inteira na fase 11, e ainda colocaria dado de domínio na camada Web, contra `arquitetura.md`.

**Consequência registrada.** A escolha do adaptador é resolvida por variável de ambiente, num único ponto de composição. A carga de exemplo do modo em memória não é seed de banco e não se confunde com o seed do primeiro usuário descrito em `conventions.md` — ela existe só enquanto o modo em memória existir.

## Riscos

| Risco | Mitigação |
| --- | --- |
| Quantidade tratada como ponto flutuante em algum ponto do caminho, produzindo erro de arredondamento no saldo. | `Quantidade` guarda milésimos como inteiro e concentra toda a aritmética; nenhuma camada acima do repositório manipula quantidade crua (`arquitetura.md`). Teste de domínio somando e subtraindo valores fracionários em sequência. |
| Saída simultânea de dois usuários produzindo saldo negativo. | Conferência e gravação na mesma transação, com bloqueio das linhas de movimentação do material (D7). Teste de domínio cobrindo o limite exato entre saldo e quantidade. |
| Desvio silencioso entre a aparência implementada e a referência visual. | A referência é a base de conferência de cada tela. Os sete valores de espaçamento fora da base 4px são normalizados de forma explícita, não caso a caso. |
| PostgreSQL de desenvolvimento não documentado; a change introduz o primeiro banco do projeto. | Documentar como subir a instância local e o que `.env.example` exige, na mesma fase que cria o schema. |
| Credencial do primeiro usuário vazando para o código ou para a documentação. | A semente lê configuração por ambiente. `.env.example` lista a variável sem valor real, conforme `tech-stack.md`. |
| A escala tipográfica e a de espaçamento nascem nesta change sem estar registradas na constituição. | Registrar a escala adotada junto do tema, e propor sua inclusão em `docs/Constituicao/` quando estabilizar. |

## Dúvidas em aberto

Nomeadas pela funcionalidade afetada. As sete primeiras já constam do `PRD-00-indice.md`; a última é desta change.

- **Consulta / paginação:** quantos materiais por página? A referência visual expõe o valor 5 como propriedade editável de preview, o que não é decisão de produto. Não bloqueia: a lista funciona com qualquer valor, mas ele precisa ser único e registrado.
- **Catálogo / perecível:** a validade precisa ser posterior à data de fabricação? A fabricação pode ser futura? Não bloqueia: enquanto não houver decisão, exige-se apenas a presença das duas datas.
- **Movimentações / perecível vencido:** o sistema permite saída de material vencido, ou apenas descarte? Não bloqueia: sem decisão, a saída segue permitida para qualquer motivo.
- **Movimentações / estorno:** um estorno pode ser estornado? Não bloqueia: sem decisão, a ação **Estornar** é oferecida em toda movimentação, e a recusa por saldo negativo já protege o caso perigoso.
- **Acesso / expiração:** a dúvida do PRD-01 foi respondida por `tech-stack.md`, que fixa expiração absoluta de 8 horas sem renovação por uso. Registrada aqui apenas para fechar o item.
- **Usuários / senha:** existe regra mínima de senha? Não bloqueia: sem decisão, exige-se apenas presença e coincidência com a confirmação.
- **Usuários / demais ações:** alterar dados, trocar senha, inativar e reativar estão fora desta POC; a tela onde aconteceriam segue indefinida. Não bloqueia.
- **Quantidade / escala decimal:** **resolvida.** Registrada no `PRD-00-indice.md` como a decisão **Escala da quantidade**: três casas decimais para toda unidade de medida, exibição cortando zeros à direita. Ver D10.
