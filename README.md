🛠️ ToolRent — Plataforma de Aluguel de Ferramentas
Projeto acadêmico desenvolvido para a disciplina de Desenvolvimento Web/Mobile do curso de Ciência da Computação— Universidade Federal do Tocantins
O ToolRent é uma aplicação web e mobile que conecta pessoas que possuem ferramentas ociosas a pessoas que precisam alugá-las por curtos períodos, facilitando pequenos reparos, obras e projetos sem a necessidade de comprar equipamentos caros.
________________________________________
📋 Sumário
•	Sobre o projeto
•	Funcionalidades
•	Tecnologias utilizadas
•	Arquitetura
•	Como executar o projeto
•	Estrutura de pastas
•	Equipe
•	Licença
________________________________________
📖 Sobre o projeto
O ToolRent foi criado com o objetivo de resolver um problema comum: muitas pessoas possuem ferramentas que usam raramente, enquanto outras precisam desses mesmos itens apenas por alguns dias. A plataforma permite:
•	Que anunciantes cadastrem ferramentas disponíveis para aluguel, com fotos, preço por dia e localização.
•	Que locatários busquem, filtrem e solicitem o aluguel de ferramentas próximas.
•	Que ambas as partes combinem datas e condições de forma simples e segura. O valor do aluguel já aparece visível por quantidade de dias, mas pode ser negociado entre locador e locatário caso necessário.
Este projeto foi desenvolvido como trabalho acadêmico, com foco em aplicar conceitos de desenvolvimento web e mobile, modelagem de banco de dados e boas práticas de engenharia de software.
________________________________________
✨ Funcionalidades
•	[ ] Cadastro e login de usuários (locador e locatário)
•	[ ] Cadastro de ferramentas com fotos, descrição e valor por dia de aluguel
•	[ ] Busca e filtro de ferramentas por categoria, preço e localização
•	[ ] Sistema de solicitação/reserva de aluguel, com possibilidade de negociação do valor entre as partes
•	[ ] Avaliação entre usuários após o aluguel
•	[ ] Chat ou contato entre locador e locatário
•	[ ] Painel do usuário (meus anúncios, meus aluguéis)
•	[ ] Versão responsiva (web) e aplicativo mobile
Marque os itens conforme forem implementados.
________________________________________
🚀 Tecnologias utilizadas
Front-end (Web)
•	
Front-end (Mobile)
•	
Back-end
•	
Banco de dados
•	
Outras ferramentas
•	Git, GitHub.
________________________________________
🏗️ Arquitetura
Breve descrição de como o sistema está organizado, por exemplo:
•	Cliente Web: interface acessada via navegador.
•	Cliente Mobile: aplicativo para Android/iOS.
•	API: responsável pelas regras de negócio e comunicação com o banco.
•	Banco de dados: armazena usuários, ferramentas e aluguéis.
________________________________________
⚙️ Como executar o projeto
Pré-requisitos
•	[] instalado
•	[Gerenciador de pacotes: 
•	[Banco de dados configurado]
Passo a passo
# Clone o repositório
git clone https://github.com/seu-usuario/toolrent.git

# Acesse a pasta do projeto
cd toolrent

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env

# Execute o projeto
npm run dev
Para o aplicativo mobile:
cd mobile
npm install
npx expo start
Ajuste os comandos de acordo com a stack real utilizada no projeto.
________________________________________
📁 Estrutura de pastas
toolrent/
├── web/               # Aplicação web
├── mobile/            # Aplicação mobile
├── api/               # Back-end / API
├── docs/              # Documentação do projeto
└── README.md
________________________________________
👥 Equipe
Nome	                                      Função	              GitHub
José Guilherme Costa Oliveira   [Front-end / Back-end / Mobile]	[@ZezinG14]
Maria Eduarda Negreiro de Souza	[Front-end / Back-end / Mobile]	[@dudanegreiro]
Hátilan Caio Alves Fontes	      [Front-end / Back-end / Mobile]	[@Hatilancaio]
Orientador: Professor Jackson Gomes de Souza
________________________________________
📄 Licença
Este projeto foi desenvolvido para fins acadêmicos como parte da disciplina de Desenvolvimento Web/Mobile em 2026/2.
