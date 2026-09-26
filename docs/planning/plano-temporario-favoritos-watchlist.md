# Plano Temporário: Slice Vertical de Favoritos, Watchlist & Biblioteca do Usuário

> **Documento Temporário de Planejamento e Especificação**  
> **Status:** Proposta Refinada  
> **Fontes e Diretrizes:**  
> - [fixes/fix-reviews/fix-reviews.md](file:///home/miguelsb/workspace/visagio-atividade-dev-2026/fixes/fix-reviews/fix-reviews.md) (Princípios de design anti-cardite, espaçamento orgânico e eliminação de cores néon/arcade)  
> - [ARQUITETURA.md](file:///home/miguelsb/workspace/visagio-atividade-dev-2026/ARQUITETURA.md) (Padrão Vertical Slices, Clean Component Pattern, TanStack Query Mutations)  
> - [DESIGN.md](file:///home/miguelsb/workspace/visagio-atividade-dev-2026/DESIGN.md) (Paleta de ardósia profunda, tipografia Geist, contenção de contraste)  

---

## 🎨 Diretrizes Críticas de Design & Usabilidade (Inspiradas em `fixes/fix-reviews`)

1. **Contenção Cromática Estrita (Zero Cores Vermelhas / Azuis Néon):**
   - **Proibido** usar vermelho estridente para coração ou azul saturado para watchlist.
   - Utilizar **estritamente a cor default/semântica do tema**:
     - Estado Inativo: `text-muted-foreground` / `text-white/40` (cinza fosco neutro).
     - Estado Ativo: Tom âmbar/dourado quente suave (`text-primary` e `fill-primary` desaturado), consistente com as estrelas de review e o tom clássico de cinema Letterboxd.
     - Foco e borders: `border-primary/40` ou cinza sutil, sem halos nem contrastes agressivos.
2. **Design Anti-Cardite & Sem Falsa Complexidade:**
   - Evitar modais desnecessários para ações binárias (favoritar/watchlist deve ser **1 clique direto**).
   - Sem caixas dentro de caixas com bordas pesadas.
   - Respiro confortável e tipografia fosca (branco fosco para títulos, cinza neutro para metadados).
3. **Pílula de Ações Rápidas no Hover do Pôster (Letterboxd Style - Seção 3.B de `fix-reviews.md`):**
   - No hover do card de pôster, exibir a barra flutuante compacta translúcida com fundo escuro e cantos arredondados:
     - `Heart`: Curtir / Favoritar (toggle com cor default).
     - `Bookmark`: Watchlist (toggle com cor default).
     - `···`: Menu de contexto com avaliação por estrelas e ações avançadas.
4. **Atualizações Otimistas (Zero Latência Percebida):**
   - Mudança imediata de estado na UI via TanStack Query (`cancelQueries` -> snapshot anterior -> `setQueryData` -> rollback em caso de erro na requisição).

---

## 🗄️ 1. Arquitetura Backend (FastAPI + SQLAlchemy + SQLite)

### 1.1 Modelo Relacional Unificado
- **Tabela:** `user_movie_interactions`
  - `id`: `String(64)` PK (Surrogate SHA-256 ou UUID).
  - `user_id`: `String(128)` (ID do usuário extraído do token JWT `sub`, ex: `admin-rocketfilms-01`).
  - `sk_movie_id`: `String(64)` FK para `dim_movies.sk_movie_id` com `ondelete="CASCADE"`.
  - `is_favorite`: `Boolean`, default `False`, indexado.
  - `in_watchlist`: `Boolean`, default `False`, indexado.
  - `created_at`: `DateTime` com `server_default=func.now()`.
  - `updated_at`: `DateTime` com `server_default=func.now()`, `onupdate=func.now()`.
  - **Constraint:** `UniqueConstraint("user_id", "sk_movie_id", name="uq_user_movie_interaction")`.

### 1.2 Endpoints RESTful (`backend/app/features/user_library/`)
- `GET /api/v1/user/library/ids`
  - Protegido por autenticação JWT (`get_current_admin` / usuário logado).
  - Retorna `{ "favorites": ["sk_movie_id", ...], "watchlist": ["sk_movie_id", ...] }`.
  - *Extremamente leve e rápido:* permite ao frontend carregar de uma só vez o status de todos os cards da tela em uma única requisição cacheada.
- `POST /api/v1/user/library/{sk_movie_id}/favorite`
  - Inverte o estado de `is_favorite` (toggle atômico).
  - Retorna o status atualizado `{ "sk_movie_id": str, "is_favorite": bool, "in_watchlist": bool }`.
- `POST /api/v1/user/library/{sk_movie_id}/watchlist`
  - Inverte o estado de `in_watchlist` (toggle atômico).
  - Retorna o status atualizado `{ "sk_movie_id": str, "is_favorite": bool, "in_watchlist": bool }`.
- `GET /api/v1/user/library/movies`
  - Query params: `type=favorites | watchlist`, `page=1`, `page_size=20`.
  - Retorna lista paginada de filmes completos com dados de exibição (pôster, título, ano, notas).

### 1.3 Testes Automatizados Backend
- Suíte `backend/tests/test_user_library.py`:
  - Toggle de favorito (ligar/desligar).
  - Toggle de watchlist (ligar/desligar).
  - Consulta rápida de IDs de biblioteca.
  - Consulta paginada de filmes da biblioteca.
  - Bloqueio 401 para requisições não autenticadas.

---

## 💻 2. Arquitetura Frontend (TanStack Query + Clean Component Pattern)

### 2.1 Módulo `frontend/src/features/user-library/`
- **`api/userLibraryApi.ts`:**
  - `fetchUserLibraryIds()`
  - `fetchUserLibraryMovies(type, page, pageSize)`
  - `toggleFavoriteMovie(movieId)`
  - `toggleWatchlistMovie(movieId)`
- **`hooks/useUserLibrary.ts`:**
  - Hook TanStack Query gerenciando a chave `['user', 'library', 'ids']`.
  - Helpers: `isFavorite(movieId): boolean` e `inWatchlist(movieId): boolean`.
  - Mutação com **Optimistic Updates** usando o `QueryClient`.
  - Se não autenticado: dispara toast suave informando necessidade de autenticação.

### 2.2 Superfícies de Integração

1. **Menu de Contexto & Ações Rápidas (`MovieQuickActionsMenu.tsx`):**
   - Ativação dos itens de menu antes desativados:
     - Item "Favoritar" / "Favoritado" com ícone `Heart` preenchido no tom âmbar/default suave.
     - Item "Adicionar à Watchlist" / "Na Watchlist" com ícone `Bookmark` preenchido no tom default suave.
2. **Pílula de Hover no Pôster do Catálogo (`MovieGridItemView.tsx`):**
   - Barra flutuante elegante ao passar o mouse contendo o trio de ações compactas (Coração, Watchlist, `···`), seguindo a seção 3.B do `fix-reviews.md`.
3. **Ficha Técnica (`MovieHeaderInfoView.tsx`):**
   - Botões compactos de ação no Hero ao lado das notas:
     - Botão *Favoritar* / *Favorito* (estilo ghost/secondary com transição sutil).
     - Botão *Watchlist* / *Na Watchlist*.
4. **Página de Coleção do Usuário (`/minha-lista`):**
   - Rota autenticada com navegação por tabs discretas:
     - Aba **Favoritos**
     - Aba **Watchlist**
   - Grid cinematográfico responsivo, contador de filmes e Empty State convidativo estilo cinema quando a lista estiver vazia.

### 2.3 Testes Automatizados Frontend
- Testes unitários com Vitest cobrindo:
  - Optimistic updates do hook `useUserLibrary`.
  - Comportamento de clique e toggle nos itens do `MovieQuickActionsMenu`.
  - Renderização dos estados ativo/inativo na Ficha Técnica e Pílula de Hover.
  - Validação estrita de lint (`bun run lint` com 0 erros/warnings) e compilação (`bun run build`).

---

## ⏳ 3. Próxima Etapa Sequencial: Navegação Dinâmica por Anos Distintos

> ⚠️ **Regra de Sequenciamento:** Esta etapa só será iniciada após a conclusão integral e testada de Favoritos & Watchlist.

- **Query Dinâmica no Backend:**
  - `SELECT DISTINCT ano_lancamento FROM dim_movies WHERE ano_lancamento IS NOT NULL ORDER BY ano_lancamento DESC`
- **Endpoint:** `GET /api/v1/movies/available-years`
- **Integração na Command Palette e Catálogo:**
  - Sugestão automática de anos existentes no banco ao digitar ou navegar na Command Palette (ex: *"Filmes de 2024"*, *"Filmes de 1994"*).
  - Filtro dinâmico sem anos "hardcoded".
