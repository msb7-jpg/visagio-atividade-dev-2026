# Checklist e Plano de Execução em Vertical Slices (plano-execucao.md)

> **Documento Vivo de Rastreabilidade e Execução**  
> **Fontes da Verdade:**  
> - [Atividade de Dev.pdf](file:///home/miguelsb/workspace/visagio-atividade-dev-2026/atividade-dev.md) (Especificação oficial dos requisitos funcionais do projeto)  
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
   - **Validação de Qualidade Obrigatória pós-etapa:** Após alterações em qualquer etapa ou subetapa, execute impreterivelmente:
     1. `bun run lint` (no diretório `frontend/`) e garanta 0 erros.
     2. `bun run build` (no diretório `frontend/`) para validação estrita de compilação TypeScript (`tsc -b`) e bundling de produção com Vite.
     3. `bun fallow health --coverage coverage/coverage-final.json` (no diretório `frontend/`) e certifique-se de que não haja breaches de complexidade ou saúde de código.
     4. A suíte de testes (`pytest` no backend e `bun run test` no frontend).
   - **Nunca pule validações de testes e qualidade:** Uma fatia vertical só é considerada `[x]` concluída quando backend, frontend (se aplicável), contratos, testes automatizados, build (`bun run build`), linters (`bun run lint`) e métricas de saúde (`bun fallow health`) passarem com 100% de sucesso.
2. **Uso de Referências Diretas:**
   - Este plano referencia diretamente as seções dos documentos de especificação. **Não é necessário carregar os documentos inteiros no contexto**: consulte apenas as seções e números de linha indicados em cada etapa.
3. **Respeito à Linguagem Onipresente:**
   - Utilize rigorosamente a tabela oficial de equivalência definida em [ARQUITETURA.md (Seção 1.2)](file:///home/miguelsb/workspace/visagio-atividade-dev-2026/ARQUITETURA.md#L20-L46). Ex: `titulo`, `url_poster`, `url_backdrop`, `nota_media_usuarios`, `comentario`, `nome`.

4. **Diretriz de Resolução Efetiva de Código (Sem Supressões Indevidas):**
   - **É terminantemente proibido suprimir alertas, lints ou complexidade** com comentários de escape (como `// fallow-ignore`, `/* eslint-disable */` ou `@ts-ignore`) sem que seja um caso extremo e explicitamente autorizado.
   - **Regra da Resolução Arquitetural:**
     - Se o Fast Refresh ou linter acusar problema de exportação compartilhada (`react-refresh/only-export-components`), **separe em arquivos dedicados** (ex: contexto em `context/`, componentes em `components/`, hooks em `hooks/`, helpers em `utils/`).
     - Se uma função for acusada de complexidade excessiva pelo `fallow` ou linter, **refatore-a e extraia submódulos/funções puras** com responsabilidade única.
     - Se houver risco CRAP apontado pelo fallow por baixa cobertura de função crítica, **adicione testes unitários dedicados** para cobrir os fluxos lógicos e estabilizar a métrica.
     - O caminho padrão deve ser **SEMPRE** projetar a solução e refatorar o código, nunca mascarar o sintoma.

5. **Diretriz de Co-localização de Testes & Importações:**
   - As pastas de testes `__tests__/` devem ficar **sempre o mais próximo possível** dos arquivos que estão testando:
     - Componentes em `components/__tests__/`
     - Hooks em `hooks/__tests__/`
     - Utilitários/helpers em `utils/__tests__/`
     - Chamadas de API em `api/__tests__/`
     - Componentes UI compartilhados em `components/ui/__tests__/`
   - **Permissão de Imports Relativos em Testes:** Arquivos de teste têm permissão no ESLint para usar importações relativas (`../`) referenciando os módulos adjacentes imediatos, mantendo os testes acoplados ao seu subdomínio sem caminhos desnecessariamente longos.
   - Não crie testes para tudo indiscriminadamente: preserve e use os testes existentes focados nas regras e fluxos centrais.

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
| **Etapa 2: Slice Vertical de Autenticação Admin** | `[x]` | `[x]` | `[x]` | `[x]` Concluído |
| **Etapa 3: Slice Vertical de Catálogo, Busca & Command Palette Base** | `[x]` | `[x]` | `[x]` | `[x]` Concluído |
| **Etapa 4: Slice Vertical de Ficha Técnica & Analytics** | `[ ]` | `[ ]` | `[ ]` | `[ ]` |
| **Etapa 5: Slice Vertical de Avaliações & Resenhas** | `[ ]` | `[ ]` | `[ ]` | `[ ]` |
| **Etapa 6: Slice Vertical de Gestão de Filmes (CRUD)** | `[ ]` | `[ ]` | `[ ]` | `[ ]` |
| **Etapa 7: Enriquecimento da Command Palette & Ações Avançadas** | `[ ]` | `[ ]` | `[ ]` | `[ ]` |
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
  - [x] Verificar e instalar dependências backend via `uv` (`fastapi`, `uvicorn`, `sqlalchemy>=2.0`, `aiosqlite`, `alembic`, `pydantic-settings`, `pyjwt`, `pwdlib[argon2]`, `httpx`, `pytest`, `pytest-asyncio`).
  - [x] Estruturar pastas base: `backend/app/core/`, `backend/app/db/`, `backend/app/shared/` (`dependencies.py`, `pagination.py`, `exceptions.py`) conforme [ARQUITETURA.md (Seção 3.1)](file:///home/miguelsb/workspace/visagio-atividade-dev-2026/ARQUITETURA.md#L128-L141).
  - [x] Configurar conexão assíncrona SQLite (`sqlite+aiosqlite:///./rocketlab.db`) e middleware de CORS para liberar `http://localhost:5173`.
  - [x] **Critério de Aceite / Teste:** `uv run pytest` executa e passa com 3 testes assíncronos.
- [x] **0.2 Frontend Tooling & Design System Setup** *(Concluído em 2026-09-24, ampliado em 2026-09-25)*
  - [x] Instalar pacotes de produção: `bun add zod @tanstack/zod-form-adapter clsx tailwind-merge class-variance-authority lucide-react cmdk framer-motion simplex-noise axios @tanstack/react-form`.
  - [x] Configurar tokens semânticos CSS em `frontend/src/index.css` conforme paleta escura cinematográfica de [DESIGN.md (Seção 3)](file:///home/miguelsb/workspace/visagio-atividade-dev-2026/DESIGN.md#L53-L86).
  - [x] Configurar clientes globais em `frontend/src/lib/`:
    - `api-client.ts` (instância Axios com base URL `/api/v1` e interceptor JWT).
    - `query-client.ts` (`staleTime: 5min`, `gcTime: 15min`) com `MutationCache` global interceptando `mutation.meta?.invalidates` e `mutation.meta?.redirectOnSuccess`.
    - `navigation.ts` (navegador desacoplado para execução de redirects orquestrados por mutations).
    - `types/tanstack-query.d.ts` (extensão tipada de `Register.mutationMeta` com `redirectOnSuccess`, `replace`, `invalidates` e `successMessage`).
    - `utils.ts` (função `cn()`).
  - [x] Criar componentes de feedback compartilhado em `frontend/src/components/feedback/`:
    - `RequiredFieldBadge.tsx` (asterisco com tooltip dark baseado em Aceternity `Tooltip` de `@aceternity/tooltip-card-demo` conforme [DESIGN.md 5.2](file:///home/miguelsb/workspace/visagio-atividade-dev-2026/DESIGN.md#L129-L137)).
    - `LoadingSkeleton.tsx` e `EmptyState.tsx`.
  - [x] **Critério de Aceite / Teste:** `bun run lint` e `bun run test` passam sem erros.

---

### Etapa 1: Ingestão de Dados & Camada Analítica (Seed Data)
> **Objetivo:** Garantir que o banco relacional SQLite seja inicializado e alimentado com os dados da camada analítica (Diamond Layer) fornecidos nos arquivos CSV.  
> **Referências:**  
> - [Atividade de Dev.pdf (Materiais e Dados Iniciais)](file:///home/miguelsb/workspace/visagio-atividade-dev-2026/atividade-dev.md)  
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
> - [Atividade de Dev.pdf (Perfil Administrador)](file:///home/miguelsb/workspace/visagio-atividade-dev-2026/atividade-dev.md)  
> - [ARQUITETURA.md (Seções 3.1 `auth` e 4.1 `auth`)](file:///home/miguelsb/workspace/visagio-atividade-dev-2026/ARQUITETURA.md#L142-L146)  
> - [DESIGN-IMPLEMENTATION.md (Seção 2.2 Tela de Login)](file:///home/miguelsb/workspace/visagio-atividade-dev-2026/DESIGN-IMPLEMENTATION.md#L95-L113)  
> - [DESIGN.md (Seção 5.2 Required Fields)](file:///home/miguelsb/workspace/visagio-atividade-dev-2026/DESIGN.md#L129-L137)

- [x] **2.1 Backend: Auth Slice (`backend/app/features/auth/`)** *(Concluído em 2026-09-24)*
  - [x] `schemas.py`: `LoginRequest`, `TokenResponse`, `AdminUserDTO`.
  - [x] `service.py`: Verificação de credenciais de admin configuradas em `core/config.py` e geração de JWT.
  - [x] `router.py`: `POST /api/v1/auth/login` e `GET /api/v1/auth/me`.
  - [x] `dependencies.py`: Injeção de dependência FastAPI `get_current_admin` para proteção de rotas mutantes.
  - [x] **Testes Backend:** `backend/tests/test_auth.py` (6 testes assíncronos cobrindo geração, decodificação, sucesso no login, senha incorreta, e-mail inexistente, `/auth/me` e 401 não autenticado).
- [x] **2.2 Frontend: Auth Slice (`frontend/src/features/auth/`)** *(Concluído em 2026-09-24, ampliado com TanStack Query Mutations e TanStack Form em 2026-09-25)*
  - [x] `api/authApi.ts`: Chamada HTTP para login e `/auth/me`.
  - [x] `schemas/auth.schema.ts`: Schema Zod para formulário de login (email e senha obrigatórios) e tipo `JwtPayload`.
  - [x] `utils/token.ts`: Utilitário baseado em `jwt-decode` para inspeção segura de claims (`sub`, `role`, `exp`), cálculo proativo de expiração (`isTokenExpired`) com margem de segurança de 30s.
  - [x] `hooks/useAuth.tsx` & `context/AuthProvider.tsx`: Gerenciamento reativo de token no `localStorage` via `useSyncExternalStore` + TanStack Query `useMutation` para login e logout padronizado (com `queryClient.clear()` e `meta: { redirectOnSuccess: '/login' }`).
  - [x] `components/subcomponents/CinematicIllustrations.tsx`: SVGs temáticos de alta fidelidade estilizados estilo Storyset com animações do Framer Motion (claquete pulsante, projetor cinematográfico com feixe luminoso, e métricas analíticas de bilheteria).
  - [x] `components/ui/layout-text-flip.tsx`: Componente oficial Aceternity instalado via `bunx --bun shadcn@latest add @aceternity/layout-text-flip` alternando os gêneros com flip 3D e blur.
  - [x] `components/subcomponents/SyncVisualShowcase.tsx`: Container lateral direito inspirado em `references/login-signup.png` que utiliza diretamente o `@aceternity/layout-text-flip` para alternar palavras/gêneros e sincroniza atômica e fluidamente com as ilustrações SVG do Storyset e cards de métricas.
  - [x] `components/subcomponents/CinematicMultiStepLoader.tsx`: Loader sequencial estilo Aceternity Loader com mensagens progressivas e checkmarks ao autenticar.
  - [x] `components/LoginCardView.tsx`: Cartão Glassmorphic visual puro com indicadores de campos obrigatórios (`RequiredFieldBadge`), input com ícones, tratamento de erros e botão de preenchimento rápido para avaliação técnica.
  - [x] `components/LoginContainer.tsx`: Orquestrador de formulário com TanStack Form (`useForm` + `zodValidator`) integrado à mutação TanStack Query com `meta: { redirectOnSuccess: fromLocation }`.
  - [x] Configurar rotas `/login` e guard `ProtectedRoute` em `frontend/src/routes/` com validação de expiração via `jwt-decode`.
  - [x] **Testes Frontend:** `frontend/src/features/auth/__tests__/LoginCard.test.tsx` e `token.test.ts` (testes passando no Vitest).

---

### Etapa 3: Slice Vertical de Catálogo, Busca & Command Palette Base
> **Objetivo:** Implementar o catálogo paginado de filmes com filtros e busca in-page, a casca global de navegação (`AppLayout` com Navbar e trigger `⌘K`) e a base da **Command Palette global** (`cmdk` com backdrop blur intenso e busca rápida de filmes e atalhos), que será enriquecida continuamente nas fatias subsequentes.  
> **Referências:**  
> - [Atividade de Dev.pdf (Requisitos de Catálogo, Paginação e Busca)](file:///home/miguelsb/workspace/visagio-atividade-dev-2026/atividade-dev.md)  
> - [ARQUITETURA.md (Seções 3.1 `movies`/`metadata` e 4.1 `catalog`/`command-palette`)](file:///home/miguelsb/workspace/visagio-atividade-dev-2026/ARQUITETURA.md#L147-L167)  
> - [DESIGN-IMPLEMENTATION.md (Seção 2.1 Tela Principal)](file:///home/miguelsb/workspace/visagio-atividade-dev-2026/DESIGN-IMPLEMENTATION.md#L39-L93)  
> - [DESIGN.md (Seções 5.3 Toggle Grid/List e 5.4 Command Palette Global)](file:///home/miguelsb/workspace/visagio-atividade-dev-2026/DESIGN.md#L138-L168)  
> - [requisitos-nao-funcionais.md (RNF06 - Spotlight ⌘K)](file:///home/miguelsb/workspace/visagio-atividade-dev-2026/requisitos-nao-funcionais.md#L73-L78)  
> - Referência visual: `references/sort-by-block-and-list.png`.

- [x] **3.1 Backend: Movies, Metadata & Quick-Search (`backend/app/features/movies/` & `metadata/`)** *(Concluído em 2026-09-25)*
  - [x] `schemas.py`: `MovieListItemDTO`, `PaginationParams`, `PaginatedResponse[MovieListItemDTO]`, `GenreDTO`, `QuickSearchMovieDTO`.
  - [x] `repository.py`: Queries SQLAlchemy assíncronas com filtros dinâmicos (busca por título/diretor via `ilike`, filtro por gênero, ordenações por `popularidade`, `nota_media_usuarios`, `receita_usd`, `ano_lancamento`, `titulo`).
  - [x] `router.py`:
    - `GET /api/v1/movies` (paginado com filtros multicritério e ordenação).
    - `GET /api/v1/movies/quick-search?q=...` (busca ultrarrápida com limite de 8-10 itens para alimentar a Command Palette).
    - `GET /api/v1/genres` (lista consolidada de gêneros).
    - `GET /api/v1/companies` (estúdios para filtro rápido).
  - [x] **Testes Backend:** `backend/tests/test_movies_catalog.py` (15 testes passando no total, cobrindo paginação, filtros por termo/gênero, ordenação decrescente e busca ultrarrápida do quick-search).
- [x] **3.2 Frontend: Command Palette Base & AppLayout (`frontend/src/features/command-palette/` & `layout/`)** *(Concluído em 2026-09-25)*
  - [x] `api/spotlightApi.ts`: Endpoint `quickSearchMovies` para a busca rápida assíncrona.
  - [x] `hooks/useCommandPalette.ts`: Listener global de teclado (`Cmd+K` / `Ctrl+K`) e gerenciamento de estado de abertura/fechamento.
  - [x] `hooks/useSpotlightSearch.ts`: TanStack Query debounced (300ms) para sugestões em tempo real.
  - [x] `components/CommandPaletteDialogView.tsx`: Dialog baseado em `cmdk` com **backdrop blur cinematográfico intenso** (`backdrop-blur-2xl bg-black/90`), atalhos de navegação e busca integrada.
  - [x] `components/CommandResultsGroupView.tsx`: Grupos de resultados (Filmes encontrados com pôster e nota, Gêneros para filtrar e Ações do sistema).
  - [x] `components/layout/Navbar.tsx` & `AppLayout.tsx`: Header global responsivo com logo cinematográfico, indicador de autenticação e botão-gatilho visual *"Buscar filmes ou ⌘K"*.
  - [x] **Testes & Qualidade:** `CommandResultsGroup.test.tsx` passando no Vitest, 0 erros no ESLint e `bun fallow health` aprovado com 0 breaches.
- [x] **3.3 Frontend: Catalog Slice (`frontend/src/features/catalog/`)** *(Concluído em 2026-09-25)*
  - [x] `api/catalogApi.ts`: Integração com endpoints de listagem de filmes, gêneros e estúdios com testes unitários em `catalogApi.test.ts`.
  - [x] `hooks/useCatalogParams.ts`: Sincronização estrita de `page`, `q`, `genre`, `sort`, `view` com a URL (`useSearchParams`).
  - [x] `hooks/useMoviesQuery.ts`: TanStack Query com `placeholderData: keepPreviousData` e prefetch.
  - [x] `components/CatalogHeroView.tsx`: Hero section com Aceternity `WavyBackground`, título de impacto e barra de busca in-page com trigger para Command Palette.
  - [x] `components/CatalogControlBar.tsx`: Barra de filtros de gênero em estilo pílula, dropdown de ordenação via **shadcn `Select`** e alternador **Grid/List** via **shadcn `ToggleGroup`** (estilo cápsula conforme `sort-by-block-and-list.png`).
  - [x] `components/MovieGridItemView.tsx`: Card de pôster com `aspect-[2/3]`, efeito `CardSpotlight`, **shadcn `Badge`** para notas e popularidade.
  - [x] `components/MovieListItemView.tsx`: Linha densa de catálogo com mini pôster, elenco, bilheteria e **shadcn `Badge`** de avaliação com tokens semânticos.
  - [x] `components/CatalogPaginationView.tsx`: Paginação com botões Anterior/Próximo e páginas ativas com componentes puros (`PaginationItemButton`).
  - [x] `components/CatalogContainer.tsx`: Orquestrador da rota `/` decomposto em `MovieListView`, `MovieGridList`, `MovieRowList`, `MovieListStatus`, `SkeletonList` e ViewModel.
  - [x] **Testes & Qualidade:** Testes unitários para `CatalogControlBar`, `MovieItemViews`, `MovieListView`, `PaginationItemButton`, `useCatalogViewModel`, `list-status-helper` e `pagination-helper` (14 suítes, 37 testes passando, `bun fallow health` com 0 breaches, componentes oficiais shadcn `Select`, `ToggleGroup`, `Badge`, `Kbd`, `Separator` integrados e 0 advertências de cores brutas no linter).

---

### Etapa 4: Slice Vertical de Ficha Técnica & Métricas Analíticas
> **Objetivo:** Exibir a página de detalhes completos do filme, elenco, sinopse, comparação de notas (Usuários vs TMDb vs IMDb) e métricas financeiras da camada analítica.  
> **Referências:**  
> - [Atividade de Dev.pdf (Detalhes do Filme e Informações Completas)](file:///home/miguelsb/workspace/visagio-atividade-dev-2026/atividade-dev.md)  
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
> - [Atividade de Dev.pdf (Adicionar avaliação com nota e resenha, ver média geral e histórico)](file:///home/miguelsb/workspace/visagio-atividade-dev-2026/atividade-dev.md)  
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
  - [ ] `hooks/useReviewForm.ts`: TanStack Form (`useForm` + `zodValidator`) com reset pós-submissão.
  - [ ] `hooks/useReviewsQuery.ts` & `useSubmitReviewMutation.ts`: TanStack Query mutation com `meta: { invalidates: [['movies', id, 'reviews'], ['movies', id]], successMessage: 'Avaliação publicada com sucesso!' }` gerenciado no `MutationCache` global.
  - [ ] `components/ReviewRatingStarsView.tsx`: Seletor interativo de estrelas com feedback de nota em tempo real.
  - [ ] `components/NewReviewModalView.tsx`: Modal com formulário tipado e indicadores visuais de obrigatoriedade (`RequiredFieldBadge`).
  - [ ] `components/ReviewExpandableCardView.tsx`: Aceternity `ExpandableCard` com Framer Motion (`layoutId`) para abrir e ler resenhas completas sem reload.
  - [ ] `components/ReviewsContainer.tsx`: Integração da seção de avaliações na tela de detalhes.
  - [ ] **Testes Frontend:** `frontend/src/features/reviews/__tests__/ReviewSubmission.test.tsx` (validação de formulário, abertura do modal e mutação com sucesso via MSW).

---

### Etapa 6: Slice Vertical de Gestão de Filmes (CRUD Admin)
> **Objetivo:** Permitir ao Administrador autenticado cadastrar novos filmes (com campos obrigatórios, seleção de gêneros, preview de pôster), atualizar informações de filmes existentes e remover filmes com diálogo de confirmação, orquestrados por TanStack Form e TanStack Query mutations com redirects e invalidações declarativas via `mutationMeta`.  
> **Referências:**  
> - [Atividade de Dev.pdf (Cadastrar filmes, remover e atualizar filmes individualmente)](file:///home/miguelsb/workspace/visagio-atividade-dev-2026/atividade-dev.md)  
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
  - [ ] `hooks/useMovieAdminMutations.ts`: TanStack Query mutations (`createMovie`, `updateMovie`, `deleteMovie`) configuradas com `meta: { redirectOnSuccess: (data) => /filmes/${data.sk_movie_id}, invalidates: [['movies']] }`.
  - [ ] `components/PosterPreviewCard.tsx`: Preview dinâmico do pôster com suporte a fallback visual em caso de erro na URL digitada.
  - [ ] `components/MovieFormView.tsx`: Formulário completo com seletor de gêneros, textarea para sinopse e indicadores de campos obrigatórios (`RequiredFieldBadge`).
  - [ ] `components/MovieCreateContainer.tsx` (rota `/admin/filmes/novo`) & `components/MovieEditContainer.tsx` (rota `/admin/filmes/:id/editar`).
  - [ ] `components/DeleteMovieConfirmDialog.tsx`: Dialog do shadcn com aviso destrutivo para exclusão de filme.
  - [ ] **Testes Frontend:** `frontend/src/features/movie-admin/__tests__/MovieForm.test.tsx` (validação de erros em campos vazios obrigatórios e submit com dados válidos).

---

### Etapa 7: Enriquecimento da Command Palette & Ações Avançadas
> **Objetivo:** Expandir a Command Palette base com atalhos de navegação para métricas analíticas (campeões de bilheteria, tendências), filtros rápidos diretos, suporte a deep links e ações de administração contextuais (cadastrar novo filme, gerenciar resenhas).  
> **Referências:**  
> - [requisitos-nao-funcionais.md (RNF06)](file:///home/miguelsb/workspace/visagio-atividade-dev-2026/requisitos-nao-funcionais.md#L73-L78)  
> - [DESIGN.md (Seção 5.4 Command Palette Global)](file:///home/miguelsb/workspace/visagio-atividade-dev-2026/DESIGN.md#L146-L168)  
> - [ARQUITETURA.md (Seção 4.1 `command-palette`)](file:///home/miguelsb/workspace/visagio-atividade-dev-2026/ARQUITETURA.md#L313-L325)  

- [ ] **7.1 Frontend: Ações Contextuais e Integração com Roles Admin**
  - [ ] Adicionar grupo "Ações Administrativas" visível condicionalmente para administradores logados (atalhos diretos para `/admin/filmes/novo` e ação unificada de encerramento de sessão disparando mutação de logout).
  - [ ] Integrar atalhos analíticos (pular para os filmes com maior ROI ou maior bilheteria).
  - [ ] **Testes Frontend:** `frontend/src/features/command-palette/__tests__/CommandPaletteAdvanced.test.tsx` (exibição condicional de ações administrativas e execução de atalhos).

---

### Etapa 8: Documentação, Storybook, Auditoria de Código e Validação E2E
> **Objetivo:** Consolidar a documentação do projeto com Storybook, validar a qualidade do código com ESLint/TSDoc e produzir o README com guia de execução passo a passo exigido pelo PDF de especificação.  
> **Referências:**  
> - [Atividade de Dev.pdf (README com passo a passo)](file:///home/miguelsb/workspace/visagio-atividade-dev-2026/atividade-dev.md)  
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
| 2026-09-24 21:30 | Etapa 2 | Implementação completa da Slice de Autenticação Admin (Backend JWT + Frontend Login split com Storyset SVGs animados, textos rotativos e Aceternity MultiStepLoader) | Antigravity | `[x]` Concluído |
| 2026-09-24 22:05 | Etapa 2 | Migração da camada de autenticação para `pyjwt` e `pwdlib[argon2]` seguindo guia moderno do FastAPI | Antigravity | `[x]` Concluído |
