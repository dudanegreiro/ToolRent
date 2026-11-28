# Requisitos do ToolRent

## 1. Contexto e objetivo

O ToolRent é uma aplicação universal desenvolvida com Expo, React Native e React Native Web para conectar locadores de ferramentas a locatários. O sistema permite cadastrar ferramentas ociosas, publicar anúncios, pesquisar equipamentos disponíveis, solicitar períodos de aluguel, negociar condições e avaliar a transação.

O projeto segue o método de desenvolvimento webmobile da disciplina: aplicação universal, navegação endereçável, componentes reutilizáveis, tipagem TypeScript, estado controlado, consumo de API REST, persistência local quando apropriada, autenticação, testes, acessibilidade e documentação.

## 2. Perfis de usuário

### 2.1 Usuário visitante
Pessoa não autenticada que pode consultar ferramentas, categorias e informações públicas.

### 2.2 Locador
Usuário autenticado que publica, consulta, edita e exclui anúncios próprios e responde solicitações de aluguel.

### 2.3 Locatário
Usuário autenticado que busca ferramentas, solicita reservas, negocia condições, acompanha aluguéis e avalia locações concluídas.

### 2.4 Administrador
Pessoa responsável pela manutenção de dados e moderação, usando o Django Admin ou uma interface administrativa futura.

## 3. Premissas e escopo

- Ferramentas são cadastradas por usuários proprietários.
- Um locatário não deve visualizar seus próprios anúncios na lista de exploração.
- Anúncio contém dados técnicos, preço, período, condições, localização e fotos.
- Solicitação de aluguel depende de datas válidas e disponibilidade.
- Chat, negociação, avaliação e reservas fazem parte do escopo quando ainda não implementados.
- As operações sensíveis e de propriedade devem ser autorizadas no servidor.
- Persistência local não substitui a fonte remota de verdade.

## 4. Requisitos funcionais

| ID | Requisito |
|---|---|
| RF01 | Permitir cadastro de usuário com nome, e-mail, CPF, telefone e senha. |
| RF02 | Validar formato de e-mail, comprimento do nome, telefone, CPF e senha. |
| RF03 | Impedir cadastro com e-mail ou CPF já registrado. |
| RF04 | Permitir login por e-mail e senha. |
| RF05 | Permitir manutenção da sessão local do usuário autenticado. |
| RF06 | Permitir logout e limpeza da sessão local. |
| RF07 | Permitir consulta e edição de nome e telefone do perfil. |
| RF08 | Permitir alteração segura da senha. |
| RF09 | Disponibilizar recuperação de senha por fluxo seguro. |
| RF10 | Diferenciar visualmente locador e locatário em ações e telas autorizadas. |
| RF11 | Permitir cadastro de categorias administráveis e mostrar categorias padrão. |
| RF12 | Permitir publicar anúncio com categoria, título, marca, modelo, estado, descrição e itens inclusos. |
| RF13 | Permitir associar até seis fotos ao anúncio e escolher a primeira foto como capa. |
| RF14 | Permitir configurar diária, estimativa semanal, período mínimo, caução, cancelamento e entrega. |
| RF15 | Permitir informar endereço, bairro, cidade, latitude e longitude e opção de entrega. |
| RF16 | Permitir revisar todos os dados antes da publicação. |
| RF17 | Permitir listar anúncios próprios do usuário. |
| RF18 | Permitir editar dados e disponibilidade dos anúncios próprios. |
| RF19 | Permitir excluir anúncios próprios mediante confirmação. |
| RF20 | Permitir explorar ferramentas de outros usuários. |
| RF21 | Permitir busca por texto em nome, marca e modelo. |
| RF22 | Permitir filtrar por categoria, preço mínimo, preço máximo e disponibilidade. |
| RF23 | Permitir filtrar por localização. |
| RF24 | Permitir ordenar resultados por preço ou outros critérios compatíveis. |
| RF25 | Permitir abrir detalhes públicos de uma ferramenta. |
| RF26 | Permitir solicitar aluguel informando início, fim e valor calculado. |
| RF27 | Calcular o valor total conforme diária, duração, preço semanal e regras comerciais aplicáveis. |
| RF28 | Impedir aluguel com período inferior ao mínimo da ferramenta. |
| RF29 | Impedir conflito de datas com reservas existentes. |
| RF30 | Permitir ao proprietário aprovar ou recusar uma solicitação. |
| RF31 | Permitir ao locatário cancelar uma solicitação antes da confirmação. |
| RF32 | Permitir concluir ou cancelar um aluguel segundo seu estado atual. |
| RF33 | Separar aluguéis solicitados e aluguéis recebidos no painel do usuário. |
| RF34 | Permitir negociação de valor vinculada ao aluguel. |
| RF35 | Permitir troca de mensagens entre locador e locatário em uma conversa vinculada. |
| RF36 | Permitir avaliação de 1 a 5 e comentário após aluguel concluído. |
| RF37 | Permitir uma única avaliação por aluguel e por avaliador autorizado. |
| RF38 | Permitir consulta de avaliações recebidas e média da ferramenta ou usuário. |
| RF39 | Permitir relatório ou histórico básico dos anúncios e aluguéis do usuário. |
| RF40 | Permitir administração dos dados do domínio por usuário autorizado. |

