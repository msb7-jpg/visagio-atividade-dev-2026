# Documento de Arquitetura & Guia de Estrutura de Pastas (Vertical Slices)

> **Projeto:** RocketFilms — Catálogo e Avaliação de Filmes (Estilo Letterboxd / Visagio RocketLab 2026.2)  
> **Padrão Arquitetural Principal:** **Vertical Slice Architecture** (Backend & Frontend)  
> **Separação de Responsabilidades:** Presentation / UI Pura vs. Container / Hooks / State / Logic  

---

## 1. Princípios & Diretrizes Arquiteturais

### 1.1 Vertical Slice Architecture (Fatiamento Vertical)
Em vez da clássica arquitetura em camadas horizontais em que todo o código é agrupado por tipo técnico (`controllers/`, `services/`, `repositories/` no backend; `components/`, `hooks/`, `views/` no frontend), o sistema é organizado por **Domínio de Funcionalidade / Casos de Uso (Features)**.
- Cada slice vertical contém tudo o que precisa para executar sua responsabilidade: endpoints/rotas, schemas/validações, regras de negócio/serviços, queries/mutations de dados e componentes de interface.
- Reduz o acoplamento entre módulos distintos e facilita a manutenção, permitindo que uma funcionalidade seja adicionada, alterada ou removida sem impacto colateral nas demais.

### 1.2 Linguagem Onipresente (Ubiquitous Language)
Para eliminar qualquer atrito de tradução mental, ruído entre times ou divergência entre API e UI, o projeto adota **rigorosamente os mesmos termos em todo o ciclo de vida da informação** (Banco de Dados, Schemas Pydantic, Endpoints da API, Schemas Zod, Queries/Mutations do TanStack e Nomes de Campos em Formulários/Componentes).
- Se no backend/banco o campo chama `titulo`, no schema Pydantic é `titulo`, na resposta JSON é `titulo`, no schema Zod do frontend é `titulo`, e no TanStack Form (`form.Field name="titulo"`) é `titulo`.
- Nada de `title` no front e `titulo` no back, ou `director` no front e `nome_pessoa` no back.
- **Tabela de Equivalência Oficial da Linguagem Onipresente:**

| Conceito de Negócio | Termo Canônico (Back, Front, Zod, TanStack) | Tipo | Descrição |
| :--- | :--- | :--- | :--- |
| Filme / Chave Substituta | `sk_movie_id` | `string` (SHA-256) | Identificador único analítico |
| Código de Negócio | `id_filme` | `string` | ID original de catálogo TMDb |
| Título do Filme | `titulo` | `string` | Nome da obra |
| Data de Lançamento | `data_lancamento` | `string` (YYYY-MM-DD) | Data de estreia |
| Ano de Lançamento | `ano_lancamento` | `number` | Ano (ex: 2021) |
| Duração | `duracao_minutos` | `number` | Duração em minutos |
| Status | `status_filme` | `string` | Ex: "Lançado", "Em Produção" |
| Sinopse | `sinopse` | `string` | Texto descritivo |
| Imagem do Pôster | `url_poster` | `string \| null` | URL direta do pôster vertical (TMDb) |
| Imagem de Fundo (Backdrop) | `url_backdrop` | `string \| null` | URL horizontal panorâmica (TMDb) |
| Gêneros do Filme | `genres` / `nome_genero` | `array` / `string` | Lista de gêneros associados |
| Produtoras / Estúdios | `companies` / `nome_produtora` | `array` / `string` | Lista de produtoras |
| Pessoas (Elenco/Equipe) | `people` (`nome_pessoa`, `tipo_pessoa`) | `array` | Atores, Diretores e Roteiristas |
| Média das Avaliações | `nota_media_usuarios` | `number \| null` | Média calculada das resenhas internas |
| Qtd de Avaliações | `qtd_avaliacoes_usuarios` | `number` | Total de resenhas submetidas |
| Nota da Resenha | `nota` | `number` (0 a 10) | Nota individual do usuário |
| Comentário da Resenha | `comentario` | `string` | Texto da resenha |
| Autor da Resenha | `nome` | `string` | Nome do autor |
| Popularidade | `popularidade` | `number` | Métrica de engajamento analítico |
| Orçamento (USD / BRL) | `orcamento_usd`, `orcamento_brl` | `number` | Custo de produção |
| Bilheteria / Receita | `receita_usd`, `receita_brl` | `number` | Faturamento global |
| Lucro / Retorno | `lucro_usd`, `lucro_brl` | `number` | Lucro consolidado |

