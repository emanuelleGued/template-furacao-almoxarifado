# Tarefas

Ordenadas por dependência. A fase 3 não inicia sem a resposta da pergunta bloqueante registrada na proposta e em `design.md` (**Quantidade / escala decimal**); as fases 1 e 2 não dependem dela.

Todos os comandos do OpenSpec exigem Node 20 ou superior (D9).

## 1. Fundação do projeto

- [ ] 1.1 Inicializar a aplicação Next.js 15 com App Router, React 19 e TypeScript em modo `strict`, usando pnpm, sem nenhuma dependência fora de `tech-stack.md`
- [ ] 1.2 Configurar Tailwind CSS e instalar shadcn/ui com os componentes copiados para o repositório
- [ ] 1.3 Configurar ESLint e Prettier, e registrar o portão local de verificação descrito em `conventions.md`
- [ ] 1.4 Configurar Vitest para a faixa de domínio e casos de uso, sem banco e sem variável de ambiente
- [ ] 1.5 Criar as pastas das quatro camadas de `arquitetura.md` e a regra de lint que impede o domínio de importar Next.js, React e Prisma
- [ ] 1.6 Criar `.env.example` versionado, listando todas as variáveis exigidas e nenhum valor real
- [ ] 1.7 Documentar no README como subir o PostgreSQL de desenvolvimento e o que preencher no `.env`

## 2. Tema IDE.IA

- [ ] 2.1 Adicionar as sete variações `woff2` de Urbanist ao repositório e carregá-las pelo mecanismo de fontes locais do Next.js (D3)
- [ ] 2.2 Definir os tokens de cor da marca como propriedades CSS e ligá-los às variáveis de tema que o shadcn consome (D1)
- [ ] 2.3 Definir a escala tipográfica e a de espaçamento da aplicação a partir da referência visual, normalizando os sete valores fora da base 4px e o valor de cor sem token (D1)
- [ ] 2.4 Implementar a casca da aplicação — navegação entre materiais e cadastro de usuário, marca, ação Sair e indicação da área corrente
- [ ] 2.5 Implementar o retorno de ação concluída, sem bloquear a tela
- [ ] 2.6 Conferir que nenhuma tela requisita recurso de aparência a domínio externo

## 3. Domínio

Bloqueada pela pergunta **Quantidade / escala decimal**.

- [ ] 3.1 Implementar o value object `Quantidade` com a escala decidida, criação a partir de string decimal, soma, subtração, comparação e formatação, com testes de Vitest
- [ ] 3.2 Implementar os enums do domínio: categoria, unidade de medida, tipo de movimentação, motivo de entrada e motivo de saída
- [ ] 3.3 Implementar a entidade `Material` e seus invariantes, com testes cobrindo estoque mínimo não negativo e a exigência de datas do perecível
- [ ] 3.4 Implementar a entidade `Movimentacao` e seus invariantes, incluindo quantidade positiva e vínculo do estorno com a movimentação de origem
- [ ] 3.5 Implementar a entidade `Usuario` e seus invariantes
- [ ] 3.6 Implementar o cálculo de saldo a partir de movimentações, com teste do limite exato entre saldo e quantidade de saída
- [ ] 3.7 Implementar o cálculo da situação de validade de um perecível
- [ ] 3.8 Implementar os erros de domínio e os schemas Zod das entradas de dados

## 4. Persistência

- [ ] 4.1 Escrever o schema Prisma dos modelos `Material`, `Movimentacao` e `Usuario`, com os nomes de tabela e coluna de `conventions.md`
- [ ] 4.2 Gerar e aplicar a primeira migration
- [ ] 4.3 Implementar a tradução entre linhas do banco e entidades, incluindo a conversão de quantidade nos dois sentidos, confinada à infraestrutura
- [ ] 4.4 Implementar `RepositorioDeMateriais`, montando o modelo de leitura `MaterialComSaldo` por agregação (D7)
- [ ] 4.5 Implementar `RepositorioDeMovimentacoes`, com o bloqueio de linha exigido pela validação de saída (D7)
- [ ] 4.6 Implementar `RepositorioDeUsuarios` e o hash argon2id
- [ ] 4.7 Implementar a semente do primeiro usuário, lendo a credencial de configuração por ambiente

## 5. Autenticação

- [ ] 5.1 Configurar o Auth.js com provider de credenciais e a expiração absoluta de 8 horas fixada em `tech-stack.md`
- [ ] 5.2 Implementar o caso de uso `obterUsuarioAutenticado` e o guard de acesso compartilhado
- [ ] 5.3 Implementar a tela `/login` conforme a referência visual, com as mensagens de credencial inválida e de acesso inativo
- [ ] 5.4 Implementar a ação Sair e a proteção de todas as rotas com sessão
- [ ] 5.5 Verificar os cenários da spec `autenticacao`, incluindo o de e-mail inexistente produzindo a mesma mensagem que a senha incorreta