## 5. Requisitos não funcionais

| ID | Requisito |
|---|---|
| RNF01 | A aplicação deve ser universal: compartilhar código e funcionar em Android, iOS e web. |
| RNF02 | Interface deve seguir React Native, Expo Router, componentes tipados e `StyleSheet.create`. |
| RNF03 | Layout deve usar Flexbox, área segura, teclado adaptável e responsividade sem overflow. |
| RNF04 | Toda tela deve possuir hierarquia, estados visuais, feedback de carregamento, vazio, erro e sucesso. |
| RNF05 | Contraste de texto normal deve atender pelo menos 4,5:1 e texto grande pelo menos 3:1. |
| RNF06 | Alvos interativos devem ter pelo menos 44 pontos no iOS e 48 dp no Android. |
| RNF07 | Componentes interativos devem informar papel, rótulo e estado de acessibilidade. |
| RNF08 | Campos devem possuir rótulos visíveis, associação acessível, dica e mensagem de erro acionável. |
| RNF09 | Navegação deve usar rotas endereçáveis, layouts comuns e links declarativos sempre que possível. |
| RNF10 | Navegação imperativa deve ser usada para ações pós-evento, como login e publicação. |
| RNF11 | Estado local deve ficar no componente; estado compartilhado deve ser elevado ao menor ancestral comum. |
| RNF12 | Contextos/hooks não devem conter regras de domínio ou detalhes HTTP misturados. |
| RNF13 | Componentes, hooks, domínio, serviços e tipos devem obedecer a organização por funcionalidade. |
| RNF14 | Dependências entre camadas devem seguir apresentação → domínio/serviços, domínio/serviços → tipos. |
| RNF15 | Dados externos devem ser validados em `unknown`; `any` não deve ser usado nas fronteiras da aplicação. |
| RNF16 | Contratos HTTP devem distinguir `GET`, `POST`, `PATCH`, `PUT` e `DELETE` conforme semântica e idempotência. |
| RNF17 | Chamadas HTTP devem separar rede, interpretação da resposta e validação do contrato. |
| RNF18 | Endereços da API devem vir de `EXPO_PUBLIC_API_URL`; segredos não podem ser enviados ao cliente. |
| RNF19 | Comunicação externa de produção deve usar HTTPS. |
| RNF20 | Senhas devem ser armazenadas somente como hash seguro e nunca em texto puro no banco ou repositório. |
| RNF21 | Sessões devem ser protegidas por token e servidor; o cliente não substitui autorização. |
| RNF22 | Operações de criação, edição, exclusão e negociação devem exigir proprietário ou participante autorizado. |
| RNF23 | Persistência local deve distinguir estado de interface, cache remoto e preferências persistentes. |
| RNF24 | Cache remoto deve ter chave por consulta, prazo de validade e revalidação após escrita. |
| RNF25 | Uso sem conexão deve informar a última leitura e impedir escritas quando não puder confirmá-las. |
| RNF26 | Upload de mídia deve validar permissão, tipo, tamanho e retorno de falha sem perder o formulário. |
| RNF27 | Segurança deve incluir proteção contra acesso indevido, validação de dados e tratamento seguro de erros. |
| RNF28 | O código deve ter lint, formatação, tipagem, testes e integrações automatizadas por Pull Request. |
| RNF29 | Testes devem cobrir domínio puro, API, componentes críticos, estados de interface e arquitetura. |
| RNF30 | O sistema deve documentar problema, arquitetura, contratos, decisões, execução, entrega e retrospectiva.

