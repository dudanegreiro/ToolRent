# 🛠️ ToolRent — Plataforma de Aluguel de Ferramentas

Projeto acadêmico desenvolvido para a disciplina de **Desenvolvimento Web/Mobile** do curso de **Ciência da Computação** da **Universidade Federal do Tocantins (UFT)**.

O **ToolRent** conecta pessoas que têm ferramentas paradas em casa com pessoas que precisam delas por poucos dias. Assim ninguém precisa comprar um equipamento caro para usar uma vez só.

---

## 📋 Sumário

* [Funcionalidades](#-funcionalidades)
* [Tecnologias](#-tecnologias)
* [Por que um app universal](#-por-que-um-app-universal)
* [Fora do escopo](#-fora-do-escopo)
* [Estrutura de pastas](#-estrutura-de-pastas)
* [Como executar](#️-como-executar)
* [Testes](#-testes)
* [Equipe](#-equipe)
* [Licença](#-licença)

---

## ✨ Funcionalidades

Marcamos aqui o que já está funcionando no app.

* [x] Cadastro e login de usuários
* [x] Edição do perfil (nome, telefone e senha)
* [x] Cadastro de ferramentas em 6 passos (categoria, detalhes, fotos, preço, local e revisão)
* [x] Upload de fotos das ferramentas
* [x] Preço por dia, com preço semanal calculado automaticamente (10% de desconto)
* [x] Política de cancelamento, caução e período mínimo
* [x] Busca de ferramentas pelo nome, marca ou modelo
* [x] Filtro por categoria
* [x] Filtro por faixa de preço
* [x] Filtro de ferramentas disponíveis
* [x] Tela de detalhes da ferramenta
* [x] "Meus anúncios", com edição e exclusão do anúncio
* [ ] Filtro por localização
* [ ] Diferenciação entre locador e locatário
* [ ] Solicitação e reserva de aluguel
* [ ] Cálculo do valor do aluguel pela quantidade de dias
* [ ] Negociação do valor entre os usuários
* [ ] Avaliação entre usuários depois do aluguel
* [ ] Chat entre locador e locatário
* [ ] Gerenciamento dos aluguéis realizados
* [ ] Layout responsivo para telas grandes na web

O banco já tem as tabelas de aluguel, negociação e avaliação, mas ainda não existem rotas nem telas para elas.

---

## 🚀 Tecnologias

### 📱 Front-end (web e mobile)

* [Expo](https://expo.dev/) SDK 57 com React Native 0.86 e React 19
* [Expo Router](https://docs.expo.dev/router/introduction/) para as rotas (pasta `src/app`)
* TypeScript 6
* AsyncStorage para guardar a sessão do usuário

### ⚙️ Back-end

* Python 3.12 ou mais novo
* [Django](https://www.djangoproject.com/) 6.1
* [Django Ninja](https://django-ninja.dev/) para a API REST
* django-cors-headers para liberar o acesso do app
* python-dotenv para ler o arquivo `.env`

### 🗄️ Banco de dados

* SQLite (arquivo `backend/db.sqlite3`, criado pelo `migrate`)

### 🧪 Testes

* `node --test` (test runner que já vem com o Node) para o front-end
* Testes do Django para o back-end

---

## 🌐 Por que um app universal

Usamos o Expo porque o mesmo código roda no **Android**, no **iOS** e no **navegador**. Com isso:

* A equipe escreve cada tela uma vez só, em vez de ter um projeto web e outro mobile.
* Qualquer pessoa da equipe consegue testar no navegador, mesmo sem emulador ou celular.
* O professor pode ver o projeto pelo navegador ou pelo app Expo Go.

O custo é que alguns recursos funcionam diferente em cada plataforma. O envio de fotos, por exemplo, tem um caminho para a web e outro para o celular (veja `src/features/ferramentas/api/fotoHttp.ts`).

---

## 🚫 Fora do escopo

Para conseguir entregar dentro do semestre, a equipe decidiu **não** fazer:

* Pagamento dentro do app. O valor é combinado e pago fora da plataforma.
* Publicação nas lojas (Play Store e App Store).
* Deploy em servidor de produção. O projeto roda localmente.
* Mapa com localização em tempo real.
* Notificações push.

---

## 📁 Estrutura de pastas

```text
ToolRent/
├── backend/                  # API em Django
│   ├── config/               # settings.py, urls.py e api.py (rotas da API)
│   ├── toolrent/             # Models, migrations e testes
│   ├── .env.example          # Modelo do arquivo de variáveis de ambiente
│   ├── manage.py
│   └── requirements.txt
├── docs/
│   └── arquitetura.md        # Regras de pastas e decisões da equipe
├── src/
│   ├── app/                  # Rotas do Expo Router (só reexportam as telas)
│   ├── features/
│   │   ├── auth/             # Login, cadastro e usuário
│   │   ├── anuncios/         # Criar anúncio e "Meus anúncios"
│   │   └── ferramentas/      # Home, explorar, detalhes, categorias e fotos
│   └── shared/               # Código usado por várias features
├── tests/                    # Testes do front-end (npm test)
├── app.json                  # Configuração do Expo
└── package.json
```

Cada feature tem `screens/` (telas), `components/`, `services/` (regras que podem ser testadas), `api/` (chamadas ao backend) e, quando precisa, `domain/` (regras puras). As regras de quem pode importar o quê estão em [docs/arquitetura.md](docs/arquitetura.md).

---

## ⚙️ Como executar

### Pré-requisitos

* [Node.js](https://nodejs.org/) 20 ou mais novo (testado no 24)
* [Python](https://www.python.org/) 3.12 ou mais novo
* Git

### 1. Clone o repositório

```bash
git clone https://github.com/dudanegreiro/ToolRent.git
cd ToolRent
```

### 2. Rode o back-end

Entre na pasta do backend e crie um ambiente virtual:

```bash
cd backend
python -m venv .venv
```

Ative o ambiente virtual.

No Windows:

```bash
.venv\Scripts\activate
```

No Linux ou macOS:

```bash
source .venv/bin/activate
```

Instale as dependências:

```bash
pip install -r requirements.txt
```

Crie o arquivo `.env` a partir do modelo. No Windows use `copy` no lugar de `cp`:

```bash
cp .env.example .env
```

Abra o `.env` e troque o `SECRET_KEY`. Para gerar uma chave nova:

```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

Crie o banco de dados. Esse comando também cadastra as categorias padrão:

```bash
python manage.py migrate
```

Inicie o servidor na porta **8001**, que é a porta que o app usa:

```bash
python manage.py runserver 8001
```

A documentação da API fica em http://localhost:8001/api/docs.

> Se você já tinha o projeto antes desta versão, o `db.sqlite3` e a pasta `media/` saíram do Git. Faça uma cópia deles antes de dar `git pull` se quiser manter seus dados de teste. Depois é só rodar o `migrate` de novo.

### 3. Rode o app

Em outro terminal, na pasta raiz do projeto:

```bash
npm install
npm start
```

Depois aperte `w` para abrir no navegador, `a` para o emulador Android ou leia o QR Code com o app Expo Go.

O app procura a API em `http://localhost:8001/api`. No emulador Android ele usa `http://10.0.2.2:8001/api`. Para testar num celular de verdade, crie um arquivo `.env` na raiz com o IP do seu computador:

```bash
EXPO_PUBLIC_API_URL=http://SEU_IP:8001/api
```

Nesse caso, o IP também precisa estar no `ALLOWED_HOSTS` do `backend/config/settings.py`.

---

## 🧪 Testes

Testes do front-end (regras, serviços e arquitetura):

```bash
npm test
```

Checagem de tipos do TypeScript:

```bash
npx tsc --noEmit
```

Testes do back-end, com o ambiente virtual ativado e dentro de `backend/`:

```bash
python manage.py test toolrent
```

Para criar um teste novo no front-end, coloque um arquivo terminado em `.test.mjs` dentro da pasta `tests/`. O `npm test` encontra ele sozinho.

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

Este projeto foi desenvolvido para fins acadêmicos como parte da disciplina de **Desenvolvimento Web/Mobile**, no período **2026/2**, do curso de **Ciência da Computação da Universidade Federal do Tocantins (UFT)**. Veja também o arquivo [LICENSE](LICENSE).