---

### 1.3 Como Obter e Tratar o `url_poster` (e `url_backdrop`)
A base de dados analítica (`data/dim_movies.csv` e tabela `dim_movies`) **já possui a coluna nativa `url_poster` e `url_backdrop`**:
- **Formato Nativo:** A maioria dos registros contém URLs completas da CDN oficial do TMDb (ex: `https://image.tmdb.org/t/p/w500/yp4CDOVpVmNwiPoZKQeFCpW8CFo.jpg` e `https://image.tmdb.org/t/p/w1280/a4r8xcRwTgKIUKdWtxFXyxTZLeN.jpg`).
- **Campos Auxiliares Disponíveis no Modelo:**
  1. `id_filme`: ID numérico oficial do TMDb (ex: `14564`, `32471`). Caso um registro venha sem `url_poster` ou seja cadastrado manualmente apenas com o `id_filme`, podemos opcionalmente resolver o poster via API do TMDb (`https://api.themoviedb.org/3/movie/{id_filme}`) ou construir dinamicamente o link.
  2. `titulo` + `ano_lancamento`: Podem ser usados para gerar placeholders contextuais elegantes quando `url_poster` for nulo.
- **Tratamento Resiliente no Frontend:**
  - Componente `<MoviePoster url_poster={filme.url_poster} titulo={filme.titulo} />` implementando:
    - `loading="lazy"` para performance.
    - Fallback com imagem de fallback/placeholder cinematográfico escuro com o título do filme e ícone `Film` do Lucide caso `url_poster` seja nulo ou a imagem quebre (`onError`).

---

### 1.4 Frontend: Separação Estrita de Responsabilidade (Clean Components vs. Logic)

1. **Pure UI / Presentational Components (Burros / View-only):**
   - Recebem dados e callbacks exclusivamente via `props`.
   - Cuidam unicamente de layout, responsividade, Tailwind CSS, animações (`framer-motion`) e microinterações.
   - **Zero** chamadas de API, zero dependência direta de `useQuery` ou `useNavigate`.
2. **Feature Containers / Page Controllers (Orquestradores):**
   - Componentes que conectam a tela com a lógica de negócio.
   - Instanciam os hooks customizados da fatia (`useMovieCatalog`, `useMovieDetails`, `useCreateReview`).
   - Tratam estados de `isLoading`, `isError`, e repassam os dados mastigados para os componentes visuais.
3. **Custom Hooks por Slice (`use[Feature]`):**
   - Centralizam o consumo do TanStack Query (`useQuery`, `useMutation`), sincronização com URL (`useSearchParams` do React Router v7) e manipulação do TanStack Form.
4. **Schemas & Contracts (`schemas.ts` + `types.ts`):**
   - Contratos Zod para validação em runtime (formulários e respostas da API) e tipos TypeScript inferidos (`z.infer<typeof schema>`).
5. **API Client Slice (`api.ts`):**
   - Chamadas HTTP puras e isoladas para consumo do backend FastAPI.

---

## 2. Visão Geral da Estrutura Completa de Pastas

