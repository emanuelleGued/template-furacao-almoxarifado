# Arquitetura

Este documento define as camadas do sistema, quem pode importar quem, onde vivem as regras de negócio e as invariantes que a estrutura precisa proteger. As tecnologias estão em [`tech-stack.md`](./tech-stack.md); as convenções de escrita estão em [`conventions.md`](./conventions.md).

## Camadas e responsabilidades

O sistema tem quatro camadas. A ordem abaixo é a ordem da dependência: a de cima não conhece a de baixo.

### 1. Web (`src/app`, `src/components`)

Porta de entrada e apresentação.

- Rotas, layouts, páginas e Server Components do App Router.
- Server Actions: recebem a submissão, aplicam o guard de acesso, validam a entrada com o schema Zod, chamam um caso de uso, traduzem o resultado para a tela e revalidam o cache da rota.
- O guard de acesso compartilhado, único ponto que obtém a sessão e resolve o usuário autenticado.
- Componentes de UI, incluindo os componentes de shadcn/ui.

Não contém regra de negócio, não calcula saldo, não decide se uma saída é permitida, não acessa Prisma.

### 2. Aplicação (`src/application`)

Casos de uso. Um caso de uso é uma operação completa do sistema, com nome do domínio: `cadastrarMaterial`, `registrarSaida`, `estornarMovimentacao`, `inativarUsuario`, `obterUsuarioAutenticado`.

- Orquestra entidades de domínio e repositórios.
- Define o limite da transação e o que acontece dentro dela.
- Declara as **portas**: interfaces dos repositórios e dos serviços de que precisa (`RepositorioDeMateriais`, `RepositorioDeMovimentacoes`, `RepositorioDeUsuarios`, `HashDeSenha`).
- Recebe dados já validados pelo schema Zod e devolve dados prontos para exibição.
- Declara os **modelos de leitura**: formatos de dados montados para uma tela, sem identidade nem ciclo de vida próprios.

`MaterialComSaldo` é um modelo de leitura declarado nesta camada e montado pelo repositório a partir da agregação de movimentações. Não é entidade, não é persistido e não tem tabela. A tela de consulta e a ficha do material usam esse modelo de leitura para exibir o saldo; a entidade `Material` nunca recebe campo de saldo.

Não conhece Next.js, não conhece Prisma, não conhece React.

### 3. Domínio (`src/domain`)

Regras de negócio do almoxarifado, em TypeScript puro.

- Entidades e seus invariantes: material, movimentação, usuário.
- Enums do domínio: categoria, unidade de medida, tipo de movimentação, motivo de entrada, motivo de saída.
- O value object `Quantidade`.
- Cálculos: saldo a partir de movimentações, situação de validade de um perecível.
- Erros de domínio.
- Schemas Zod das entradas de dados, porque precisam ser importáveis pelo formulário e pelo servidor.

Toda quantidade do sistema é o value object `Quantidade`. Ele guarda a menor subunidade como inteiro, nunca ponto flutuante, e o valor cabe com folga no inteiro seguro do JavaScript. A escala decimal — quantas casas a menor subunidade representa — é regra de domínio e tem uma única fonte de verdade: a decisão **Escala da quantidade** do `docs/prds/PRD-00-indice.md`. Este documento não repete a escala. Ele expõe criação a partir de string decimal, soma, subtração, comparação e formatação, e é o único tipo de quantidade usado no domínio e na aplicação — para quantidade de movimentação, para estoque mínimo e para o saldo.

Nenhuma camada acima do repositório manipula quantidade como `number`, como string solta ou como `Prisma.Decimal`. Aritmética de quantidade acontece dentro de `Quantidade`, nunca com operadores em cima de valores crus.

A fronteira entre Zod e entidade é fixa: **o schema Zod valida formato de entrada** — presença, tipo, faixa sintática, tamanho, pertencimento a um enum. **As invariantes de negócio vivem na entidade de domínio**, que as garante ao ser construída ou alterada, e são testadas diretamente na entidade, sem passar por Zod. Uma entidade nunca confia em ter sido criada a partir de um schema validado, e nenhuma regra de negócio existe apenas dentro de um `refine`.

