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
     1. `bun run lint` (no diretório `frontend/`) e garanta **0 erros e 0 warnings**.
     2. `bun run build` (no diretório `frontend/`) para validação estrita de compilação TypeScript (`tsc -b`) e bundling de produção com Vite.
     3. `bun fallow health --coverage coverage/coverage-final.json` (no diretório `frontend/`) e certifique-se de que não haja breaches de complexidade ou saúde de código.
     4. A suíte de testes (`pytest` no backend e `bun run test` no frontend).
   - **Nunca pule validações de testes e qualidade:** Uma fatia vertical só é considerada `[x]` concluída quando backend, frontend (se aplicável), contratos, testes automatizados, build (`bun run build`), linters (`bun run lint` com **0 erros e 0 warnings**) e métricas de saúde (`bun fallow health`) passarem com 100% de sucesso.
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
| **Etapa 4: Slice Vertical de Ficha Técnica & Analytics** | `[x]` | `[x]` | `[x]` | `[x]` Concluído |
| **Etapa 5: Slice Vertical de Avaliações & Resenhas** | `[x]` | `[x]` | `[x]` | `[x]` Concluído |
| **Etapa 6: Slice Vertical de Gestão de Filmes (CRUD)** | `[x]` | `[x]` | `[x]` | `[x]` Concluído |
| **Etapa 7: Slice Vertical de Favoritos, Watchlist & Biblioteca** | `[x]` | `[x]` | `[x]` | `[x]` Concluído |
| **Etapa 8: Enriquecimento da Command Palette & Ações Avançadas** | `[x]` | `[x]` | `[x]` | `[x]` Concluído |
| **Etapa 9: Documentação, Auditoria e Entrega Final** | `[x]` | `[x]` | `[x]` | `[x]` Concluído |

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

- [x] **4.1 Backend: Movie Details & Analytics Slices (`backend/app/features/movies/`)** *(Concluído em 2026-09-25)*
  - [x] `schemas.py`: `MovieDetailDTO` consolidando dados da obra, elenco e direção (`PersonSummaryDTO`), produtoras (`CompanyDTO`), performance e notas analíticas (`FinancialMetricsDTO`) com cálculo de ROI e score de avaliações.
  - [x] `repository.py`: Consulta assíncrona otimizada `get_movie_by_id` com `selectinload` de todas as dimensões (`genres`, `companies`, `people`, `performance`, `reviews_summary`).
  - [x] `router.py`: Endpoint `GET /api/v1/movies/{id}` com tratamento de 404.
  - [x] **Testes Backend:** `backend/tests/test_movie_details.py` (3 testes passando com fixture de seed e teardown com cleanup, totalizando 21 testes no backend).
- [x] **4.2 Frontend: Movie Details Slice (`frontend/src/features/movie-details/`)** *(Concluído em 2026-09-25)*
  - [x] `api/movieDetailsApi.ts`: Requisição de detalhes com Axios absoluto.
  - [x] `hooks/useMovieDetailsQuery.ts` & `useMovieDetailsViewModel.ts`: TanStack Query desacoplado e ViewModel de navegação/estado.
  - [x] `components/MovieBackdropHeroView.tsx`: Banner superior com backdrop cinematográfico desfocado e máscara fade-to-black na base.
  - [x] `components/MovieHeaderInfoView.tsx`: Pôster com proporção 2:3, iluminação sutil, badges de gênero em estilo glass capsule e duração formatada ("2h 49m").
  - [x] `components/ScoreComparisonView.tsx`: Painel comparativo de scores (RocketFilms com estrelas e contagem de resenhas, TMDb Score oficial e IMDb Rating global).
  - [x] `components/FinancialMetricsView.tsx`: Cards em Glassmorphism de Orçamento, Bilheteria (USD/BRL formatados), Lucro e ROI com badge semântica esmeralda/coral e termômetro de popularidade.
  - [x] `components/CastAndCrewSectionView.tsx`: Categorização e chips estilizados de Direção, Roteiro, Produtoras e Elenco Principal.
  - [x] `components/MovieSynopsisView.tsx` & `MovieDetailsSkeleton.tsx` & `MovieDetailsErrorState.tsx`: Exibição fluida, skeletons responsivos e empty states.
  - [x] `components/MovieDetailsContainer.tsx`: Orquestrador integrado à rota `/filmes/:id` e links nos cards e Spotlight/Command Palette.
  - [x] **4.3 Frontend: Refinamento de UX/UI & Redesign Editorial da Ficha Técnica** *(Concluído em 2026-09-25)*
  - [x] `DESIGN.md` e `DESIGN-IMPLEMENTATION.md`: Documentação atualizada com princípios anti-cardite, contenção de cores em dark mode e tipografia editorial.
  - [x] `index.css`: Dessaturação de tokens analíticos (`--profit`, `--trending`) evitando halos neon.
  - [x] `ScoreComparisonView.tsx`: Refatoração de 3 cards retangulares para faixa compacta de chips horizontais.
  - [x] `FinancialMetricsView.tsx`: Eliminação de caixas fechadas; criação de faixa de KPIs tipográficos contínuos.
  - [x] `MovieHeaderInfoView.tsx`: Composição integrada em 2 colunas no Hero, eliminando o espaço vazio e abrigando metadados, scores e KPIs.
  - [x] `CastAndCrewSectionView.tsx`: Substituição de tag soup de badges por formato de lista editorial com vírgulas.
  - [x] `MovieSynopsisView.tsx` & `MovieDetailsContainer.tsx`: Alinhamento de largura ergonômica (`max-w-3xl`) e orquestração integrada.
  - [x] **Testes & Qualidade:** Atualização dos testes unitários, validação estrita com `bun run lint` (0 erros), `bun run test` (82 testes passando), `bun fallow health` (0 breaches) e `bun run build`.
  