```text
visagio-atividade-dev-2026/
├── backend/
│   ├── app/
│   │   ├── core/                  # Configurações globais, segurança JWT, logging
│   │   ├── db/                    # Engine SQLAlchemy assíncrona, Base declarativa, Session
│   │   ├── shared/                # Utilitários transversais, paginação genérica, deps FastAPI
│   │   └── features/              # VERTICAL SLICES (Backend)
│   │       ├── auth/              # Autenticação JWT, login, proteção de rotas
│   │       ├── movies/            # CRUD de filmes, busca, catálogo, filtros
│   │       ├── analytics/         # Indicadores analíticos, popularidade, box office
│   │       ├── reviews/           # Avaliações de usuários, cálculo de médias
│   │       └── metadata/          # Gêneros, produtoras e pessoas (atores/diretores)
│   ├── tests/                     # Testes de integração (Pytest + HTTPX)
│   ├── scripts/                   # Script de carga CSV (seed da camada Diamond)
│   └── alembic/                   # Migrações de banco de dados
│
└── frontend/
    ├── src/
    │   ├── assets/                # Imagens estáticas, logos, vetores
    │   ├── components/            # Componentes Globais Compartilhados
    │   │   ├── ui/                # Primitivos shadcn/ui (Button, Dialog, Input, etc.)
    │   │   ├── aceternity/        # Efeitos visuais reutilizáveis (WavyBackground, Spotlight, etc.)
    │   │   ├── layout/            # Navbar flutuante, Footer, AppLayout, Sidebar
    │   │   └── feedback/          # ErrorBoundary, EmptyState, PageLoader, RequiredTooltip
    │   ├── features/              # VERTICAL SLICES (Frontend)
    │   │   ├── auth/              # Slice de Autenticação / Login Admin
    │   │   ├── catalog/           # Slice do Catálogo Principal & Filtros
    │   │   ├── movie-details/     # Slice da Ficha Técnica & Métricas
    │   │   ├── movie-admin/       # Slice de Cadastro & Edição de Filmes
    │   │   ├── reviews/           # Slice de Histórico & Envio de Avaliações
    │   │   └── command-palette/   # Slice da Spotlight Palette (Cmd+K)
    │   ├── routes/                # Roteamento Declarativo (React Router v7)
    │   ├── lib/                   # Configurações de terceiros (axios, queryClient, cn)
    │   └── test/                  # Setup de testes Vitest, MSW handlers e mocks
```

---

## 3. Backend: Arquitetura em Vertical Slices

Cada pasta sob `backend/app/features/` encapsula seu próprio caso de uso de ponta a ponta, contendo roteamento, modelos ORM/relacionamentos, esquemas Pydantic, serviços/regras e dependências.

### 3.1 Detalhamento dos Slices do Backend

```text
backend/app/
├── core/
│   ├── config.py                  # Pydantic Settings (env vars, secrets, db url)
│   ├── security.py                # Hashing Argon2/Bcrypt, geração e validação de tokens JWT
│   └── logging.py                 # Setup unificado de logs
├── db/
│   ├── base.py                    # Base SQLAlchemy declarativa
│   └── session.py                 # AsyncSession maker e conexão aiosqlite
├── shared/
│   ├── dependencies.py            # get_db, get_current_admin
│   ├── pagination.py              # Schemas genéricos de paginação (Page[T], Params)
│   └── exceptions.py              # Exceções customizadas e handlers de erro HTTP
└── features/
    ├── auth/                      # SLICE: Autenticação Administrativa
    │   ├── router.py              # POST /api/v1/auth/login, POST /api/v1/auth/refresh
    │   ├── schemas.py             # LoginRequest, TokenResponse, AdminUser
    │   └── service.py             # Validação de credenciais e emissão de JWT
    │
    ├── movies/                    # SLICE: Catálogo e Gestão de Filmes (DimMovie)
    │   ├── router.py              # GET /api/v1/movies, GET /api/v1/movies/{id}, POST, PUT, DELETE
    │   ├── schemas.py             # MovieListItemDTO, MovieDetailDTO, MovieCreateDTO, MovieUpdateDTO
    │   ├── service.py             # Regras de negócio, montagem de joins e deleção em cascata
    │   └── repository.py          # Queries otimizadas (selectinload de gêneros/produtoras)
    │
    ├── analytics/                 # SLICE: Desempenho & Box Office (FactMoviePerformance)
    │   ├── router.py              # GET /api/v1/analytics/trending, GET /api/v1/analytics/box-office
    │   ├── schemas.py             # TrendingMovieDTO, BoxOfficeHighlightDTO, ROIStatsDTO
    │   └── service.py             # Consultas de ordenação por popularidade e cálculo de lucro
    │
    ├── reviews/                   # SLICE: Avaliações e Média de Notas (MovieReview + DimReview)
    │   ├── router.py              # GET /api/v1/movies/{id}/reviews, POST /api/v1/movies/{id}/reviews
    │   ├── schemas.py             # ReviewResponseDTO, CreateReviewDTO, ReviewSummaryDTO
    │   └── service.py             # Gravação de review e recálculo atômico de DimReview (nota média)
    │
    └── metadata/                  # SLICE: Domínios de Apoio (DimGenre, DimCompany, DimPerson)
        ├── router.py              # GET /api/v1/genres, GET /api/v1/companies, GET /api/v1/people
        ├── schemas.py             # GenreDTO, CompanyDTO, PersonDTO
        └── service.py             # Listagens cacheadas e buscas por autocomplete
```