**O domínio não importa nada de Next.js nem de Prisma.** Não importa `next`, `next/*`, `react`, `@prisma/client`, o cliente Prisma do projeto, nem qualquer módulo das camadas Web, Aplicação ou Infraestrutura. Um arquivo do domínio precisa poder ser executado por um teste de Vitest sem banco, sem servidor e sem variável de ambiente.

### 4. Infraestrutura (`src/infrastructure`)

Implementações das portas.

- Cliente Prisma e repositórios que implementam as interfaces declaradas na Aplicação.
- Configuração do Auth.js e a implementação do hash argon2id.
- Tradução entre linhas do banco e entidades de domínio, incluindo a conversão entre `Prisma.Decimal` e `Quantidade`. Essa conversão acontece exclusivamente aqui, junto da tradução linha–entidade, nos dois sentidos: o que sai do banco vira `Quantidade` antes de subir, e o que desce vira `Prisma.Decimal` na gravação. `Prisma.Decimal` não atravessa a fronteira da infraestrutura.
- É o único lugar onde `$queryRaw` / `$executeRaw` podem aparecer.

Não contém regra de negócio: um repositório não decide se uma operação é válida, apenas lê e grava.

### Composição

As dependências concretas são montadas em um único módulo de composição em `src/infrastructure`. A Server Action pede o caso de uso já montado a esse módulo; ela não instancia repositórios espalhados pelo código.

## Regra de dependência

| Camada | Pode importar | Nunca importa |
| --- | --- | --- |
| `src/app`, `src/components` | `src/application`, `src/domain`, o módulo de composição de `src/infrastructure`, `src/lib` | repositórios ou cliente Prisma diretamente |
| `src/application` | `src/domain`, suas próprias portas | `src/app`, `src/components`, `src/infrastructure`, `next/*`, `react`, `@prisma/client` |
| `src/domain` | apenas `src/domain` e Zod | todo o resto |
| `src/infrastructure` | `src/domain`, as portas e os modelos de leitura de `src/application`, Prisma, Auth.js | `src/app`, `src/components` |

A direção é única: de fora para dentro. A regra é verificada por ESLint com zonas de importação restritas, e uma violação quebra o lint.

## Onde ficam as regras de negócio

| Tipo de regra | Lugar |
| --- | --- |
| Formato da entrada (obrigatoriedade, tipo, tamanho, valor de enum) | Schema Zod |
| Invariante de uma entidade isolada (quantidade maior que zero, estoque mínimo não negativo, validade posterior à fabricação) | Domínio |
| Cálculo derivado (saldo, situação de validade) | Domínio |
| Regra que envolve mais de um registro ou o estado atual do banco (saldo suficiente para uma saída, nome de material já usado, unidade travada após a primeira movimentação, material sem movimentações pode ser excluído) | Caso de uso, dentro da transação |
| Restrição de integridade que serve de última defesa (chave única, chave estrangeira, `not null`, `check`) | Schema do banco, replicando o que o domínio já garante |
| Nada | Componente React, Server Action, repositório |

Uma regra de negócio nunca existe em dois lugares como duas implementações. A restrição do banco é rede de segurança, não a definição da regra.

## Server Actions são apenas porta de entrada

Uma Server Action faz, nesta ordem:

1. Chama o guard de acesso compartilhado e interrompe a operação se ele não devolver um usuário autenticado e ativo.
2. Valida a entrada com o schema Zod do domínio.
3. Chama um caso de uso.
4. Converte o resultado em resposta para a tela.
5. Revalida a rota afetada.

É proibido, dentro de uma Server Action: usar Prisma, montar SQL, somar movimentações, decidir sobre saldo, gerar o código do material, aplicar hash de senha, ou conter qualquer condicional de negócio.

### Condicional de negócio e controle de acesso são coisas diferentes

**Condicional de negócio** decide se a operação é válida: se o saldo cobre a saída, se o nome já existe, se a unidade pode mudar, se o material pode ser excluído. Vive no domínio ou no caso de uso, nunca na Server Action.

