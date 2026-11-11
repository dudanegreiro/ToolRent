# Arquitetura do front-end do ToolRent

Este documento explica como as pastas de `src/` estão organizadas, quais regras de dependência a equipe combinou e por que algumas coisas foram feitas desse jeito.

## Estrutura de pastas

```text
src/
├── app/                  # Só rotas do Expo Router (cada arquivo reexporta uma tela)
├── features/
│   ├── auth/             # Login, cadastro e dados do usuário
│   │   ├── api/          # Implementação HTTP (chama o backend)
│   │   ├── components/
│   │   ├── screens/
│   │   ├── services/     # "Contratos" (repositórios) e regras que usam eles
│   │   └── types.ts
│   ├── anuncios/         # Fluxo de criar anúncio e "Meus anúncios"
│   │   ├── components/
│   │   ├── domain/       # Regras puras (ex.: preço semanal)
│   │   ├── screens/
│   │   └── services/     # publicarAnuncio, listarMeusAnuncios
│   └── ferramentas/      # Home, explorar, detalhes, categorias e fotos
│       ├── api/
│       ├── domain/       # Políticas de cancelamento
│       ├── screens/
│       ├── services/
│       └── types.ts
└── shared/               # Coisas usadas por várias features
    ├── components/       # BottomNavBar
    ├── formatacao.ts     # formatarMoeda
    ├── http.ts           # request() comum e endereço da API
    ├── navigation.ts
    └── session.ts
```

## Regras de dependência

1. **`src/app/` só tem rotas.** Cada arquivo tem uma linha, por exemplo `export { default } from '@/features/auth/screens/LoginScreen';`. A exceção é `_layout.tsx` e `index.tsx`, que são arquivos especiais do Expo Router.
2. **`domain/` e `services/` não importam React, Expo nem nenhuma biblioteca.** Eles também não importam `api/`, `screens/`, `components/`, `shared/http`, `shared/session` nem `shared/navigation`, porque esses usam `react-native` por dentro. Assim dá para testar com `node --test` sem abrir o app.
3. **`shared/` não importa nada de `features/`.** O `shared` é a base e as features usam ele, nunca o contrário.
4. **Não pode ter dependência circular entre features.** Hoje as dependências são estas:
   - `anuncios` usa `ferramentas`, porque o anúncio cria uma ferramenta.
   - `ferramentas` usa `auth`, porque a Home tem a aba de perfil.
   - `auth` não usa nenhuma outra feature.
5. **Os imports usam o alias `@/`**, que aponta para `src/`. A única exceção está explicada na tabela de decisões abaixo.

Essas regras são conferidas automaticamente pelo arquivo `tests/arquitetura.test.mjs`. Se alguém quebrar uma regra, o `npm test` falha e mostra qual arquivo está errado.

## Tabela de decisões

| Decisão | Motivo | Custo |
| --- | --- | --- |
| Organizar por funcionalidade (`features/auth`, `features/anuncios`, `features/ferramentas`) | Tudo de uma funcionalidade fica numa pasta só, então fica mais fácil achar e dividir o trabalho na equipe | Mais pastas e caminhos de import mais longos |
| Deixar em `src/app/` só as rotas | O Expo Router transforma todo arquivo de `app/` em rota, então componentes e serviços não podem ficar lá | Cada tela tem um arquivo a mais, com uma linha |
| Criar um "repositório" (um `type` com as funções) e uma implementação HTTP separada | Os serviços recebem o repositório como parâmetro, então os testes passam uma versão falsa e não precisam do backend rodando | Mais arquivos por feature |
| Colocar regras puras em `domain/` | A conta do preço semanal estava repetida em duas telas. Agora existe uma função só, que é testada | Mais um lugar para procurar código |
| Usar `node --test` em vez de Jest | Já vem com o Node, não precisa instalar nem configurar nada | Não tem as ferramentas prontas do Jest, como mocks automáticos. O comando esconde um aviso do Node sobre o tipo dos arquivos `.ts` |
| Imports relativos com `.ts` dentro de `domain/` e `services/` (ex.: `'../domain/preco.ts'`) | O Node não entende o alias `@/` nem import sem extensão. Imports só de tipo (`import type`) podem usar o alias, porque o Node apaga eles | É uma exceção à regra do alias. Foi preciso ligar `allowImportingTsExtensions` no `tsconfig.json` |
| Tipos e políticas de cancelamento ficam em `ferramentas`, e não em `anuncios` | A tela de detalhes da ferramenta também usa as políticas. Se ficassem em `anuncios`, as duas features iam importar uma da outra | `anuncios` depende de `ferramentas` |
| Tirar `db.sqlite3`, `media/` e `__pycache__` do Git | São arquivos gerados. O banco é binário e dava conflito sempre que duas pessoas mexiam | Cada pessoa precisa rodar `python manage.py migrate` para criar o banco. As categorias padrão são criadas pela migration `0005` |
| `SECRET_KEY` e `DEBUG` no arquivo `backend/.env`, lido com `python-dotenv` | Credencial não deve ficar no GitHub | Uma dependência a mais. Quem clonar precisa copiar o `.env.example` |

## O que foi deixado como estava e por quê

- **As telas grandes não foram quebradas em partes menores.** A `HomeScreen.tsx` e a `FerramentaDetalhesScreen.tsx` têm mais de 900 linhas cada. Quebrar elas mudaria muita coisa de uma vez e aumentaria a chance de conflito com o trabalho das outras pessoas.
- **Os filtros da aba Explorar continuam dentro da `HomeScreen`.** Eles poderiam virar uma função em `domain/`, mas isso fica para quando a tela for dividida.
- **Os estilos repetidos (cores, espaçamentos) continuam em cada tela.** Os tokens de tema são tarefa da Pessoa 2.
- **As validações dos formulários continuam nas telas.** Os validadores são tarefa da Pessoa 3. Os testes deles devem entrar na pasta `tests/`, com nome terminado em `.test.mjs`, que o `npm test` já roda.
- **Os componentes com nome em inglês (`PriceForm`, `AdDetailsForm`) não foram renomeados.** Renomear só trocaria nomes, sem melhorar o código.
- **O backend não ganhou autenticação por token.** A rota de usuários continua pública e o login não devolve token. Isso é a tarefa opcional da Aula 14.
- **O `ALLOWED_HOSTS` do Django continua com um IP fixo da rede local.** Ele é usado para testar no celular. Se o IP mudar, é preciso editar o `settings.py`.
- **O Pillow não entrou no `requirements.txt`.** O modelo `Foto` usa `FileField`, que não precisa do Pillow. Se um dia virar `ImageField`, é só adicionar.
- **A chave antiga do Django ainda aparece no histórico do Git.** Ela era só de desenvolvimento, mas cada pessoa deve gerar uma chave nova no seu `.env`.