## 6. Consulta de materiais

- [ ] 6.1 Implementar o caso de uso de consulta com busca, filtros, ordenação e paginação
- [ ] 6.2 Implementar a rota `/materiais` lendo o estado da consulta dos parâmetros de busca da URL (D5)
- [ ] 6.3 Implementar a tabela com as seis colunas e o aviso "Abaixo do mínimo"
- [ ] 6.4 Implementar o filtro de validade que aparece e desaparece com a categoria perecível
- [ ] 6.5 Implementar a ordenação por nome e por saldo com desempate alfabético estável entre páginas
- [ ] 6.6 Implementar os dois estados vazios e o estado de carregamento
- [ ] 6.7 Verificar os cenários da spec `consulta-de-materiais`

## 7. Cadastro e alteração de material

- [ ] 7.1 Implementar os casos de uso `cadastrarMaterial` e `alterarMaterial`
- [ ] 7.2 Implementar o componente único de formulário de material, com a reatividade da categoria perecível como ilha de cliente (D4, D6)
- [ ] 7.3 Implementar a rota `/materiais/novo`, sem campo de código e com o aviso permanente da unidade de medida
- [ ] 7.4 Implementar a rota `/materiais/:codigo/editar`, com o código somente leitura e a trava da unidade quando houver movimentação
- [ ] 7.5 Implementar a recusa por nome duplicado, com o atalho para o material existente na criação e a mensagem sem atalho na alteração
- [ ] 7.6 Verificar os cenários da spec `cadastro-de-materiais`, incluindo o de manter o próprio nome ao alterar

## 8. Ficha do material

- [ ] 8.1 Implementar o caso de uso que monta a ficha com dados, saldo e histórico
- [ ] 8.2 Implementar a rota `/materiais/:codigo` com os dados cadastrais, o saldo e o aviso de estoque mínimo
- [ ] 8.3 Implementar a situação de validade do perecível nos dois formatos
- [ ] 8.4 Implementar o histórico ordenado do mais recente ao mais antigo, com quem retirou nas saídas e o vínculo visível do estorno
- [ ] 8.5 Implementar o histórico vazio e o estado de carregamento em que dados e saldo aparecem antes do histórico
- [ ] 8.6 Implementar o caso de uso `estornarMovimentacao` e o diálogo de estorno com justificativa obrigatória
- [ ] 8.7 Implementar a recusa do estorno que deixaria o saldo negativo
- [ ] 8.8 Implementar o caso de uso `excluirMaterial` e o diálogo de exclusão exibindo o nome, com a ação desabilitada quando houver movimentação
- [ ] 8.9 Verificar os cenários da spec `ficha-do-material`

## 9. Registro de movimentação

- [ ] 9.1 Implementar os casos de uso `registrarEntrada` e `registrarSaida`, com a conferência de saldo e a gravação na mesma transação (D7)
- [ ] 9.2 Implementar a rota `/materiais/:codigo/movimentacoes/nova` com nome, unidade e saldo atual no topo
- [ ] 9.3 Implementar a escolha do tipo antes dos demais campos, como ilha de cliente, trocando os motivos e revelando quem retirou (D6)
- [ ] 9.4 Implementar as validações de quantidade e a recusa por saldo insuficiente com o saldo disponível na mensagem
- [ ] 9.5 Verificar os cenários da spec `movimentacoes`, incluindo saída exatamente igual ao saldo
- [ ] 9.6 Verificar que a primeira movimentação trava a unidade na alteração e desabilita a exclusão na ficha

## 10. Cadastro de usuário

- [ ] 10.1 Implementar o caso de uso `cadastrarUsuario` com hash argon2id e verificação de e-mail único entre todos os usuários
- [ ] 10.2 Implementar a rota `/usuarios/novo` com nome completo, e-mail, senha e confirmação
- [ ] 10.3 Implementar a recusa por senhas divergentes, limpando os dois campos de senha
- [ ] 10.4 Verificar os cenários da spec `cadastro-de-usuarios`, incluindo e-mail pertencente a usuário inativo

## 11. Validação final

- [ ] 11.1 Rodar o portão local completo: lint, formatação, checagem de tipos e Vitest, com tudo passando
- [ ] 11.2 Percorrer as sete telas contra a referência visual e registrar qualquer desvio deliberado
- [ ] 11.3 Conferir cada cenário das sete specs desta change, um a um, na aplicação em execução
- [ ] 11.4 Conferir que nenhuma dependência fora de `tech-stack.md` entrou no `package.json` e que o lockfile está versionado
- [ ] 11.5 Conferir que nenhuma credencial, segredo ou URL de banco aparece no código, em teste, na semente ou na documentação
- [ ] 11.6 Rodar `openspec validate telas-da-poc` e arquivar a change