**Controle de acesso** decide se a requisição tem direito de tentar a operação. A verificação de sessão e de usuário ativo é controle de acesso, não condicional de negócio, e por isso o passo 1 não viola a proibição acima.

O controle de acesso vive em um único guard compartilhado, que toda Server Action chama no passo 1. O guard obtém a sessão e chama o caso de uso `obterUsuarioAutenticado`, que resolve a identidade e o indicador de atividade — a sessão dura 8 horas e a inativação precisa ter efeito imediato, então a atividade é conferida a cada requisição de servidor. **O guard não acessa Prisma:** o acesso ao banco acontece dentro do caso de uso, através do repositório de usuários, como em qualquer outra operação.

Nenhuma Server Action obtém a sessão por conta própria, e nenhuma repete a verificação de atividade.

## Sem regra de negócio em componente React

Componentes exibem dados e coletam entrada. Um componente não calcula saldo, não decide se um item está vencido, não decide se um botão de exclusão é permitido a partir de lógica própria: ele recebe o valor já resolvido pelo domínio, através do Server Component ou do caso de uso. Componentes de cliente cuidam de estado de formulário, foco, abertura de diálogo e exibição de erro — nada além disso.

## Como um erro de domínio vira resposta ao usuário

O domínio expõe um erro base `ErroDeDominio` com `codigo`, `mensagem` em português e, quando o erro pertence a um campo do formulário, `campo`. Cada regra violável tem sua subclasse, e cada subclasse tem um código estável.

O fluxo é único:

1. O domínio ou o caso de uso lança um `ErroDeDominio`.
2. A transação é desfeita.
3. A Server Action captura o erro em um único ponto de mapeamento compartilhado e devolve um resultado, nunca uma exceção.

O resultado de toda Server Action tem uma das duas formas:

- sucesso: `{ ok: true, dados }`
- falha: `{ ok: false, erro: { codigo, mensagem, campo? } }`

Falha de validação do schema Zod segue o mesmo formato de falha, com as mensagens por campo, para que o formulário as exiba junto de cada entrada.

Erro inesperado — o que não é `ErroDeDominio` — é registrado no log padrão do servidor, sem provedor de observabilidade, e devolvido como uma falha genérica. Mensagem de banco, SQL, stack trace, nome de tabela e nome de coluna nunca chegam à tela.

Falha de negócio prevista nunca é entregue como página de erro: ela volta como valor para a tela que originou a ação, com a mensagem do domínio.

## Estrutura de pastas

```text
prisma/
  schema.prisma
  migrations/
src/
  app/                       # rotas, páginas, layouts e Server Actions
  components/
    ui/                      # componentes de shadcn/ui
  application/
    material/                # casos de uso de material
    movimentacao/            # casos de uso de movimentação
    usuario/                 # casos de uso de usuário
    portas/                  # interfaces de repositórios e serviços
  domain/
    material/
    movimentacao/
    usuario/
    erros/
  infrastructure/
    prisma/                  # cliente Prisma
    repositorios/            # implementações das portas
    auth/                    # Auth.js e hash argon2id
    composicao.ts            # montagem dos casos de uso
  lib/                       # utilitários sem regra de negócio
tests/
  e2e/                       # especificações de Playwright (faixa adiada)
docs/                        # PRDs e constituição
openspec/                    # changes e specs
```

Testes de domínio e de caso de uso ficam ao lado do arquivo que exercitam. Testes de ponta a ponta ficam em `tests/e2e`.

## Invariantes que a arquitetura protege

Estas invariantes valem para todo o sistema. Nenhuma tela, caso de uso ou migration pode contrariá-las.

### 1. O saldo é sempre derivado das movimentações

Não existe coluna `saldo` na tabela de materiais, nem em nenhuma outra tabela, e não existe campo de saldo em nenhuma entidade persistida — a entidade `Material` nunca recebe esse campo. O saldo é sempre soma das entradas menos soma das saídas, e chega à tela pelo modelo de leitura `MaterialComSaldo`, declarado na camada de Aplicação, que não é entidade persistida e por isso não viola esta invariante.