### 3.2 Modelos ORM vs. Slices
Os modelos em `backend/app/movies/models.py` refletem o esquema estrela analítico (`DimMovie`, `DimGenre`, `DimCompany`, `DimPerson`, `FactMoviePerformance`, `MovieReview`, `DimReview`).
- Cada fatia importa e consulta as entidades necessárias sob transação assíncrona (`AsyncSession`).
- O serviço de `reviews/` gerencia `MovieReview` e atualiza `DimReview`.
- O serviço de `analytics/` consulta `FactMoviePerformance` agregando com `DimMovie`.

---

## 4. Frontend: Arquitetura em Vertical Slices & Responsabilidade Limpa

Para garantir que os componentes permaneçam limpos, testáveis e fáceis de estilizar, cada funcionalidade em `src/features/<feature-name>` é estruturada uniformemente em **4 camadas internas**:

```text
src/features/<feature-name>/
├── api/                           # 1. Chamadas HTTP puras (axios/fetch)
│   ├── [feature]Api.ts
│   └── __tests__/                 # Testes unitários de API co-localizados
├── hooks/                         # 2. Lógica de negócio, TanStack Query/Form, Router State
│   ├── use[Feature]Query.ts
│   ├── use[Feature]Form.ts
│   └── __tests__/                 # Testes de hooks co-localizados
├── schemas/                       # 3. Validação e Contratos (Zod + TypeScript Types)
│   ├── [feature].schema.ts
│   └── [feature].types.ts
├── utils/                         # Utilitários e helpers puros da feature
│   └── __tests__/                 # Testes de helpers co-localizados
└── components/                    # 4. Componentes UI (Separados em Contêiner e Apresentação)
    ├── [Feature]Container.tsx     # Smart / Orquestrador (liga hooks aos componentes visuais)
    ├── [Feature]View.tsx          # Dumb / Presentational principal (apenas JSX, Tailwind, Props)
    ├── subcomponents/             # Microcomponentes puramente visuais da tela
    └── __tests__/                 # Testes de componentes co-localizados (o mais próximo possível dos alvos)
```

> **Diretriz de Co-localização de Testes & Importações:**
> - As pastas `__tests__/` residem **sempre imediatamente dentro do subdiretório** do arquivo sob teste (ex: `components/__tests__/`, `hooks/__tests__/`, `utils/__tests__/`, `api/__tests__/`). Evita-se pastas de teste distantes ou isoladas na raiz da feature.
> - **Importações Relativas em Testes:** Arquivos de teste (`**/*.test.{ts,tsx}`) têm permissão explícita para utilizar importações relativas (`../`) para referenciar o módulo adjacente testado, preservando a portabilidade do subdiretório.

### 4.1 Estrutura Completa de Pastas do Frontend

