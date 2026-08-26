# 🛠️ ToolRent — Plataforma de Aluguel de Ferramentas

Projeto acadêmico desenvolvido para a disciplina de **Desenvolvimento Web/Mobile** do curso de **Ciência da Computação** da **Universidade Federal do Tocantins (UFT)**.

O **ToolRent** é uma aplicação web e mobile que conecta pessoas que possuem ferramentas ociosas a pessoas que precisam alugá-las por curtos períodos. A plataforma busca facilitar pequenos reparos, obras e projetos, evitando a necessidade de comprar equipamentos caros que serão utilizados apenas ocasionalmente.

---

## 📋 Sumário

* [Sobre o projeto](#-sobre-o-projeto)
* [Funcionalidades](#-funcionalidades)
* [Tecnologias utilizadas](#-tecnologias-utilizadas)
* [Arquitetura](#️-arquitetura)
* [Como executar o projeto](#️-como-executar-o-projeto)
* [Estrutura de pastas](#-estrutura-de-pastas)
* [Equipe](#-equipe)
* [Licença](#-licença)

---

## 📖 Sobre o projeto

O ToolRent foi criado com o objetivo de resolver um problema comum: muitas pessoas possuem ferramentas que utilizam raramente, enquanto outras precisam desses mesmos equipamentos apenas por alguns dias.

A plataforma permitirá:

* Que **locadores** cadastrem ferramentas disponíveis para aluguel, incluindo fotos, descrição, preço por dia e localização.
* Que **locatários** pesquisem e filtrem ferramentas de acordo com categorias, preços e localização.
* Que os usuários possam solicitar o aluguel de ferramentas para períodos específicos.
* Que ambas as partes combinem datas e condições de forma simples e segura.
* Que o valor estimado do aluguel seja calculado de acordo com a quantidade de dias selecionada, podendo ser negociado entre locador e locatário, caso necessário.

Este projeto foi desenvolvido para fins acadêmicos, com foco na aplicação de conceitos de **desenvolvimento web e mobile**, **modelagem de banco de dados** e **boas práticas de engenharia de software**.

---

## ✨ Funcionalidades

As funcionalidades serão marcadas conforme forem implementadas.

* [ ] Cadastro e login de usuários
* [ ] Diferenciação entre locador e locatário
* [ ] Cadastro de ferramentas
* [ ] Upload de fotos das ferramentas
* [ ] Cadastro de descrição e valor diário do aluguel
* [ ] Busca de ferramentas
* [ ] Filtro por categoria
* [ ] Filtro por preço
* [ ] Filtro por localização
* [ ] Sistema de solicitação e reserva de aluguel
* [ ] Cálculo do valor conforme a quantidade de dias
* [ ] Possibilidade de negociação do valor entre os usuários
* [ ] Avaliação entre usuários após o aluguel
* [ ] Chat ou sistema de contato entre locador e locatário
* [ ] Painel do usuário
* [ ] Gerenciamento dos anúncios cadastrados
* [ ] Gerenciamento dos aluguéis realizados
* [ ] Versão responsiva para web
* [ ] Aplicativo mobile

---

## 🚀 Tecnologias utilizadas

### 🌐 Front-end Web

* A definir

### 📱 Front-end Mobile

* A definir

### ⚙️ Back-end

* A definir

### 🗄️ Banco de Dados

* A definir

### 🛠️ Outras ferramentas

* Git
* GitHub

---

## 🏗️ Arquitetura

O sistema será organizado em diferentes camadas para facilitar a manutenção e o desenvolvimento da aplicação.

### 🌐 Cliente Web

Interface acessada por meio do navegador, permitindo que os usuários realizem cadastros, pesquisem ferramentas, publiquem anúncios e solicitem aluguéis.

### 📱 Cliente Mobile

Aplicativo destinado a dispositivos móveis, oferecendo funcionalidades semelhantes à versão web.

### ⚙️ API / Back-end

Responsável pelas regras de negócio da aplicação e pela comunicação entre os clientes e o banco de dados.

Entre suas responsabilidades estão:

* Autenticação de usuários;
* Cadastro e gerenciamento de ferramentas;
* Gerenciamento de solicitações e reservas;
* Cálculo dos valores de aluguel;
* Comunicação com o banco de dados.

### 🗄️ Banco de Dados

Responsável por armazenar as informações da plataforma, incluindo:

* Usuários;
* Ferramentas;
* Anúncios;
* Solicitações de aluguel;
* Reservas;
* Avaliações;
* Mensagens ou negociações.

---

## ⚙️ Como executar o projeto

> ⚠️ Os comandos abaixo devem ser ajustados de acordo com as tecnologias utilizadas no desenvolvimento do projeto.

### Pré-requisitos

Antes de começar, será necessário ter instalado:

* [ ] Node.js
* [ ] Gerenciador de pacotes (`npm` ou `yarn`)
* [ ] Banco de dados configurado
* [ ] Outras dependências necessárias

### Clone o repositório

```bash
git clone https://github.com/seu-usuario/toolrent.git
```

### Acesse a pasta do projeto

```bash
cd toolrent
```

### Instale as dependências

```bash
npm install
```

### Configure as variáveis de ambiente

```bash
cp .env.example .env
```

Configure as variáveis necessárias no arquivo `.env`.

### Execute o projeto

```bash
npm run dev
```

### 📱 Para executar o aplicativo mobile

```bash
cd mobile
```

Instale as dependências:

```bash
npm install
```

Inicie o aplicativo:

```bash
npx expo start
```

---

## 📁 Estrutura de pastas

A estrutura inicial do projeto poderá seguir o seguinte padrão:

```text
toolrent/
│
├── web/                 # Aplicação web
│
├── mobile/              # Aplicação mobile
│
├── api/                 # Back-end e API
│
├── docs/                # Documentação do projeto
│
└── README.md            # Documentação principal
```

> A estrutura poderá ser alterada conforme a arquitetura e as tecnologias escolhidas pela equipe.

---

## 👥 Equipe

| Nome                            | Função                        | GitHub        |
| ------------------------------- | ----------------------------- | ------------- |
| José Guilherme Costa Oliveira   | Front-end / Back-end / Mobile | @ZezinG14     |
| Maria Eduarda Negreiro de Souza | Front-end / Back-end / Mobile | @dudanegreiro |
| Hátilan Caio Alves Fontes       | Front-end / Back-end / Mobile | @Hatilancaio  |

### 👨‍🏫 Orientador

**Professor Jackson Gomes de Souza**

---

## 📄 Licença

Este projeto foi desenvolvido para fins acadêmicos como parte da disciplina de **Desenvolvimento Web/Mobile**, no período **2026/2**, do curso de **Ciência da Computação da Universidade Federal do Tocantins (UFT)**.