Há um único cálculo de saldo no domínio e uma única forma de obtê-lo do banco: agregação sobre as movimentações, feita no repositório. A consulta paginada e a ordenação por saldo usam essa agregação; nunca um valor materializado. O saldo devolvido pela agregação é convertido em `Quantidade` no repositório, como qualquer outra quantidade, e é sob esse tipo que o domínio e a aplicação o comparam, somam e exibem.

Consequência: nenhuma operação "ajusta o saldo". Toda mudança de quantidade é uma movimentação.

#### Quando um valor derivado pode ser persistido

Coluna derivada é exceção, e só é permitida quando as três condições valem ao mesmo tempo:

1. é função pura de colunas da mesma linha;
2. é gravada na mesma transação que sua origem;
3. existe para que o banco imponha uma restrição.

O saldo não atende a nenhuma das três: depende de outra tabela e de todo o histórico, muda a cada movimentação gravada e nenhuma restrição de banco depende dele. Por isso permanece proibido como coluna, sem exceção.

### 2. A tabela de movimentações é append-only

O código nunca executa `UPDATE` nem `DELETE` sobre movimentações. O repositório de movimentações expõe apenas inserção e leituras — não existe método de alteração ou remoção, e por isso não existe caminho no código que os alcance.

Correção é sempre um registro novo: o estorno, que é uma movimentação inversa vinculada à original, com justificativa. A movimentação original permanece intacta e visível.

### 3. Saída é verificada e gravada na mesma transação, com bloqueio

Uma saída acontece dentro de uma única transação que:

1. Bloqueia a linha do material.
2. Recalcula o saldo já dentro do bloqueio.
3. Recusa a operação com erro de domínio se a quantidade deixaria o saldo negativo.
4. Insere a movimentação.

Ler o saldo fora da transação e decidir com esse valor é proibido: duas saídas simultâneas do mesmo material precisam ser serializadas, e a segunda precisa enxergar a primeira. O bloqueio de linha é a única razão pela qual SQL bruto é permitido, e vive apenas no repositório.

Esta invariante vale desde a primeira saída implementada. O que está adiado é apenas o teste automatizado que a verifica, conforme a matriz de testes de [`conventions.md`](./conventions.md); a regra de arquitetura não depende dele.

### 4. O cadastro de material é atômico

Validação de schema, invariantes de domínio, verificação de unicidade do nome e inserção acontecem em uma única transação. Se qualquer validação falhar, nada é gravado: não existe material criado pela metade nem registro auxiliar remanescente.

A unicidade do nome tem restrição única no banco, além da verificação no caso de uso, para que uma corrida entre dois cadastros simultâneos falhe como erro de domínio em vez de gerar duplicata.

O código do material é gerado pelo sistema, dentro da transação de cadastro, e não é aceito como entrada em nenhum caso de uso. Nenhum caso de uso altera o código de um material existente.

### 5. Usuário nunca é excluído do banco

Não existe caso de uso, repositório ou migration que remova um usuário. O repositório de usuários não expõe exclusão. Sair do laboratório é inativação: alteração do indicador de atividade, reversível.

O vínculo entre movimentação e usuário responsável é obrigatório e permanente, para que a autoria do histórico continue legível depois da inativação. Autenticação exige usuário ativo; o histórico de um usuário inativo continua visível.

O primeiro administrador nasce de um seed, não de uma tela de cadastro público: o seed lê as credenciais de variáveis de ambiente, aplica o mesmo hash argon2id usado pela aplicação e só cria o usuário quando não existe nenhum. O seed nunca altera, sobrescreve nem remove usuário existente. Ele é infraestrutura, roda fora das migrations e não é caminho de criação dos demais usuários.

### 6. A unidade de medida é imutável depois da primeira movimentação

A verificação acontece no caso de uso de alteração, dentro da mesma transação da gravação, consultando a existência de movimentações do material. Quantidades registradas em unidades diferentes não podem ser somadas, e o cálculo de saldo depende disso.

### 7. Material só é excluído enquanto não tiver movimentações

A verificação de ausência de movimentações e a exclusão ocorrem na mesma transação. Depois da primeira movimentação, o material é permanente, porque o histórico depende do cadastro para ser lido.