```text
frontend/src/
├── main.tsx                       # Ponto de entrada com Providers globais (QueryClient, Router)
├── App.tsx                        # Definição e renderização da malha de rotas
├── index.css                      # Tailwind v4 theme, cores semânticas e fontes
│
├── lib/                           # Clientes e Utilitários Globais
│   ├── api-client.ts              # Instância Axios com interceptors de JWT e timeout
│   ├── query-client.ts            # Configuração do QueryClient (staleTime 5m, gcTime 15m)
│   └── utils.ts                   # Função `cn()` (clsx + tailwind-merge)
│
├── routes/                        # Configuração do React Router v7
│   ├── index.tsx                  # Definição de rotas (`createBrowserRouter` ou `<Routes>`)
│   ├── protected-route.tsx        # Guard de rota que exige autenticação JWT
│   └── route-paths.ts             # Constantes tipadas de rotas ('/filmes/:id', etc.)
│
├── components/                    # Componentes Compartilhados Transversais
│   ├── ui/                        # Primitivos shadcn (Button, Dialog, Badge, Input, Select, etc.)
│   ├── aceternity/                # Efeitos Visuais Ricos
│   │   ├── wavy-background.tsx    # Fundo animado para Hero section
│   │   ├── layout-text-flip.tsx   # Efeito flip 3D de palavras para login
│   │   ├── card-spotlight.tsx     # Brilho radial que segue o cursor no hover
│   │   ├── expandable-card.tsx    # Expansão orgânica com Framer Motion (layoutId)
│   │   └── text-generate.tsx      # Aparição progressiva da sinopse
│   ├── layout/                    # Estrutura do App
│   │   ├── AppLayout.tsx          # Shell com Navbar flutuante, Outlet e Footer
│   │   ├── Navbar.tsx             # Glass Navbar com trigger do Spotlight (Cmd+K)
│   │   └── Footer.tsx             # Rodapé cinematográfico e dados da Diamond layer
│   └── feedback/
│       ├── RequiredFieldBadge.tsx # Asterisco com Tooltip "Required field" (estilo dark)
│       ├── LoadingSkeleton.tsx    # Skeletons responsivos para grid/list de filmes
│       └── EmptyState.tsx         # Feedback quando buscas não retornam resultados
│
└── features/                      # FATIAS VERTICAIS (Vertical Slices)
    │
    ├── auth/                      # SLICE: Login do Administrador
    │   ├── api/
    │   │   └── authApi.ts         # loginRequest(credentials) -> { token, admin }
    │   ├── schemas/
    │   │   ├── auth.schema.ts     # loginSchema (Zod: email, password min 6)
    │   │   └── auth.types.ts      # LoginInput, AuthSession, JwtPayload
    │   ├── utils/
    │   │   └── token.ts           # decodeToken, isTokenExpired, getTokenPayload via jwt-decode
    │   ├── hooks/
    │   │   ├── useAuth.ts         # Leitura do estado de auth com verificação síncrona de expiração
    │   │   └── useLoginForm.ts    # TanStack Form acoplado ao auth.schema
    │   └── components/
    │       ├── LoginContainer.tsx # Orquestrador da rota /login
    │       ├── LoginCardView.tsx  # Cartão Glassmorphic visual puro (recebe form e flags)
    │       └── TextFlipHeader.tsx # Apresentação do Aceternity LayoutTextFlip
    │
    ├── catalog/                   # SLICE: Catálogo de Filmes, Busca e Filtros
    │   ├── api/
    │   │   └── catalogApi.ts      # fetchMovies(params), fetchGenres(), fetchCompanies()
    │   ├── schemas/
    │   │   ├── catalog-filter.schema.ts # Zod schema para validar query params da URL
    │   │   └── movie-summary.schema.ts  # Contrato dos dados de card/tabela
    │   ├── hooks/
    │   │   ├── useCatalogParams.ts       # Sincronização bidirecional com useSearchParams (page, q, genre, view)
    │   │   ├── useMoviesQuery.ts         # TanStack Query com keepPreviousData, prefetch
    │   │   └── useTrendingMoviesQuery.ts # Query para seção de Top Popularidade e Bilheteria
    │   └── components/
    │       ├── CatalogContainer.tsx      # Orquestrador da Home (`/`)
    │       ├── CatalogHeroView.tsx       # Apresentação do Hero + WavyBackground
    │       ├── CuratedHighlightsView.tsx # Apresentação dos carrosséis analíticos (Popularidade/Box Office)
    │       ├── CatalogControlBar.tsx     # Barra de filtros, Select de ordenação e Toggle Grid/List
    │       ├── MovieGridItemView.tsx     # Card individual puro com CardSpotlight e badges de nota
    │       ├── MovieListItemView.tsx     # Linha da tabela/lista densa com poster miniatura
    │       └── CatalogPaginationView.tsx # Renderização dos botões da paginação shadcn
    │
    ├── movie-details/             # SLICE: Detalhes do Filme & Métricas Analíticas
    │   ├── api/
    │   │   └── movieDetailsApi.ts # fetchMovieDetails(id), deleteMovie(id)
    │   ├── schemas/
    │   │   └── movie-details.schema.ts # DTO detalhado com elenco, métricas financeiras, TMDb/IMDb
    │   ├── hooks/
    │   │   ├── useMovieDetailsQuery.ts # useQuery(['movie-details', id])
    │   │   └── useDeleteMovieMutation.ts # useMutation com toast e invalidateQueries
    │   └── components/
    │       ├── MovieDetailsContainer.tsx  # Orquestrador da rota `/filmes/:id`
    │       ├── MovieBackdropHeroView.tsx  # Banner superior com imagem desfocada e fade
    │       ├── MovieInfoCardView.tsx      # Pôster, título, duração, sinopse (TextGenerateEffect)
    │       ├── CastAndCrewSectionView.tsx # Avatares e lista de Diretor/Atores (TooltipCard)
    │       ├── FinancialMetricsView.tsx   # Cards Glassmorphism: Orçamento, Bilheteria e Lucro/ROI
    │       └── ScoreComparisonView.tsx    # Notas RocketFilms (usuários) vs TMDb vs IMDb
    │
    ├── reviews/                   # SLICE: Avaliações de Usuários (Leitura e Escrita)
    │   ├── api/
    │   │   └── reviewsApi.ts      # fetchMovieReviews(movieId), submitReview(movieId, data)
    │   ├── schemas/
    │   │   └── review.schema.ts   # Zod schema: nome, nota (0 a 10), comentario (10 a 4000 caracteres)
    │   ├── hooks/
    │   │   ├── useReviewsQuery.ts # useQuery(['movie-reviews', movieId])
    │   │   ├── useSubmitReviewMutation.ts # Invalida 'movie-reviews' e 'movie-details'
    │   │   └── useReviewForm.ts   # TanStack Form com zodFormAdapter
    │   └── components/
    │       ├── ReviewsContainer.tsx      # Orquestrador da seção de resenhas
    │       ├── ReviewExpandableCardView.tsx # Aceternity ExpandableCard com animação modal
    │       ├── ReviewRatingStarsView.tsx # Componente de estrelas interativas / nota numérica
    │       └── NewReviewModalView.tsx    # Modal de formulário com indicadores de campo obrigatório
    │
    ├── movie-admin/               # SLICE: Criação & Edição de Filmes (Admin)
    │   ├── api/
    │   │   └── movieAdminApi.ts   # createMovie(data), updateMovie(id, data)
    │   ├── schemas/
    │   │   └── movie-form.schema.ts # Zod: título, diretor, ano (1888-2030), gêneros, sinopse, poster
    │   ├── hooks/
    │   │   ├── useMovieAdminForm.ts # TanStack Form com validação em tempo real e reset
    │   │   └── useSaveMovieMutation.ts # Mutation unificada (POST/PUT) com redirecionamento
    │   └── components/
    │       ├── MovieCreateContainer.tsx # Container para `/admin/filmes/novo`
    │       ├── MovieEditContainer.tsx   # Container para `/admin/filmes/:id/editar`
    │       ├── MovieFormView.tsx        # Apresentação do formulário completo
    │       ├── PosterPreviewCard.tsx    # Visualizador do pôster em tempo real ao digitar a URL
    │       └── RequiredFormField.tsx    # Campo com borda de destaque e tooltip "Required field"
    │
    └── command-palette/           # SLICE: Spotlight Command Palette (`Ctrl+K` / `Cmd+K`)
        ├── api/
        │   └── spotlightApi.ts    # quickSearchMovies(query) para busca com debounce
        ├── schemas/
        │   └── spotlight.schema.ts
        ├── hooks/
        │   ├── useCommandPalette.ts # Listener global de teclado (Cmd+K / Ctrl+K) e controle de abertura
        │   └── useSpotlightSearch.ts # useQuery com debounce de 300ms
        └── components/
            ├── CommandPaletteContainer.tsx # Orquestrador global inserido no AppLayout
            ├── CommandPaletteDialogView.tsx # cmdk / Dialog com backdrop blur intenso e animações
            └── CommandResultsGroupView.tsx  # Grupos formatados (Filmes, Gêneros, Bilheteria, Ações)
```

