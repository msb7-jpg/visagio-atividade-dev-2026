# Checklist e Plano de Execução em Vertical Slices (plano-execucao.md)

> **Documento Vivo de Rastreabilidade e Execução**  
> **Fontes da Verdade:**  
> - [Atividade de Dev.pdf](file:///home/miguelsb/workspace/visagio-atividade-dev-2026/Atividade%20de%20Dev.pdf) (Especificação oficial dos requisitos funcionais do projeto)  
> - [ARQUITETURA.md](file:///home/miguelsb/workspace/visagio-atividade-dev-2026/ARQUITETURA.md) (Padrão Vertical Slices, Linguagem Onipresente, desacoplamento UI Pura vs Orquestração)  
> - [DESIGN.md](file:///home/miguelsb/workspace/visagio-atividade-dev-2026/DESIGN.md) (Design System, paleta de cores, tipografia Geist, referências visuais)  
> - [DESIGN-IMPLEMENTATION.md](file:///home/miguelsb/workspace/visagio-atividade-dev-2026/DESIGN-IMPLEMENTATION.md) (Especificação de telas, microinterações e componentes)  
> - [requisitos-nao-funcionais.md](file:///home/miguelsb/workspace/visagio-atividade-dev-2026/requisitos-nao-funcionais.md) (Padrões técnicos, tooling, linters, testes e performance)  

---

## ⚠️ Instruções Obrigatórias para Agentes Autônomos de Código

1. **Protocolo de Atualização Contínua do Checklist:**
   - **Antes de iniciar qualquer subetapa:** Atualize a subetapa correspondente para o status `[>]` (Em Progresso) ou mencione explicitamente no checklist.
   - **Ao concluir qualquer subetapa:**
     - Marque a caixa de seleção com `[x]`.
     - Adicione a data/timestamp e um breve resumo do que foi entregue, com os links dos arquivos criados ou modificados.
     - Execute a suíte de testes correspondente (Pytest no backend, Vitest/ESLint no frontend) para certificar integridade.
   - **Nunca pule validações de testes:** Uma fatia vertical só é considerada `[x]` concluída quando backend, frontend (se aplicável), contratos e testes automatizados passarem com sucesso.
2. **Uso de Referências Diretas:**
   - Este plano referencia diretamente as seções dos documentos de especificação. **Não é necessário carregar os documentos inteiros no contexto**: consulte apenas as seções e números de linha indicados em cada etapa.
3. **Respeito à Linguagem Onipresente:**
   - Utilize rigorosamente a tabela oficial de equivalência definida em [ARQUITETURA.md (Seção 1.2)](file:///home/miguelsb/workspace/visagio-atividade-dev-2026/ARQUITETURA.md#L20-L46). Ex: `titulo`, `url_poster`, `url_backdrop`, `nota_media_usuarios`, `comentario`, `nome`.

---

## Legenda de Status
- `[ ]` Não iniciado
- `[>]` Em execução / Em progresso
- `[x]` Concluído e verificado com testes
- `[-]` Bloqueado / Pendência identificada

---

## Resumo do Progresso Geral

| Etapa / Slice | Backend | Frontend | Testes & Qualidade | Status Geral |
| :--- | :---: | :---: | :---: | :---: |
| **Etapa 0: Fundação & Infraestrutura Base** | `[x]` | `[x]` | `[x]` | `[x]` Concluído |
| **Etapa 1: Ingestão de Dados & Camada Analítica** | `[x]` | N/A | `[x]` | `[x]` Concluído |
| **Etapa 2: Slice Vertical de Autenticação Admin** | `[ ]` | `[ ]` | `[ ]` | `[ ]` |
| **Etapa 3: Slice Vertical de Catálogo & Busca** | `[ ]` | `[ ]` | `[ ]` | `[ ]` |
| **Etapa 4: Slice Vertical de Ficha Técnica & Analytics** | `[ ]` | `[ ]` | `[ ]` | `[ ]` |
| **Etapa 5: Slice Vertical de Avaliações & Resenhas** | `[ ]` | `[ ]` | `[ ]` | `[ ]` |
| **Etapa 6: Slice Vertical de Gestão de Filmes (CRUD)** | `[ ]` | `[ ]` | `[ ]` | `[ ]` |
| **Etapa 7: Slice de Command Palette (Spotlight ⌘K)** | `[ ]` | `[ ]` | `[ ]` | `[ ]` |
| **Etapa 8: Documentação, Storybook & Validação E2E** | `[ ]` | `[ ]` | `[ ]` | `[ ]` |

---

## Detalhamento das Etapas e Checklist de Execução

---

### Etapa 0: Fundação, Tooling e Arquitetura Base
> **Objetivo:** Estabelecer a infraestrutura de código, dependências, padronização de linters e testes tanto no backend quanto no frontend.  
> **Referências:**  
> - [requisitos-nao-funcionais.md (Seções 2, 4.1 e 4.2)](file:///home/miguelsb/workspace/visagio-atividade-dev-2026/requisitos-nao-funcionais.md#L20-L36)  
> - [ARQUITETURA.md (Seções 1 e 2)](file:///home/miguelsb/workspace/visagio-atividade-dev-2026/ARQUITETURA.md#L81-L119)  
> - [DESIGN.md (Seção 3 - Paleta e Tokens Semânticos)](file:///home/miguelsb/workspace/visagio-atividade-dev-2026/DESIGN.md#L49-L87)

- [x] **0.1 Backend Core Setup** *(Concluído em 2026-09-24)*
  - [x] Verificar e instalar dependências backend via `uv` (`fastapi`, `uvicorn`, `sqlalchemy>=2.0`, `aiosqlite`, `alembic`, `pydantic-settings`, `python-jose`, `passlib[argon2]`, `httpx`, `pytest`, `pytest-asyncio`).
  - [x] Estruturar pastas base: `backend/app/core/`, `backend/app/db/`, `backend/app/shared/` (`dependencies.py`, `pagination.py`, `exceptions.py`) conforme [ARQUITETURA.md (Seção 3.1)](file:///home/miguelsb/workspace/visagio-atividade-dev-2026/ARQUITETURA.md#L128-L141).
  - [x] Configurar conexão assíncrona SQLite (`sqlite+aiosqlite:///./rocketlab.db`) e middleware de CORS para liberar `http://localhost:5173`.
  - [x] **Critério de Aceite / Teste:** `uv run pytest` executa e passa com 3 testes assíncronos.
- [x] **0.2 Frontend Tooling & Design System Setup** *(Concluído em 2026-09-24)*
  - [x] Instalar pacotes de produção: `bun add zod @tanstack/zod-form-adapter clsx tailwind-merge class-variance-authority lucide-react cmdk framer-motion simplex-noise axios`.
  - [x] Configurar tokens semânticos CSS em `frontend/src/index.css` conforme paleta escura cinematográfica de [DESIGN.md (Seção 3)](file:///home/miguelsb/workspace/visagio-atividade-dev-2026/DESIGN.md#L53-L86).
  - [x] Configurar clientes globais em `frontend/src/lib/`:
    - `api-client.ts` (instância Axios com base URL `/api/v1` e interceptor JWT).
    - `query-client.ts` (`staleTime: 5min`, `gcTime: 15min`).
    - `utils.ts` (função `cn()`).
  - [x] Criar componentes de feedback compartilhado em `frontend/src/components/feedback/`:
    - `RequiredFieldBadge.tsx` (asterisco com tooltip dark baseado em Aceternity `Tooltip` de `@aceternity/tooltip-card-demo` conforme [DESIGN.md 5.2](file:///home/miguelsb/workspace/visagio-atividade-dev-2026/DESIGN.md#L129-L137)).
    - `LoadingSkeleton.tsx` e `EmptyState.tsx`.
  - [x] **Critério de Aceite / Teste:** `bun run lint` e `bun run test` passam sem erros.

---

### Etapa 1: Ingestão de Dados & Camada Analítica (Seed Data)
> **Objetivo:** Garantir que o banco relacional SQLite seja inicializado e alimentado com os dados da camada analítica (Diamond Layer) fornecidos nos arquivos CSV.  
> **Referências:**  
> - [Atividade de Dev.pdf (Materiais e Dados Iniciais)](file:///home/miguelsb/workspace/visagio-atividade-dev-2026/Atividade%20de%20Dev.pdf)  
> - [requisitos-nao-funcionais.md (RNF13)](file:///home/miguelsb/workspace/visagio-atividade-dev-2026/requisitos-nao-funcionais.md#L113-L117)  
> - Arquivos CSV em `data/` (`dim_movies.csv`, `dim_genres.csv`, `bridge_*`, `fact_movies_performance.csv`, `movies_reviews.csv`).

- [x] **1.1 Migrações e Esquema de Banco** *(Concluído em 2026-09-24)*
  - [x] Aplicar migrações Alembic existentes em `backend/migrations/` (`0001_initial_movie_schema.py`) gerando as 10 tabelas relacionais no SQLite.
  - [x] Validar compatibilidade dos modelos ORM em `backend/app/movies/models.py`.
- [x] **1.2 Script de Ingestão Automatizado (Seed Database)** *(Concluído em 2026-09-24)*
  - [x] Criar script `backend/scripts/seed_database.py` para processar e importar os CSVs de `data/` em lote atômico com tratamento de nulos e parsing de datas.
  - [x] Preservar as URLs completas de `url_poster` e `url_backdrop` nativas de `dim_movies.csv` ([ARQUITETURA.md 1.3](file:///home/miguelsb/workspace/visagio-atividade-dev-2026/ARQUITETURA.md#L49-L60)).
  - [x] Carregar a tabela consolidada de médias `dim_reviews` e avaliações individuais de `movies_reviews.csv`.
  - [x] **Critério de Aceite / Teste:** Executar `uv run python scripts/seed_database.py` e verificar contagem consistente: `dim_movies` (95.645), `fact_movies_performance` (95.645), `dim_people` (424.656), `bridge_movie_person` (745.450), `dim_companies` (45.941), `bridge_movie_company` (116.326), `dim_genres` (19), `bridge_movie_genre` (121.521), `dim_reviews` (26.604), `movie_reviews` (43.666). Ingestão completa realizada em ~30 segundos com sucesso.

---

### Etapa 2: Slice Vertical de Autenticação Admin
> **Objetivo:** Permitir autenticação administrativa com JWT, persistência de sessão e proteção de rotas/ações restritas.  
> **Referências:**  
> - [Atividade de Dev.pdf (Perfil Administrador)](file:///home/miguelsb/workspace/visagio-atividade-dev-2026/Atividade%20de%20Dev.pdf)  
> - [ARQUITETURA.md (Seções 3.1 `auth` e 4.1 `auth`)](file:///home/miguelsb/workspace/visagio-atividade-dev-2026/ARQUITETURA.md#L142-L146)  
> - [DESIGN-IMPLEMENTATION.md (Seção 2.2 Tela de Login)](file:///home/miguelsb/workspace/visagio-atividade-dev-2026/DESIGN-IMPLEMENTATION.md#L95-L113)  
> - [DESIGN.md (Seção 5.2 Required Fields)](file:///home/miguelsb/workspace/visagio-atividade-dev-2026/DESIGN.md#L129-L137)

- [ ] **2.1 Backend: Auth Slice (`backend/app/features/auth/`)**
  - [ ] `schemas.py`: `LoginRequest`, `TokenResponse`, `AdminUserDTO`.
  - [ ] `service.py`: Verificação de credenciais de admin configuradas em `core/config.py` e geração de JWT.
  - [ ] `router.py`: `POST /api/v1/auth/login` e `GET /api/v1/auth/me`.
  - [ ] `dependencies.py`: Injeção de dependência FastAPI `get_current_admin` para proteção de rotas mutantes.
  - [ ] **Testes Backend:** `backend/tests/test_auth.py` (login com credenciais válidas, senha errada e validação de token).
- [ ] **2.2 Frontend: Auth Slice (`frontend/src/features/auth/`)**
  - [ ] `api/authApi.ts`: Chamada HTTP para login.
  - [ ] `schemas/auth.schema.ts`: Schema Zod para formulário de login (email e senha obrigatórios) e tipo `JwtPayload`.
  - [ ] `utils/token.ts`: Utilitário baseado em `jwt-decode` para inspeção segura de claims (`sub`, `role`, `exp`), cálculo proativo de expiração (`isTokenExpired`) com margem de segurança.
  - [ ] `hooks/useAuth.ts`: Gerenciamento de token no `localStorage` / React Context com checagem síncrona de expiração e estado `isAuthenticated`.
  - [ ] `hooks/useLoginForm.ts`: Integração do TanStack Form com Zod.
  - [ ] `components/subcomponents/TextFlipHeader.tsx`: Efeito visual Aceternity `layout-text-flip` alternando gêneros  (Action, Adventure, Animation, Comedy, Crime, Documentary, Drama, Family, Fantasy, History, Horror, Music, Mystery,  Romance, Science Fiction, Thriller, Tv Movie, War ,Western).
  - [ ] `components/LoginCardView.tsx`: Cartão Glassmorphic visual puro com indicadores de campos obrigatórios (`RequiredFieldBadge`).
  - [ ] `components/LoginContainer.tsx`: Orquestrador de estado e redirecionamento.
  - [ ] Configurar rotas `/login` e guard `ProtectedRoute` em `frontend/src/routes/` com validação de expiração via `jwt-decode`.
  - [ ] **Testes Frontend:** `frontend/src/features/auth/__tests__/LoginCard.test.tsx` e `token.test.ts` (renderização, decodificação e validação de token expirado).

---

### Etapa 3: Slice Vertical de Catálogo, Busca e Filtros
> **Objetivo:** Implementar a visualização do catálogo paginado de filmes, barra de busca com debounce, filtros por gênero, ordenação multicritério e toggle Grid/List.  
> **Referências:**  
> - [Atividade de Dev.pdf (Requisitos de Catálogo, Paginação e Busca)](file:///home/miguelsb/workspace/visagio-atividade-dev-2026/Atividade%20de%20Dev.pdf)  
> - [ARQUITETURA.md (Seções 3.1 `movies`/`metadata` e 4.1 `catalog`)](file:///home/miguelsb/workspace/visagio-atividade-dev-2026/ARQUITETURA.md#L147-L167)  
> - [DESIGN-IMPLEMENTATION.md (Seção 2.1 Tela Principal)](file:///home/miguelsb/workspace/visagio-atividade-dev-2026/DESIGN-IMPLEMENTATION.md#L39-L93)  
> - [DESIGN.md (Seção 5.3 Toggle Grid/List)](file:///home/miguelsb/workspace/visagio-atividade-dev-2026/DESIGN.md#L138-L145)  
> - Referência visual: `references/sort-by-block-and-list.png`.

- [ ] **3.1 Backend: Movies & Metadata Slices (`backend/app/features/movies/` & `metadata/`)**
  - [ ] `schemas.py`: `MovieListItemDTO`, `PaginationParams`, `PaginatedResponse[MovieListItemDTO]`, `GenreDTO`.
  - [ ] `repository.py`: Queries SQLAlchemy assíncronas com filtros dinâmicos (busca por título/diretor via `ilike`, filtro por gênero, ordenações por `popularidade`, `nota_media_usuarios`, `receita_usd`, `ano_lancamento`, `titulo`).
  - [ ] `router.py`:
    - `GET /api/v1/movies` (paginado com filtros).
    - `GET /api/v1/genres` (lista de gêneros disponíveis).
    - `GET /api/v1/companies` (estúdios para filtro rápido).
  - [ ] **Testes Backend:** `backend/tests/test_movies_catalog.py` (paginação, filtro por texto e gênero, ordenação decrescente).
- [ ] **3.2 Frontend: Catalog Slice (`frontend/src/features/catalog/`)**
  - [ ] `api/catalogApi.ts`: Endpoints de listagem de filmes, gêneros e estúdios.
  - [ ] `hooks/useCatalogParams.ts`: Sincronização estrita de `page`, `q`, `genre`, `sort`, `view` com a URL (`useSearchParams`).
  - [ ] `hooks/useMoviesQuery.ts`: TanStack Query com `placeholderData: keepPreviousData` e prefetch.
  - [ ] `components/CatalogHeroView.tsx`: Hero section com Aceternity `WavyBackground` e barra de busca de impacto.
  - [ ] `components/CatalogControlBar.tsx`: Barra de filtros, select de ordenação e alternador **Grid/List** (estilo cápsula conforme `sort-by-block-and-list.png`).
  - [ ] `components/MovieGridItemView.tsx`: Card de pôster com `aspect-[2/3]`, efeito `CardSpotlight`, badge de nota e popularidade.
  - [ ] `components/MovieListItemView.tsx`: Linha densa de catálogo com mini pôster, elenco, bilheteria e nota.
  - [ ] `components/CatalogPaginationView.tsx`: Paginação com botões Anterior/Próximo e páginas ativas.
  - [ ] `components/CatalogContainer.tsx`: Orquestrador da rota `/`.
  - [ ] **Testes Frontend:** `frontend/src/features/catalog/__tests__/CatalogView.test.tsx` (alternância Grid/List, disparo de filtros e sincronização na URL).

---

### Etapa 4: Slice Vertical de Ficha Técnica & Métricas Analíticas
> **Objetivo:** Exibir a página de detalhes completos do filme, elenco, sinopse, comparação de notas (Usuários vs TMDb vs IMDb) e métricas financeiras da camada analítica.  
> **Referências:**  
> - [Atividade de Dev.pdf (Detalhes do Filme e Informações Completas)](file:///home/miguelsb/workspace/visagio-atividade-dev-2026/Atividade%20de%20Dev.pdf)  
> - [ARQUITETURA.md (Seção 3.1 `analytics` e 4.1 `movie-details`)](file:///home/miguelsb/workspace/visagio-atividade-dev-2026/ARQUITETURA.md#L153-L157)  
> - [DESIGN-IMPLEMENTATION.md (Seção 2.3 Tela de Detalhes)](file:///home/miguelsb/workspace/visagio-atividade-dev-2026/DESIGN-IMPLEMENTATION.md#L115-L144)  
> - [DESIGN.md (Seção 3 - Paleta Funcional de Dados Analíticos)](file:///home/miguelsb/workspace/visagio-atividade-dev-2026/DESIGN.md#L88-L102)

- [ ] **4.1 Backend: Movie Details & Analytics Slices (`backend/app/features/movies/` & `analytics/`)**
  - [ ] `schemas.py`: `MovieDetailDTO` consolidando dados da obra, elenco/direção (`DimPerson`), produtoras (`DimCompany`), performance (`FactMoviePerformance`) e score de avaliações (`DimReview`).
  - [ ] `router.py`: `GET /api/v1/movies/{id}`.
  - [ ] `analytics/router.py`: `GET /api/v1/analytics/trending` e `GET /api/v1/analytics/box-office` para seções curadas.
  - [ ] **Testes Backend:** `backend/tests/test_movie_details.py` (retorno de filme por ID, 404 em ID inexistente, integridade de elenco e métricas).
- [ ] **4.2 Frontend: Movie Details Slice (`frontend/src/features/movie-details/`)**
  - [ ] `api/movieDetailsApi.ts`: Requisição de detalhes e ações administrativas.
  - [ ] `hooks/useMovieDetailsQuery.ts`: TanStack Query para rota `/filmes/:id`.
  - [ ] `components/MovieBackdropHeroView.tsx`: Banner superior com backdrop desfocado e transição de gradiente fade.
  - [ ] `components/MovieInfoCardView.tsx`: Pôster ampliado, título, duração formatada ("2h 49m"), status e sinopse.
  - [ ] `components/CastAndCrewSectionView.tsx`: Chips de Diretor, Roteirista e Atores com avatares e Aceternity `TooltipCard`.
  - [ ] `components/ScoreComparisonView.tsx`: Painel com Nota Média de Usuários (estrelas), Nota TMDb e IMDb.
  - [ ] `components/FinancialMetricsView.tsx`: Cards de Orçamento, Bilheteria e Lucro/ROI em verde esmeralda ou alerta de prejuízo.
  - [ ] `components/MovieDetailsContainer.tsx`: Orquestrador da rota `/filmes/:id`.
  - [ ] **Testes Frontend:** `frontend/src/features/movie-details/__tests__/MovieDetails.test.tsx` (exibição de ficha técnica e métricas financeiras).

---

### Etapa 5: Slice Vertical de Avaliações & Resenhas (Reviews)
> **Objetivo:** Permitir aos usuários adicionar avaliações (nota 0 a 10 e comentário em texto), recalcular atomicamente a média geral do filme e exibir o histórico com cards expansíveis fluidos.  
> **Referências:**  
> - [Atividade de Dev.pdf (Adicionar avaliação com nota e resenha, ver média geral e histórico)](file:///home/miguelsb/workspace/visagio-atividade-dev-2026/Atividade%20de%20Dev.pdf)  
> - [ARQUITETURA.md (Seção 3.1 `reviews` e 4.1 `reviews` e 5 - Clean Component Pattern)](file:///home/miguelsb/workspace/visagio-atividade-dev-2026/ARQUITETURA.md#L158-L162)  
> - [DESIGN-IMPLEMENTATION.md (Seção 2.3 - Histórico de Avaliações)](file:///home/miguelsb/workspace/visagio-atividade-dev-2026/DESIGN-IMPLEMENTATION.md#L146-L153)  
> - Aceternity `expandable-card` e TanStack Form com indicadores obrigatórios.

- [ ] **5.1 Backend: Reviews Slice (`backend/app/features/reviews/`)**
  - [ ] `schemas.py`: `CreateReviewDTO` (`nome`, `nota`: 0 a 10, `comentario`: 10 a 4000 caracteres), `ReviewResponseDTO`, `ReviewSummaryDTO`.
  - [ ] `service.py`: Inserção atômica em `movies_reviews` e recálculo transacional de `dim_reviews` (`nota_media_usuarios`, `qtd_avaliacoes_usuarios`).
  - [ ] `router.py`:
    - `GET /api/v1/movies/{id}/reviews` (histórico de avaliações ordenado por data).
    - `POST /api/v1/movies/{id}/reviews` (submissão de nova resenha).
  - [ ] **Testes Backend:** `backend/tests/test_reviews.py` (criação de review, validação de limites de nota, recálculo matemático correto da média e histórico ordenado).
- [ ] **5.2 Frontend: Reviews Slice (`frontend/src/features/reviews/`)**
  - [ ] `api/reviewsApi.ts`: Funções `fetchMovieReviews` e `submitReview`.
  - [ ] `schemas/review.schema.ts`: Schema Zod espelhando os contratos de negócio.
  - [ ] `hooks/useReviewForm.ts`: TanStack Form + `zodFormAdapter` com reset após sucesso.
  - [ ] `hooks/useReviewsQuery.ts` & `useSubmitReviewMutation.ts`: Invalidação de cache de queries do filme e detalhes ao submeter resenha.
  - [ ] `components/ReviewRatingStarsView.tsx`: Seletor interativo de estrelas com feedback de nota em tempo real.
  - [ ] `components/NewReviewModalView.tsx`: Modal com formulário tipado e indicadores visuais de obrigatoriedade (`RequiredFieldBadge`).
  - [ ] `components/ReviewExpandableCardView.tsx`: Aceternity `ExpandableCard` com Framer Motion (`layoutId`) para abrir e ler resenhas completas sem reload.
  - [ ] `components/ReviewsContainer.tsx`: Integração da seção de avaliações na tela de detalhes.
  - [ ] **Testes Frontend:** `frontend/src/features/reviews/__tests__/ReviewSubmission.test.tsx` (validação de formulário, abertura do modal e mutação com sucesso via MSW).

---

### Etapa 6: Slice Vertical de Gestão de Filmes (CRUD Admin)
> **Objetivo:** Permitir ao Administrador autenticado cadastrar novos filmes (com campos obrigatórios, seleção de gêneros, preview de pôster), atualizar informações de filmes existentes e remover filmes com diálogo de confirmação.  
> **Referências:**  
> - [Atividade de Dev.pdf (Cadastrar filmes, remover e atualizar filmes individualmente)](file:///home/miguelsb/workspace/visagio-atividade-dev-2026/Atividade%20de%20Dev.pdf)  
> - [ARQUITETURA.md (Seção 3.1 `movies` e 4.1 `movie-admin`)](file:///home/miguelsb/workspace/visagio-atividade-dev-2026/ARQUITETURA.md#L298-L312)  
> - [DESIGN-IMPLEMENTATION.md (Seção 2.4 Telas de Cadastro e Edição)](file:///home/miguelsb/workspace/visagio-atividade-dev-2026/DESIGN-IMPLEMENTATION.md#L155-L188)  
> - [DESIGN.md (Seção 5.2 Required Fields)](file:///home/miguelsb/workspace/visagio-atividade-dev-2026/DESIGN.md#L129-L137)  

- [ ] **6.1 Backend: Movie Mutation Endpoints (`backend/app/features/movies/`)**
  - [ ] `schemas.py`: `MovieCreateDTO` e `MovieUpdateDTO` com validação de campos obrigatórios (`titulo`, `sinopse`, `ano_lancamento`, `duracao_minutos`, `generos_ids`).
  - [ ] `service.py`: Operações transacionais de `create_movie`, `update_movie` e `delete_movie` com limpeza segura de tabelas de associação (bridges) e deleção em cascata. Protegido pela dependência `get_current_admin`.
  - [ ] `router.py`:
    - `POST /api/v1/movies` (criação).
    - `PUT /api/v1/movies/{id}` (atualização).
    - `DELETE /api/v1/movies/{id}` (exclusão).
  - [ ] **Testes Backend:** `backend/tests/test_movie_crud.py` (criação bem-sucedida, bloqueio 401 sem token admin, atualização e exclusão com cascata).
- [ ] **6.2 Frontend: Movie Admin Slice (`frontend/src/features/movie-admin/`)**
  - [ ] `api/movieAdminApi.ts`: Chamadas autenticadas `createMovie`, `updateMovie`, `deleteMovie`.
  - [ ] `schemas/movie-form.schema.ts`: Schema Zod do formulário com validações de limites de ano (1888 a 2030), duração e textos.
  - [ ] `hooks/useMovieAdminForm.ts`: TanStack Form com preenchimento em modo edição e reset em modo criação.
  - [ ] `components/PosterPreviewCard.tsx`: Preview dinâmico do pôster com suporte a fallback visual em caso de erro na URL digitada.
  - [ ] `components/MovieFormView.tsx`: Formulário completo com seletor de gêneros, textarea para sinopse e indicadores de campos obrigatórios (`RequiredFieldBadge`).
  - [ ] `components/MovieCreateContainer.tsx` (rota `/admin/filmes/novo`) & `components/MovieEditContainer.tsx` (rota `/admin/filmes/:id/editar`).
  - [ ] `components/DeleteMovieConfirmDialog.tsx`: Dialog do shadcn com aviso destrutivo para exclusão de filme.
  - [ ] **Testes Frontend:** `frontend/src/features/movie-admin/__tests__/MovieForm.test.tsx` (validação de erros em campos vazios obrigatórios e submit com dados válidos).

---

### Etapa 7: Slice de Command Palette (Spotlight ⌘K)
> **Objetivo:** Proporcionar busca global instantânea ativada por teclado (`Cmd+K` / `Ctrl+K`), com backdrop blur cinematográfico intenso, feedback de navegação e atalhos rápidos de catálogo e administração.  
> **Referências:**  
> - [requisitos-nao-funcionais.md (RNF06)](file:///home/miguelsb/workspace/visagio-atividade-dev-2026/requisitos-nao-funcionais.md#L73-L78)  
> - [DESIGN.md (Seção 5.4 Command Palette Global)](file:///home/miguelsb/workspace/visagio-atividade-dev-2026/DESIGN.md#L146-L168)  
> - [ARQUITETURA.md (Seção 4.1 `command-palette`)](file:///home/miguelsb/workspace/visagio-atividade-dev-2026/ARQUITETURA.md#L313-L325)  
> - [plan.md (Requisitos de Command Palette)](file:///home/miguelsb/workspace/visagio-atividade-dev-2026/plan.md#L20-L24)

- [ ] **7.1 Backend: Quick Search Endpoint (`backend/app/features/movies/`)**
  - [ ] Endpoint leve `GET /api/v1/movies/quick-search?q=...` retornando títulos, anos, pôsteres e notas (limite de 10 resultados para resposta em < 50ms).
  - [ ] **Testes Backend:** `backend/tests/test_quick_search.py` (busca rápida e tolerância a termos curtos).
- [ ] **7.2 Frontend: Command Palette Slice (`frontend/src/features/command-palette/`)**
  - [ ] `hooks/useCommandPalette.ts`: Listener de teclado para capturar `Cmd+K` ou `Ctrl+K` em qualquer lugar da tela.
  - [ ] `hooks/useSpotlightSearch.ts`: Busca assíncrona debounced (300ms) conectada ao TanStack Query.
  - [ ] `components/CommandPaletteDialogView.tsx`: Baseado em shadcn `Command` + `cmdk`, com `DialogOverlay` apresentando **backdrop blur intenso** (`backdrop-blur-xl bg-black/70`) e animações suaves de entrada e saída.
  - [ ] `components/CommandResultsGroupView.tsx`: Grupos de resultados (Filmes Encontrados, Gêneros Rápidos, Ações Administrativas como "Cadastrar Novo Filme").
  - [ ] Integrar `CommandPaletteContainer` globalmente em `frontend/src/components/layout/AppLayout.tsx`.
  - [ ] **Testes Frontend:** `frontend/src/features/command-palette/__tests__/CommandPalette.test.tsx` (abertura ao pressionar tecla de atalho, renderização de resultados e navegação para rota do filme selecionado).

---

### Etapa 8: Documentação, Storybook, Auditoria de Código e Validação E2E
> **Objetivo:** Consolidar a documentação do projeto com Storybook, validar a qualidade do código com ESLint/TSDoc e produzir o README com guia de execução passo a passo exigido pelo PDF de especificação.  
> **Referências:**  
> - [Atividade de Dev.pdf (README com passo a passo)](file:///home/miguelsb/workspace/visagio-atividade-dev-2026/Atividade%20de%20Dev.pdf)  
> - [requisitos-nao-funcionais.md (RNF07, RNF08, RNF10)](file:///home/miguelsb/workspace/visagio-atividade-dev-2026/requisitos-nao-funcionais.md#L79-L102)  
> - [ARQUITETURA.md (Seção 6)](file:///home/miguelsb/workspace/visagio-atividade-dev-2026/ARQUITETURA.md)

- [ ] **8.1 Storybook 8 Setup & Stories de Componentes**
  - [ ] Configurar Storybook 8 no frontend integrado ao Vite e Tailwind v4.
  - [ ] Criar stories para componentes atômicos essenciais:
    - `Button.stories.tsx` (variantes default, outline, destructive, ghost).
    - `RequiredFieldBadge.stories.tsx` (comportamento de tooltip).
    - `MovieGridItemView.stories.tsx` (card com poster e badges).
    - `ReviewExpandableCardView.stories.tsx` (comportamento de expansão).
- [ ] **8.2 Auditoria de Qualidade & Linters**
  - [ ] Rodar ESLint 9+ (`bun run lint`) e corrigir quaisquer violações de tipagem estrita, `@shadcn/lint` e TSDoc.
  - [ ] Verificar regras de imports absolutos `@/*` em todo o código frontend.
  - [ ] Backend: Rodar `ruff check` ou validações de tipagem Python.
- [ ] **8.3 README.md Final & Guia de Execução**
  - [ ] Atualizar o [README.md](file:///home/miguelsb/workspace/visagio-atividade-dev-2026/README.md) com:
    - Pré-requisitos (Python 3.11+, Bun, SQLite).
    - Como rodar as migrações e o script de seed (`python backend/scripts/seed_database.py`).
    - Como inicializar o backend FastAPI (`uv run uvicorn app.main:app --reload`).
    - Como inicializar o frontend Vite (`bun run dev`).
    - Como rodar a suíte completa de testes (`uv run pytest` e `bun run test`).
    - Como abrir o Storybook (`bun run storybook`).

---

## Registro de Atualizações do Checklist (Histórico de Execução)

| Timestamp | Subetapa | Ação Realizada | Responsável | Status Resultante |
| :--- | :--- | :--- | :--- | :---: |
| 2026-09-24 01:10 | Criação | Criação do plano inicial em fatias verticais | Antigravity | `[x]` Plano Estruturado |
