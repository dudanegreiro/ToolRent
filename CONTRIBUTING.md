# 🤝 Guia de Contribuição — ToolRent

Este documento apresenta as convenções e boas práticas que devem ser seguidas pelos integrantes da equipe durante o desenvolvimento do projeto **ToolRent**.

O objetivo é manter o código organizado, facilitar a colaboração entre os membros da equipe e garantir que as alterações sejam revisadas antes de serem integradas à versão principal do projeto.

---

## 🌿 Convenção para Branches

Nenhuma alteração deve ser realizada diretamente na branch `main`.

Cada nova funcionalidade, correção ou alteração deve ser desenvolvida em uma branch específica.

O padrão para nomear as branches será:

```text
tipo/descricao-da-alteracao
```

### Regras

* Utilizar apenas letras minúsculas;
* Separar palavras utilizando hífen (`-`);
* Utilizar nomes curtos e descritivos;
* Cada branch deve possuir um objetivo específico;
* Não realizar commits diretamente na branch `main`;
* Após concluir uma alteração, ela deve ser enviada por meio de um **Pull Request**.

### Tipos de Branches

| Tipo        | Quando utilizar                                   | Exemplo                        |
| ----------- | ------------------------------------------------- | ------------------------------ |
| `feature/`  | Desenvolvimento de novas funcionalidades          | `feature/cadastro-usuario`     |
| `fix/`      | Correção de bugs                                  | `fix/erro-login`               |
| `docs/`     | Alterações na documentação                        | `docs/atualizar-readme`        |
| `test/`     | Criação ou alteração de testes                    | `test/testes-cadastro`         |
| `chore/`    | Configurações e tarefas de manutenção             | `chore/atualizar-dependencias` |
| `refactor/` | Refatoração de código sem alterar funcionalidades | `refactor/organizar-servicos`  |
| `ui/`       | Alterações relacionadas à interface               | `ui/tela-login`                |
| `database/` | Alterações no banco de dados                      | `database/tabela-ferramentas`  |

### Exemplos para o ToolRent

```text
feature/cadastro-usuario
feature/login-usuario
feature/cadastro-ferramenta
feature/editar-ferramenta
feature/listar-ferramentas
feature/buscar-ferramentas
feature/filtro-localizacao
feature/solicitar-aluguel
feature/negociar-aluguel
feature/avaliacao-usuarios
feature/chat-usuarios
feature/painel-usuario

fix/erro-login
fix/validacao-cadastro
fix/erro-reserva

docs/readme
docs/contributing

test/testes-login
test/testes-cadastro-ferramenta
test/testes-aluguel

chore/configuracao-inicial
chore/atualizar-dependencias

refactor/organizar-api

ui/tela-login
ui/tela-cadastro
ui/tela-ferramentas
ui/tela-detalhes-ferramenta

database/criar-tabela-usuarios
database/criar-tabela-ferramentas
database/criar-tabela-alugueis
```

---

## 💬 Convenção para Commits

As mensagens de commit devem ser claras e objetivas, descrevendo a alteração realizada.

O padrão recomendado será:

```text
tipo: descrição da alteração
```

### Tipos de commits

| Tipo       | Descrição                      | Exemplo                                   |
| ---------- | ------------------------------ | ----------------------------------------- |
| `feat`     | Nova funcionalidade            | `feat: adiciona cadastro de ferramentas`  |
| `fix`      | Correção de erro               | `fix: corrige validação do login`         |
| `docs`     | Alteração na documentação      | `docs: atualiza README`                   |
| `test`     | Criação ou alteração de testes | `test: adiciona testes de cadastro`       |
| `refactor` | Refatoração do código          | `refactor: reorganiza serviço de aluguel` |
| `chore`    | Configuração ou manutenção     | `chore: atualiza dependências`            |

### Exemplos

```text
feat: adiciona cadastro de ferramentas
feat: implementa solicitação de aluguel
fix: corrige erro no login
docs: atualiza contributing
test: adiciona testes de autenticação
refactor: reorganiza estrutura da api
chore: configura variáveis de ambiente
```

---

## 🔀 Pull Requests

Após finalizar uma alteração em sua branch, o integrante deverá abrir um **Pull Request** para solicitar a integração das alterações à branch principal.

Antes de abrir um Pull Request, verifique se:

* [ ] A alteração foi desenvolvida na branch correta;
* [ ] O código está funcionando corretamente;
* [ ] Não existem arquivos desnecessários incluídos;
* [ ] As alterações estão relacionadas ao objetivo da branch;
* [ ] A branch está atualizada com as alterações necessárias do projeto.

### Título do Pull Request

O título deve ser claro e descrever resumidamente a alteração realizada.

**Exemplo:**

```text
Implementa cadastro de ferramentas
```

### Descrição do Pull Request

A descrição deve explicar as principais alterações realizadas.

**Exemplo:**

```md
## Descrição

Implementação da funcionalidade de cadastro de ferramentas disponíveis para aluguel.

## Alterações realizadas

- Criação do formulário de cadastro;
- Adição dos campos de nome, descrição e valor por dia;
- Implementação da validação dos campos obrigatórios;
- Integração inicial com a API.
```

---

## 👀 Revisão de Código

Todo Pull Request deverá ser revisado por pelo menos outro integrante da equipe antes de ser integrado à branch `main`.

O responsável pela revisão deverá:

* Verificar se o código está funcionando corretamente;
* Analisar se a alteração atende ao objetivo proposto;
* Identificar possíveis erros ou melhorias;
* Adicionar comentários quando necessário.

Caso sejam solicitadas alterações, o responsável pela branch deverá realizá-las antes da aprovação.

---

## 🚫 Branch `main`

A branch `main` representa a versão principal e estável do projeto.

Portanto:

* Não é permitido realizar commits diretamente na `main`;
* Todas as funcionalidades devem ser desenvolvidas em branches específicas;
* As alterações devem ser integradas por meio de Pull Requests;
* Todo Pull Request deve passar pela revisão de outro integrante da equipe antes da aprovação.

---

## 📌 Fluxo de Trabalho

O fluxo de desenvolvimento adotado pela equipe será:

1. Atualizar o repositório local:

```bash
git pull origin main
```

2. Criar uma nova branch:

```bash
git checkout -b feature/nome-da-funcionalidade
```

3. Realizar as alterações necessárias.

4. Adicionar os arquivos modificados:

```bash
git add .
```

5. Criar um commit seguindo o padrão definido:

```bash
git commit -m "feat: adiciona nome da funcionalidade"
```

6. Enviar a branch para o GitHub:

```bash
git push origin feature/nome-da-funcionalidade
```

7. Abrir um **Pull Request**.

8. Solicitar a revisão de outro integrante da equipe.

9. Após a aprovação, realizar a integração da alteração à branch `main`.