---

## 5. Exemplo de Implementação do Padrão "Componente Limpo" (Clean Separation)

Abaixo é ilustrado o padrão obrigatório a ser seguido para manter qualquer componente visual 100% desacoplado de regras de negócio.

### 5.1 O Contrato de Dados & Validação (`review.schema.ts`)
```typescript
import { z } from 'zod';

export const createReviewSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres').max(120),
  nota: z.number().min(0, 'Nota mínima é 0').max(10, 'Nota máxima é 10'),
  comentario: z
    .string()
    .min(10, 'O comentário deve conter ao menos 10 caracteres')
    .max(4000, 'Limite de 4000 caracteres excedido'),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
```

### 5.2 O Hook Especializado da Fatia (`useReviewForm.ts`)
```typescript
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { createReviewSchema, type CreateReviewInput } from '../schemas/review.schema';
import { useSubmitReviewMutation } from './useSubmitReviewMutation';

export function useReviewForm(movieId: string, onSuccess?: () => void) {
  const mutation = useSubmitReviewMutation(movieId);

  const form = useForm({
    defaultValues: { nome: '', nota: 10, comentario: '' } as CreateReviewInput,
    validatorAdapter: zodValidator(),
    validators: {
      onChange: createReviewSchema,
    },
    onSubmit: async ({ value }) => {
      await mutation.mutateAsync(value);
      form.reset();
      onSuccess?.();
    },
  });

  return { form, isSubmitting: mutation.isPending, error: mutation.error };
}
```

