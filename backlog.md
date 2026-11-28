# Backlog do ToolRent

## Organização da entrega

O backlog segue a trilha da disciplina: planejamento e descoberta, MVP navegável, integração com API real e entrega final. Cada épico é dividido em histórias pequenas e deve produzir uma entrega revisável por Pull Request.

## Responsabilidades

- `@dudanegreiro`: tema, design system, molduras/layout, componentes visuais, acessibilidade, contraste e responsividade.
- `@ZezinG14`: repositório, backend, contratos, banco, regras de domínio, serviços, segurança, testes e documentação.
- `@Hatilancaio`: navegação, estado compartilhado, formulários, validação, hooks, rotas e integração dos fluxos.

## EP01 — Descoberta, arquitetura e ambiente

### US01 — Configurar repositório e processo colaborativo
Como equipe, queremos convenções de branches, commits e Pull Requests para integrar trabalho com revisão.

### US02 — Configurar ambiente Expo universal
Como equipe, queremos executar frontend em web, Android e iOS para validar o aplicativo em todas as plataformas.

### US03 — Definir arquitetura por funcionalidades
Como equipe, queremos separar apresentação, domínio, serviços e tipos para facilitar manutenção e testes.

### US04 — Modelar dados e API inicial
Como equipe, queremos definir entidades, relações, contratos e migrações para implementar os recursos.

### US05 — Preparar tema e componentes visuais base
Como equipe, queremos um design system mínimo para manter consistência e acessibilidade.

## EP02 — Autenticação e conta

### US06 — Criar conta
Como visitante, quero criar uma conta para publicar ou solicitar ferramentas.

### US07 — Entrar no aplicativo
Como usuário, quero autenticar-me para acessar recursos protegidos.

### US08 — Manter sessão
Como usuário, quero continuar autenticado conforme a validade da sessão.

### US09 — Sair da conta
Como usuário, quero encerrar a sessão e proteger meus dados locais.

### US10 — Editar perfil
Como usuário, quero atualizar nome e telefone.

### US11 — Alterar senha
Como usuário, quero alterar minha senha com validação segura.

### US12 — Recuperar senha
Como visitante, quero recuperar o acesso por um fluxo seguro.

## EP03 — Exploração e anúncios

### US13 — Navegar pelos recursos
Como usuário, quero navegar pelas principais áreas por endereços estáveis.

### US14 — Consultar categorias
Como usuário, quero selecionar uma categoria para publicar ou filtrar ferramentas.

### US15 — Explorar ferramentas
Como locatário, quero ver ferramentas disponíveis de outros usuários.

### US16 — Buscar ferramentas
Como locatário, quero pesquisar por nome, marca ou modelo.

### US17 — Filtrar ferramentas
Como locatário, quero combinar categoria, preço e disponibilidade.

### US18 — Filtrar por localização
Como locatário, quero encontrar ferramentas próximas ou em determinada cidade.

### US19 — Abrir detalhes
Como locatário, quero ver fotos, descrição, preços, condições e localização.

### US20 — Publicar anúncio
Como locador, quero cadastrar uma ferramenta em etapas completas.

### US21 — Enviar fotos
Como locador, quero enviar fotos e definir a capa do anúncio.

### US22 — Definir preço e condições
Como locador, quero configurar diária, período mínimo, caução e cancelamento.

### US23 — Informar localização
Como locador, quero informar onde a ferramenta pode ser retirada ou entregue.

### US24 — Revisar anúncio
Como locador, quero confirmar os dados antes da publicação.

### US25 — Gerenciar anúncios próprios
Como locador, quero listar, editar e excluir minhas ferramentas.

## EP04 — Solicitação e reserva

### US26 — Solicitar aluguel
Como locatário, quero escolher datas e solicitar uma reserva.

### US27 — Calcular preço
Como usuário, quero conhecer o valor estimado antes de confirmar.

### US28 — Validar disponibilidade
Como sistema, quero impedir períodos inválidos ou conflitantes.

### US29 — Aprovar solicitação
Como locador, quero aceitar ou recusar pedidos recebidos.

### US30 — Cancelar solicitação
Como locatário, quero cancelar antes da confirmação.

### US31 — Concluir aluguel
Como locador ou locatário autorizado, quero concluir uma reserva entregue e validada.

### US32 — Consultar painel de aluguéis
Como usuário, quero acompanhar solicitações feitas e recebidas.

## EP05 — Negociação, contato e avaliação

### US33 — Negociar valor
Como locador ou locatário, quero trocar propostas relacionadas ao aluguel.

### US34 — Conversar com o participante
Como usuário, quero enviar mensagens ao outro participante.

### US35 — Avaliar aluguel
Como participante autorizado, quero avaliar uma locação concluída.

### US36 — Consultar avaliações
Como usuário, quero ver média e comentários relevantes.

## EP06 — Qualidade não funcional

### US37 — Garantir tipagem e contratos
Como equipe, queremos tipos de domínio e validação de respostas de API.

### US38 — Tratar estados assíncronos
Como usuário, quero ver carregamento, vazio, falha, tentativa e sucesso.

### US39 — Garantir acessibilidade
Como usuário com tecnologia assistiva, quero navegar e preencher formulários com rótulos e feedback claros.

### US40 — Garantir responsividade
Como usuário de diferentes telas, quero usar o aplicativo sem cortes ou overflow.

### US41 — Garantir segurança
Como usuário, quero que dados sensíveis e ações sejam protegidos no cliente e no servidor.

### US42 — Garantir uso offline básico
Como usuário, quero consultar o último conteúdo disponível e receber avisos claros sobre escritas.

## EP07 — Testes, revisão e entrega

### US43 — Testar domínio e arquitetura
Como equipe, queremos testes puros para regras e dependências entre camadas.

### US44 — Testar API e persistência
Como equipe, queremos testes para endpoints, banco e casos de falha.

### US45 — Testar componentes e formulários
Como equipe, queremos testes essenciais de validação e interação.

### US46 — Executar revisão acessível e responsiva
Como equipe, queremos um checklist executável de usabilidade e plataformas.

### US47 — Automatizar qualidade no CI
Como equipe, queremos lint, tipagem e testes em Pull Requests e pushes.

### US48 — Documentar entrega
Como equipe, queremos README, arquitetura, API, execução e decisão final atualizados.

### US49 — Demonstrar e versionar
Como equipe, queremos uma prévia demonstrável e um registro de entrega.

### US50 — Conduzir retrospectiva
Como equipe, queremos evidências do que funcionou e melhorias futuras.