---

### Etapa 5: Slice Vertical de Avaliações & Resenhas (Reviews)
> **Objetivo:** Permitir aos usuários adicionar avaliações (nota 0 a 10 e comentário em texto), recalcular atomicamente a média geral do filme e exibir o histórico com cards expansíveis fluidos.  
> **Referências:**  
> - [Atividade de Dev.pdf (Adicionar avaliação com nota e resenha, ver média geral e histórico)](file:///home/miguelsb/workspace/visagio-atividade-dev-2026/atividade-dev.md)  
> - [ARQUITETURA.md (Seção 3.1 `reviews` e 4.1 `reviews` e 5 - Clean Component Pattern)](file:///home/miguelsb/workspace/visagio-atividade-dev-2026/ARQUITETURA.md#L158-L162)  
> - [DESIGN-IMPLEMENTATION.md (Seção 2.3 - Histórico de Avaliações)](file:///home/miguelsb/workspace/visagio-atividade-dev-2026/DESIGN-IMPLEMENTATION.md#L146-L153)  
> - Aceternity `expandable-card` e TanStack Form com indicadores obrigatórios.

- [x] **5.1 Backend: Reviews Slice (`backend/app/features/reviews/`)** *(Concluído em 2026-09-26)*
  - [x] `schemas.py`: `ReviewCreateDTO` (`nome`, `nota`: 1 a 10, `comentario`: 10 a 4000 caracteres), `ReviewResponseDTO`, `ReviewSummaryDTO`.
  - [x] `service.py`: Inserção atômica em `movie_reviews` (com resolução dinâmica de ID numérico ou string `sk_movie_id`) e recálculo transacional de `dim_reviews` (`nota_media_usuarios`, `qtd_avaliacoes_usuarios`).
  - [x] `docs.py` & `router.py`:
    - `GET /api/v1/movies/{movie_id}/reviews` (histórico de avaliações ordenado por data e ID decrescentes).
    - `POST /api/v1/movies/{movie_id}/reviews` (submissão de nova resenha com documentação OpenAPI).
  - [x] **Testes Backend:** `backend/tests/test_reviews.py` (3 testes passando com fixture de seed e recálculo transacional, totalizando 24 testes no backend).
- [x] **5.2 Frontend: Reviews Slice (`frontend/src/features/reviews/`)** *(Concluído em 2026-09-26)*
  - [x] `api/reviewsApi.ts`: Funções `fetchMovieReviews` e `submitMovieReview`.
  - [x] `schemas/review.schema.ts`: Schema Zod espelhando os contratos de negócio (`nome`, `nota`, `comentario`).
  - [x] `types/reviews.types.ts`: Tipagens TypeScript estritas para `MovieReviewDTO` e `CreateReviewDTO`.
  - [x] `hooks/useMovieReviews.ts`: TanStack Query hooks com `meta.invalidates` declarativo invalidando as queries do filme e de avaliações.
  - [x] `button.tsx`: Variantes `rating`, `rating-active`, `rating-selected` e size `rating-score` para preservar integridade de `@shadcn/lint`.
  - [x] `components/ReviewRatingSelectorView.tsx`: Seletor interativo de nota 1 a 10 com feedback de humor animado (Meh, Frown, Smile, Sparkles).
  - [x] `components/NewReviewModalView.tsx`: Modal shadcn Dialog com TanStack Form, `RequiredFieldBadge` e mensagens de validação Zod.
  - [x] `components/ReviewExpandableCardView.tsx`: Aceternity `ExpandableCard` com Framer Motion (`layoutId`) para expansão e leitura de resenhas longas.
  - [x] `components/ReviewsSectionContainer.tsx`: Orquestrador com cabeçalho analítico, botão "Escrever Avaliação", grid responsivo de resenhas e estados de loading/empty.
  - [x] `components/MovieDetailsContainer.tsx`: Integração da seção de avaliações na tela de detalhes.
  - [x] **Testes & Qualidade:** `ReviewsSection.test.tsx` e `MovieDetailsContainer.test.tsx` passando; 89 testes passando no frontend, 0 erros no ESLint/shadcn-lint, e build de produção validado com sucesso.

---

### Etapa 6: Slice Vertical de Gestão de Filmes (CRUD Admin)
> **Objetivo:** Permitir ao Administrador autenticado cadastrar novos filmes (com campos obrigatórios, seleção de gêneros, preview de pôster em tempo real), atualizar informações de filmes existentes e remover filmes com diálogo de confirmação, orquestrados por TanStack Form e TanStack Query mutations com redirects e invalidações declarativas via `mutationMeta`.  
> **Referências:**  
> - [Atividade de Dev.pdf (Cadastrar filmes, remover e atualizar filmes individualmente)](file:///home/miguelsb/workspace/visagio-atividade-dev-2026/atividade-dev.md)  
> - [ARQUITETURA.md (Seção 3.1 `movies` e 4.1 `movie-admin`)](file:///home/miguelsb/workspace/visagio-atividade-dev-2026/ARQUITETURA.md#L298-L312)  
> - [DESIGN-IMPLEMENTATION.md (Seção 2.4 Telas de Cadastro e Edição)](file:///home/miguelsb/workspace/visagio-atividade-dev-2026/DESIGN-IMPLEMENTATION.md#L155-L188)  
> - [DESIGN.md (Seção 5.2 Required Fields)](file:///home/miguelsb/workspace/visagio-atividade-dev-2026/DESIGN.md#L129-L137)  
> - `fix-reviews/fix-reviews.md` (Diretrizes de design anti-cardite, espaçamento orgânico e contenção de contraste).

#### 🎨 Diretrizes de Design & Usabilidade da Etapa (Inspiradas em `fix-reviews/`):
- **O que NÃO fazer:**
  - NÃO criar um formulário burocrático e confuso com inputs empilhados em caixa única sem respiro, parecendo ERP corporativo.
  - NÃO utilizar contrastes agressivos, bordas duras amarelas/laranjas grossas ou halos neon ("arcade/cyberpunk").
  - NÃO colocar caixas dentro de caixas com bordas pesadas (cardite).
  - NÃO esconder o preview de pôster ou exibir imagens quebradas sem fallback visual gracioso.
  - NÃO utilizar `window.confirm()` nativo nem botões de exclusão sem diálogo de confirmação seguro.
- **O que FAZER:**
  - Layout editorial assimétrico em 2 colunas: formulário amplo e espaçado à esquerda (`max-w-2xl`) + **Live Dynamic Poster Preview** 2:3 à direita.
  - Paleta em ardósia profunda (`slate-950`/`zinc-900`) e foco em âmbar fosco suave (`border-primary/40`).
  - Seleção de múltiplos gêneros elegante via chips/badges interativos em cápsula (com toggle de seleção visual).
  - `RequiredFieldBadge` discreto com tooltip dark.
  - Diálogo de confirmação de exclusão seguro e estético (`DeleteMovieConfirmDialog`).
  - Atalhos contextuais no catálogo: opções *Editar* e *Excluir* no `MovieQuickActionsMenu` (hover e botão direito) exclusivas para admin.
  - Acesso direto na Navbar: botão "Novo Filme" / "Cadastrar Filme" para administradores autenticados.
  - Comando na Command Palette: "Cadastrar Novo Filme" visível para admins.

- [x] **6.1 Backend: Movie Mutation Endpoints (`backend/app/features/movies/`)** *(Concluído em 2026-09-26)*
  - [x] `schemas/mutations.py`: `MovieCreateDTO` e `MovieUpdateDTO` com validação de campos obrigatórios (`titulo`, `sinopse`, `ano_lancamento`, `duracao_minutos`, `generos_ids`, `diretor`).
  - [x] `service.py`: Operações transacionais de `create_movie`, `update_movie` e `delete_movie` com limpeza segura de tabelas de associação (`bridge_movie_genre`, `bridge_movie_company`, `bridge_movie_person`) e deleção em cascata (`fact_movies_performance`, `dim_reviews`, `movie_reviews`).
  - [x] `router.py`:
    - `POST /api/v1/movies` (criação protegida por `get_current_admin`).
    - `PUT /api/v1/movies/{id}` (atualização protegida por `get_current_admin`).
    - `DELETE /api/v1/movies/{id}` (exclusão protegida por `get_current_admin`).
  - [x] **Testes Backend:** `backend/tests/test_movie_crud.py` (criação bem-sucedida, bloqueio 401 sem token admin, atualização e exclusão com verificação de integridade referencial - 4 testes assíncronos, totalizando 30 testes no backend).

- [x] **6.2 Frontend: Movie Admin Slice (`frontend/src/features/movie-admin/`)** *(Concluído em 2026-09-26)*
  - [x] `api/movieAdminApi.ts`: Chamadas autenticadas `createMovie`, `updateMovie`, `deleteMovie`.
  - [x] `schemas/movie-form.schema.ts`: Schema Zod do formulário com validações de limites de ano (1888 a 2030), duração e campos obrigatórios.
  - [x] `hooks/useMovieAdminMutations.ts`: TanStack Query mutations (`createMovie`, `updateMovie`, `deleteMovie`) configuradas com `meta: { redirectOnSuccess, invalidates }`.
  - [x] `components/PosterLivePreview.tsx`: Preview dinâmico do pôster com proporção 2:3, iluminação sutil e fallback elegante para URLs vazias ou quebradas.
  - [x] `components/GenreSelectorPills.tsx`: Grade de seleção múltipla de gêneros em chips interativos estilo cápsula.
  - [x] `components/MovieFormView.tsx`: Formulário completo em 2 colunas com `RequiredFieldBadge`, inputs com foco suave e textarea ampla para sinopse.
  - [x] `components/DeleteMovieConfirmDialog.tsx`: Diálogo do shadcn com aviso destrutivo para exclusão segura de filme.
  - [x] `components/MovieCreateContainer.tsx` (rota `/admin/filmes/novo`) & `components/MovieEditContainer.tsx` (rota `/admin/filmes/:id/editar`).
  - [x] Registrar rotas protegidas em `AppRoutes.tsx` com `ProtectedRoute`.

- [x] **6.3 Frontend: Ações Rápidas, Navbar & Integrações de Superfície** *(Concluído em 2026-09-26)*
  - [x] **Navbar (`Navbar.tsx`):** Adicionado botão de acesso rápido "Cadastrar Filme" visível para administradores autenticados.
  - [x] **Catálogo (`MovieQuickActionsMenu.tsx`):** Adicionado itens *Editar filme...* e *Excluir filme...* no menu de contexto (hover `···` e clique direito) para administradores autenticados, com disparo do `DeleteMovieConfirmDialog`.
  - [x] **Ficha Técnica (`MovieDetailsContainer.tsx` / `MovieHeaderInfoView.tsx`):** Botões discretos de ação para administradores (Editar e Excluir).
  - [x] **Command Palette (`CommandPaletteContainer.tsx` & `types/command-palette.types.ts`):** Adicionado comando "Cadastrar Novo Filme" associado à rota `/admin/filmes/novo`.

- [x] **6.4 Testes & Validação de Qualidade** *(Concluído em 2026-09-26)*
  - [x] Testes unitários com Vitest para `MovieFormView`, `PosterLivePreview`, `DeleteMovieConfirmDialog`, `MovieDetailsContainer` e `MovieQuickActionsMenu` (111 testes passando no frontend).
  - [x] `bun run lint` com 0 erros nos arquivos do slice e conformidade total com `@shadcn/no-restyle`.
  - [x] `bun run build` para checagem estrita de compilação TypeScript (`tsc -b`) e bundling Vite passando em 589ms.
  - [x] 30 testes Pytest assíncronos passando no backend.

---

### Etapa 7: Slice Vertical de Favoritos, Watchlist & Biblioteca do Usuário
> **Objetivo:** Permitir aos usuários autenticados salvar filmes em sua lista de Favoritos e Watchlist com toggle imediato via optimistic updates, sem modais ou atrito (1 clique direto), com indicadores visuais sutis e respeitando rigorosamente os princípios de design de `fixes/fix-reviews/` (apenas cores default do tema — sem vermelho e sem azul saturados, sem cardite e com espaçamento orgânico).  
> **Referências:**  
> - [fixes/fix-reviews/fix-reviews.md](file:///home/miguelsb/workspace/visagio-atividade-dev-2026/fixes/fix-reviews/fix-reviews.md) (Princípios de design anti-cardite, espaçamento orgânico, eliminação de cores neon/arcade e pílula flutuante no hover do pôster)  
> - [ARQUITETURA.md (Seções 3.1 e 4.1)](file:///home/miguelsb/workspace/visagio-atividade-dev-2026/ARQUITETURA.md) (Vertical Slices, Clean Component Pattern, TanStack Query Mutations)  
> - [DESIGN.md](file:///home/miguelsb/workspace/visagio-atividade-dev-2026/DESIGN.md) (Paleta em ardósia profunda, tipografia Geist, contenção de contraste)  

#### 🎨 Diretrizes Críticas de Design & Usabilidade da Etapa:
- **Zero cores vermelhas ou azuis neon:** Utilizar **apenas a cor default** do tema (`text-muted-foreground` / `text-white/40` quando inativo; tom âmbar/dourado suave `text-primary` e `fill-primary` quando ativo).
- **Sem cardite nem burocracia:** Ação direta em 1 clique sem modais desnecessários.
- **Pílula de Hover no Pôster (Letterboxd Style):** No hover do pôster, barra flutuante compacta translúcida com cantos arredondados contendo Coração (Favorito), Marcador (Watchlist) e `···` (Menu de contexto).
- **Mutações Otimistas (Optimistic Updates):** O ícone altera instantaneamente no clique; em caso de falha de rede, reverte o estado automaticamente com toast de erro.

- [x] **7.1 Backend: User Library Slice (`backend/app/features/user_library/`)** *(Concluído em 2026-09-26)*
  - [x] Migração Alembic (`0003_user_movie_interactions.py`) criando tabela `user_movie_interactions` (`user_id`, `sk_movie_id`, `is_favorite`, `in_watchlist`, `created_at`, `updated_at` com UniqueConstraint em `user_id, sk_movie_id`).
  - [x] `models.py` & `schemas.py`: `UserMovieInteraction`, `UserLibraryIdsDTO`, `UserMovieInteractionDTO`, `UserLibraryMovieItemDTO`, `PaginatedUserLibraryMoviesDTO`.
  - [x] `service.py`: Operações atômicas de toggle de favorito e watchlist com resolução flexível de ID (`sk_movie_id` ou `id_filme`), consulta rápida de IDs para cache e listagem paginada da biblioteca com gêneros e notas.
  - [x] `router.py`:
    - `GET /api/v1/user/library/ids` (ultraleve para cache de status em cards).
    - `POST /api/v1/user/library/{sk_movie_id}/favorite` (toggle atômico de favorito).
    - `POST /api/v1/user/library/{sk_movie_id}/watchlist` (toggle atômico de watchlist).
    - `GET /api/v1/user/library/movies` (paginação com filtro `?type=favorites|watchlist|all`).
    - `GET /api/v1/user/library/{sk_movie_id}` (consulta de interação específica).
  - [x] **Testes Backend:** `backend/tests/test_user_library.py` (4 testes assíncronos passando cobrindo autorização 401, toggle duplo de favorito/watchlist, listagem paginada e 404 para filme inexistente, totalizando 35 testes no backend).

- [x] **7.2 Frontend: User Library Slice & Ações Rápidas (`frontend/src/features/user-library/`)** *(Concluído em 2026-09-26)*
  - [x] `api/userLibraryApi.ts`: Requisições para os endpoints de biblioteca.
  - [x] `hooks/useUserLibrary.ts`: Hook TanStack Query gerenciando `['user', 'library', 'ids']` com `isFavorite`, `inWatchlist`, `toggleFavorite` e `toggleWatchlist` com **Optimistic Updates**.
  - [x] **Menu de Contexto (`MovieQuickActionsMenu.tsx`):** Ativação dos itens de Favoritar e Watchlist (dropdown e botão direito) usando cores default (`text-primary`/`fill-primary` suave quando ativo).
  - [x] **Pílula de Hover no Card do Pôster (`MovieGridItemView.tsx`):** Barra flutuante elegante no hover contendo Coração, Watchlist e `···`.

- [x] **7.3 Frontend: Ficha Técnica & Página da Biblioteca** *(Concluído em 2026-09-26)*
  - [x] **Ficha Técnica (`MovieHeaderInfoView.tsx`):** Botões discretos e elegantes para Favorito e Watchlist no Hero com feedback de status.
  - [x] **Página da Biblioteca (`/minha-lista`):** Rota com layout estável (largura fixa e números tabulares para eliminar tearing), transição suave com `AnimatePresence` / Framer Motion entre tabs *Favoritos* e *Watchlist*, grid cinematográfico e Empty State convidativo.
  - [x] **Navbar (`Navbar.tsx`):** Acesso rápido à "Minha Lista" para usuário autenticado.

- [x] **7.4 Testes & Validação de Qualidade da Etapa 7** *(Concluído em 2026-09-26)*
  - [x] Testes unitários com Vitest para `useUserLibrary`, `MovieQuickActionsMenu`, `MovieHeaderInfoView` e `/minha-lista` (137 testes passando).

---

### Etapa 8: Enriquecimento da Command Palette, Ações Avançadas & Navegação por Anos
> **Objetivo:** Expandir a Command Palette com atalhos contextuais para Favoritos e Watchlist da biblioteca, e implementar a **navegação dinâmica de anos distintos** baseada no banco SQLite (`SELECT DISTINCT ano_lancamento`) com dropdown menus elegantes no catálogo.  
> **Nota de Sequenciamento:** Esta etapa foi executada estritamente após a conclusão integral da Etapa 7.

- [x] **8.1 Backend: Endpoint de Anos Distintos (`/api/v1/movies/available-years`)** *(Concluído em 2026-09-26)*
  - [x] Consulta otimizada dos anos distintos disponíveis no catálogo (`SELECT DISTINCT ano_lancamento FROM dim_movies WHERE ano_lancamento IS NOT NULL ORDER BY ano_lancamento DESC`).
  - [x] Suporte ao parâmetro `year` em `MovieFilterParams` e `list_movies` no repositório.
  - [x] Testes no backend para o endpoint de anos e filtro por ano (37 testes passando no pytest).
- [x] **8.2 Frontend: Ações Avançadas e Filtros em Dropdown no Catálogo** *(Concluído em 2026-09-26)*
  - [x] Atalhos da Command Palette limpos e focados em busca de filmes por título e ações rápidas (`Minha Biblioteca: Favoritos`, `Minha Biblioteca: Watchlist`, `Explorar Catálogo`, `Cadastrar Filme`).
  - [x] Filtros de catálogo no layout clássico e elegante com `Select` dropdowns para Gênero e Ano de Lançamento (alimentado dinamicamente pelos anos do banco de dados).
- [x] **8.3 Testes & Validação da Etapa 8** *(Concluído em 2026-09-26)*
  - [x] Testes unitários no frontend para `useCatalogViewModel`, `CatalogControlBar`, `CommandResultsGroup` e `CommandPaletteDialogView`.



### Etapa 9: Documentação, Auditoria de Código e Validação E2E
> **Objetivo:** Consolidar a documentação do projeto, validar a qualidade do código com ESLint/TSDoc e produzir o README com guia de execução passo a passo exigido pelo PDF de especificação.  
> **Referências:**  
> - [Atividade de Dev.pdf (README com passo a passo)](file:///home/miguelsb/workspace/visagio-atividade-dev-2026/atividade-dev.md)  
> - [requisitos-nao-funcionais.md (RNF07, RNF08, RNF10)](file:///home/miguelsb/workspace/visagio-atividade-dev-2026/requisitos-nao-funcionais.md#L79-L102)  
> - [ARQUITETURA.md (Seção 6)](file:///home/miguelsb/workspace/visagio-atividade-dev-2026/ARQUITETURA.md)

- [x] **9.1 Auditoria de Qualidade & Linters** *(Concluído em 2026-09-26)*
  - [x] Rodar ESLint 9+ (`bun run lint`) e corrigir quaisquer violações de tipagem estrita, `@shadcn/lint` e TSDoc (0 erros).
  - [x] Rodar `tsc -b && vite build` (`bun run build`) validando compilação TypeScript e bundling de produção com 100% de sucesso.
  - [x] Backend: Rodar `uv run ruff check .` e garantir 100% de conformidade com PEP 8 e regras de tipagem/imports.
  - [x] Suíte de testes: 37/37 testes pytest no backend e 137/137 testes vitest no frontend passando com sucesso.
- [x] **9.2 README.md Final & Guia de Execução** *(Concluído em 2026-09-26)*
  - [x] Atualizar o [README.md](file:///home/miguelsb/workspace/visagio-atividade-dev-2026/README.md) com:
    - Pré-requisitos (Python 3.11+, Bun, uv, SQLite).
    - Passo a passo de inicialização do backend FastAPI (`uv sync`, `uv run alembic upgrade head`, `seed_database.py`, `uv run uvicorn`).
    - Passo a passo de inicialização do frontend Vite (`bun install`, `bun run dev`).
    - Credenciais de acesso de administrador para testes.
    - Como rodar a suíte completa de testes (`uv run pytest` e `bun run test`).
    - Instruções de auditoria de código (`bun run lint`, `bun run build`, `uv run ruff check .`).

---

## Registro de Atualizações do Checklist (Histórico de Execução)

| Timestamp | Subetapa | Ação Realizada | Responsável | Status Resultante |
| :--- | :--- | :--- | :--- | :---: |
| 2026-09-24 01:10 | Criação | Criação do plano inicial em fatias verticais | Antigravity | `[x]` Plano Estruturado |
| 2026-09-24 21:30 | Etapa 2 | Implementação completa da Slice de Autenticação Admin (Backend JWT + Frontend Login split com Storyset SVGs animados, textos rotativos e Aceternity MultiStepLoader) | Antigravity | `[x]` Concluído |
| 2026-09-24 22:05 | Etapa 2 | Migração da camada de autenticação para `pyjwt` e `pwdlib[argon2]` seguindo guia moderno do FastAPI | Antigravity | `[x]` Concluído |
| 2026-09-25 18:15 | Etapa 4 (4.3) | Redesign Editorial da Ficha Técnica: eliminação da cardite, Hero integrado em 2 colunas, Ratings Strip horizontal, KPIs tipográficos contínuos, texto editorial para equipe e contenção cromática | Antigravity | `[x]` Concluído |
| 2026-09-26 15:58 | Etapa 6 (6.1-6.4) | Slice Vertical de Gestão de Filmes (CRUD Admin): backend transacional completo com remoção segura em cascata, formulário editorial anti-cardite em 2 colunas com live poster preview 2:3, seleção de gêneros em pills, diálogo de confirmação seguro, atalhos contextuais no catálogo/ficha técnica/palette e botão de cadastro na Navbar para admins. 100% testes passando (30 backend, 111 frontend), build Vite e 0 erros de linting. | Antigravity | `[x]` Concluído |
| 2026-09-26 18:28 | Etapa 7 (7.1) | Slice Vertical de Favoritos e Watchlist (Backend): migração Alembic 0003 gerando user_movie_interactions, modelos ORM, schemas Pydantic, serviço com resolução polimórfica de ID, endpoints RESTful (/user/library/ids, /favorite, /watchlist, /movies) e 4 testes Pytest assíncronos. Totalizando 35 testes backend passando com sucesso. | Antigravity | `[x]` Concluído |
| 2026-09-26 19:07 | Etapa 9 (9.1-9.2) | Auditoria de Qualidade, Linters e README Final: correção de 100% dos erros de ESLint 9+ e `@shadcn/lint` (0 erros), compilação estrita TypeScript (`bun run build` OK), backend formatado e validado com Ruff (`uv run ruff check .` com 0 erros), 174 testes automatizados passando (37 pytest, 137 vitest) e README.md atualizado com guia passo a passo completo. | Antigravity | `[x]` Concluído |