### 5.3 O Componente Visual Puro (`ReviewModalView.tsx`) — Sem Chamadas de API
```tsx
import type { FormApi } from '@tanstack/react-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RequiredFieldBadge } from '@/components/feedback/RequiredFieldBadge';
import type { CreateReviewInput } from '../schemas/review.schema';

interface ReviewModalViewProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  form: FormApi<CreateReviewInput>;
  isSubmitting: boolean;
}

export function ReviewModalView({
  isOpen,
  onOpenChange,
  form,
  isSubmitting,
}: ReviewModalViewProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="border-white/10 bg-card/90 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight">
            Escrever Avaliação
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void form.handleSubmit();
          }}
          className="space-y-4 pt-2"
        >
          <form.Field name="nome">
            {(field) => (
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-sm font-medium">
                  <label htmlFor={field.name}>Seu Nome</label>
                  <RequiredFieldBadge />
                </div>
                <input
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm"
                  placeholder="Ex: Clara Silveira"
                />
                {field.state.meta.errors[0] && (
                  <p className="text-xs text-destructive">{field.state.meta.errors[0].message}</p>
                )}
              </div>
            )}
          </form.Field>

          {/* Demais campos estilizados com Tailwind e sem regras de rede */}

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="ghost" type="button" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Publicando...' : 'Publicar Resenha'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

### 5.4 O Contêiner Orquestrador (`ReviewsContainer.tsx`)
```tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useReviewsQuery } from '../hooks/useReviewsQuery';
import { useReviewForm } from '../hooks/useReviewForm';
import { ReviewExpandableCardView } from './ReviewExpandableCardView';
import { ReviewModalView } from './ReviewModalView';

interface ReviewsContainerProps {
  movieId: string;
}