## 6. Regras de negócio

### Usuários e autenticação
- RN1. E-mail e CPF são únicos.
- RN2. Senha possui mínimo definido pela validação e é salva com hash.
- RN3. Login rejeita e-mail ou senha inválidos sem revelar qual deles existe.
- RN4. A sessão encerra-se por logout, expiração ou `401`.
- RN5. Usuário somente altera seu próprio perfil e dados autorizados.

### Categorias e ferramentas
- RN6. Categoria é obrigatória no anúncio.
- RN7. Nome, marca, modelo, estado, descrição e diária são obrigatórios.
- RN8. Diária deve ser maior que zero.
- RN9. Valor semanal não pode ser negativo.
- RN10. Período mínimo deve ser maior ou igual a um dia.
- RN11. Anúncio possui até seis fotos, com pelo menos uma imagem válida.
- RN12. Ferramenta excluída remove ou desassocia os dados dependentes conforme integridade referencial.
- RN13. Somente o proprietário edita ou exclui o anúncio.
- RN14. Disponibilidade pode ser alterada pelo proprietário.

### Localização e busca
- RN15. Endereço, bairro e cidade são obrigatórios para publicação.
- RN16. Entrega é opcional e deve ser registrada no anúncio.
- RN17. Busca textual ignora diferenças de maiúsculas/minúsculas.
- RN18. Faixa mínima não pode superar a faixa máxima.
- RN19. Filtros por categoria, preço e disponibilidade podem ser combinados.

### Aluguel
- RN20. Datas têm início anterior ou igual ao fim.
- RN21. Duração mínima é definida pelo anúncio.
- RN22. O valor total usa o preço acordado e a quantidade de dias.
- RN23. Ferramentas indisponíveis ou com datas conflitantes não podem ser reservadas.
- RN24. Locador e locatário não podem ser a mesma pessoa.
- RN25. Somente locador responsável aprova ou recusa.
- RN26. O aluguel segue uma máquina de estados: solicitado, aprovado, recusado, concluído ou cancelado.
- RN27. Cancelamento e conclusão só são permitidos em estados compatíveis.
- RN28. Uma transição concluída libera o uso futuro da ferramenta conforme calendário vigente.

### Negociação e avaliação
- RN29. Somente participantes do aluguel podem enviar mensagens ou propostas.
- RN30. Mensagens são registradas com remetente, destinatário e instante.
- RN31. Avaliação só ocorre após conclusão.
- RN32. Nota deve estar entre 1 e 5.
- RN33. Existe no máximo uma avaliação por participante por aluguel quando permitido pelo contrato.

## 7. Regras de qualidade e entrega

- O MVP navegável deve possuir fluxo completo com dados locais.
- A integração real deve possuir contrato, leitura, escrita, estados de interface, cache e Pull Requests revisados.
- A entrega final deve demonstrar fluxo principal, build ou prévia executável, documentação e retrospectiva.
- Todo defeito prioritário deve ter evidência executável antes do encerramento.