export function ReviewsContainer({ movieId }: ReviewsContainerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: reviews, isLoading, isError } = useReviewsQuery(movieId);
  const { form, isSubmitting } = useReviewForm(movieId, () => setIsModalOpen(false));

  if (isLoading) return <div className="py-8 text-center text-muted-foreground">Carregando avaliações...</div>;
  if (isError) return <div className="py-8 text-center text-destructive">Erro ao carregar avaliações.</div>;

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Avaliações da Comunidade</h2>
        <Button onClick={() => setIsModalOpen(true)}>Escrever Avaliação</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reviews?.map((review) => (
          <ReviewExpandableCardView key={review.sk_movie_review_id} review={review} />
        ))}
      </div>

      <ReviewModalView
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        form={form}
        isSubmitting={isSubmitting}
      />
    </section>
  );
}
```

---

## 6. Mapeamento dos Casos de Uso & Endpoints da API

| Slice | Endpoint HTTP | Descrição do Caso de Uso | Modelos Envolvidos |
| :--- | :--- | :--- | :--- |
| `catalog` | `GET /api/v1/movies` | Listagem paginada com busca textual, gênero, ordenação | `DimMovie`, `DimGenre`, `FactMoviePerformance`, `DimReview` |
| `catalog` | `GET /api/v1/metadata/genres` | Lista de todos os gêneros para filtro em pílulas | `DimGenre` |
| `analytics` | `GET /api/v1/analytics/trending` | Top 10 filmes com maior popularidade | `FactMoviePerformance` join `DimMovie` |
| `analytics` | `GET /api/v1/analytics/box-office` | Campeões de bilheteria e maiores lucros | `FactMoviePerformance` join `DimMovie` |
| `movie-details` | `GET /api/v1/movies/{id}` | Ficha técnica completa, diretores, atores, métricas | `DimMovie`, `DimPerson`, `DimCompany`, `FactMoviePerformance` |
| `reviews` | `GET /api/v1/movies/{id}/reviews` | Histórico paginado de avaliações | `MovieReview` |
| `reviews` | `POST /api/v1/movies/{id}/reviews` | Cadastra avaliação e atualiza nota média do filme | `MovieReview`, `DimReview` |
| `movie-admin` | `POST /api/v1/movies` | Cadastra novo filme (requer JWT de admin) | `DimMovie`, `DimGenre`, `DimCompany`, `DimPerson` |
| `movie-admin` | `PUT /api/v1/movies/{id}` | Atualiza dados do filme existente (requer JWT) | `DimMovie`, bridges |
| `movie-admin` | `DELETE /api/v1/movies/{id}` | Remove filme e relacionamentos em cascata | `DimMovie` (cascade orphan) |
| `command-palette` | `GET /api/v1/movies/quick-search?q=` | Busca com debounce (título, diretor, ano) | `DimMovie`, `DimPerson` |
| `auth` | `POST /api/v1/auth/login` | Login administrativo e emissão de token JWT | Tabela de usuários/admin |

---

## 7. Benefícios da Abordagem Adotada

1. **Escalabilidade & Legibilidade:** Os componentes React ficam puramente visuais, fáceis de alinhar com o design rico (Tailwind v4, Aceternity UI, Glassmorphism). O código de interface não é poluído com dezenas de `try/catch`, chamadas de endpoints ou regras de validação.
2. **Manutenibilidade:** Qualquer alteração no fluxo de uma funcionalidade (ex: validação de review ou filtro de catálogo) é feita dentro da pasta correspondente em `src/features/<feature>/` ou `backend/app/features/<feature>/`, sem quebrar outras áreas da aplicação.
3. **Testabilidade Real:** 
   - Os componentes visuais podem ser testados com Storybook ou Vitest de forma isolada, apenas injetando props mocadas.
   - Os hooks podem ser testados com `@testing-library/react` e MSW.
   - Os serviços FastAPI e endpoints recebem testes de integração rápidos com Pytest e AsyncClient.
4. **Alinhamento com RNFs:** Cumpre rigorosamente **RNF01 a RNF14**, eliminando caminhos relativos longos via path alias `@/*` e garantindo tipagem de ponta a ponta com TypeScript estrito, Zod e Pydantic v2.
