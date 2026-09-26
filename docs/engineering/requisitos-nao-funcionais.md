# Especificação de Requisitos Não Funcionais (RNF) & Mapa Tecnológico

> **Projeto:** Sistema de Avaliação e Catálogo de Filmes (Estilo Letterboxd / Visagio RocketLab 2026.2)  
> **Versão:** 1.0.0  
> **Status:** Aprovado para Implementação  
> **Documentos de Referência:** `Atividade de Dev.pdf`, `plan.md`, `frontend/README.md`, `frontend/eslint.config.js`, `frontend/vite.config.ts`, `references/`

---

## 1. Visão Geral da Arquitetura

O sistema é composto por duas aplicações principais desacopladas:
1. **Frontend SPA:** Desenvolvido em **React 19**, **TypeScript** e **Vite**, adotando **React Router v7** para roteamento e sincronização de URL, **TanStack Query** para cache de servidor e **TanStack Form** para formulários tipados. A interface adota **Tailwind CSS v4**, **shadcn/ui** e componentes visuais do **Aceternity UI**, inspirando-se no Letterboxd e referências retrô/cinematográficas modernas.
2. **Backend API:** Desenvolvido em **FastAPI** (Python 3.11+), com persistência relacional assíncrona utilizando **SQLAlchemy 2.0**, **aiosqlite** e **Alembic** para migrações, consumindo a base analítica de filmes (`dim_movies`, `fact_movies_performance`, `movies_reviews`, etc.) em **SQLite**.

---

## 2. Catálogo de Requisitos Não Funcionais (RNF)

| ID | Categoria | Descrição Sucinta | Prioridade |
| :--- | :--- | :--- | :---:|
| **RNF01** | **Tecnologia & Build** | Frontend SPA com Vite 6/8, React 19, TypeScript em modo estrito e Bun como package manager. | Alta |
| **RNF02** | **Roteamento & URL State** | React Router v7 com sincronização declarativa de filtros/busca/ordenação/paginação diretamente na URL (`useSearchParams`). | Alta |
| **RNF03** | **Gerenciamento de Estado & Cache** | TanStack Query v5 para cache de requisições, invalidação automática em mutações e prefetching na navegação. | Alta |
| **RNF04** | **Formulários & Validação** | TanStack Form integrado ao Zod para validação síncrona/assíncrona de campos obrigatórios, regras de nota (0 a 10) e feedback inline. | Alta |
| **RNF05** | **Design System & Estilização** | Tailwind CSS v4 + shadcn/ui (estilo consistente com tokens semânticos) + componentes interativos da Aceternity UI. | Alta |
| **RNF06** | **Command Palette (Spotlight)** | Barra de comandos global (`cmdk` / shadcn Command) acionável por teclado (`Cmd+K` / `Ctrl+K`), backdrop blur intenso, animações de entrada/saída e busca rápida. | Média |
| **RNF07** | **Qualidade de Código & Linting** | ESLint 9+ Flat Config com regras estritas de tipagem (`@typescript-eslint`), padronização estilística (`@stylistic`), regras React modernas (`eslint-plugin-react-x`, `eslint-plugin-react-dom`), `@shadcn/lint` e TSDoc. | Alta |
| **RNF08** | **Mapeamento de Módulos (Aliases)** | Suporte a imports absolutos com `@/*` mapeando para `./src/*` em todo o código frontend, validado via regra de lint `no-restricted-imports`. | Alta |
| **RNF09** | **Testabilidade & Testes Automatizados** | Frontend: Vitest + React Testing Library + MSW (Mock Service Worker). Backend: Pytest + Pytest-asyncio + HTTPX. | Alta |
| **RNF10** | **Documentação de Componentes** | Storybook 8 configurado com Vite para documentar componentes atômicos (botões, cards, dialogs, inputs, command palette). | Média |
| **RNF11** | **Performance & Otimização** | Code-splitting por rotas, Lazy Loading de imagens de pôsteres, debounce em buscas e cache otimizado com `staleTime`. | Média |
| **RNF12** | **Segurança & Autenticação** | Módulo de autenticação para Administrador (JWT), rotas protegidas no frontend e validação de permissões para ações de CRUD (criar/editar/excluir filme). | Alta |
| **RNF13** | **Persistência & Carga de Dados** | Backend FastAPI assíncrono com SQLAlchemy 2.0 e Alembic; script automatizado de ingestão dos CSVs da camada Diamond e `movies_reviews.csv`. | Alta |
| **RNF14** | **Responsividade & Acessibilidade** | Layout Mobile-First responsivo, compatível com Grid/List view toggle, suporte a navegação por teclado e conformidade com WCAG 2.1 AA. | Média |

---

## 3. Detalhamento dos Requisitos Não Funcionais

### RNF01 — Tecnologia, Compilação e Gerenciador de Pacotes
- **Package Manager:** `bun` no frontend para instalação ultra-rápida e scripts determinísticos baseados no `bun.lock`.
- **Runtime & Build:** `vite` configurado com HMR (Hot Module Replacement) instantâneo e suporte ao TypeScript `5.x+`/`6.x`.
- **Backend:** Python `>= 3.11`, gerenciado via `uv` ou `pip` com suporte a ambiente virtual `.venv`.

### RNF02 — Roteamento & Sincronização de URL (React Router v7)
- Roteamento declarativo SPA com `react-router-dom` (v7), estruturando páginas de catálogo (`/`), detalhes de filme (`/filmes/:id`) e autenticação.
- **Estado na URL:** Paginação (`page`), busca (`q`), filtros (gênero, ano, produtoras) e modo de visualização (`view=grid|list`, conforme `sort-by-block-and-list.png`) sincronizados na query string via hook `useSearchParams`, permitindo compartilhamento de links e histórico nativo do navegador.
- Suporte a navegação fluida e proteção de rotas administrativas via componentes de layout / rotas guardadas.

### RNF03 — Server State & Cache (TanStack Query)
- Todo consumo de endpoints da API FastAPI deve ser orquestrado via `@tanstack/react-query`.
- **Políticas de Cache:**
  - `staleTime`: 5 minutos para listagens de catálogo e detalhes de filmes.
  - `gcTime`: 15 minutos para limpeza de memória.
- **Invalidação Seletiva:** Criação/edição/remoção de filmes e inclusão de avaliações devem disparar mutações (`useMutation`) com invalidação precisa das queries de listagem e detalhes (`invalidateQueries`).
- **Prefetching:** Ao fazer hover sobre um card de filme no catálogo ou resultado na Command Palette, disparar prefetch dos detalhes do filme.

### RNF04 — Gerenciamento de Formulários e Validação (TanStack Form + Zod)
- Formulários de Cadastro de Filme, Edição de Filme e Nova Avaliação construídos com `@tanstack/react-form` acoplado ao `zod` via `@tanstack/zod-form-adapter`.
- **Campos Obrigatórios & Feedback:** Apresentação de indicadores visuais de campo obrigatório (tooltip e asterisco conforme referência `required-fields.png`).
- Mensagens de erro contextualizadas e validação em tempo real (`onChange` / `onBlur`).

### RNF05 — Design System & UI Interativa (Tailwind v4 + shadcn/ui + Aceternity)
- **Tailwind CSS v4:** Configuração nativa via `@tailwindcss/vite` e tema centralizado em `@theme` no CSS.
- **shadcn/ui:** Primitives acessíveis para formulários (`Field`, `Input`, `Select`, `Textarea`), dialogs, botões, badges, toggles e cards.
- **Aceternity UI:** Efeitos visuais refinados conforme especificado no `plan.md`:
  - `wavy-background`: Fundo estilizado com ondas dinâmicas na landing/hero section.
  - `layout-text-flip`: Animação dinâmica de transição de gêneros cinematográficos na tela de login/boas-vindas.
  - `expandable-card`: Abertura e expansão fluida ao clicar em uma resenha para ler o texto completo.
  - `tooltip-card`: Tooltips enriquecidos com informações rápidas sobre notas, diretores e gêneros.

### RNF06 — Command Palette Global (`cmdk` / shadcn Command)
- Ativação via atalho global de teclado: `Ctrl + K` (Windows/Linux) ou `Cmd + K` (macOS).
- **Efeito Visual:** Overlay modal com animação de fade-in e scale, além de **backdrop blur intenso** cobrindo o restante da aplicação.
- **Feedback Interativo:** Realce sonoro/visual nos itens ao passar o cursor ou navegar pelas setas.
- Ações rápidas: Buscar filmes instantaneamente, filtrar por gêneros favoritos, alternar entre modos de visualização (Grid/List) e atalhos de administração.

### RNF07 — Padrões de Código, Tipagem & Linting
- **ESLint 9+ Flat Config (`eslint.config.js`):**
  - `@typescript-eslint/recommended-type-checked` e regras de estrita tipagem.
  - `@stylistic/eslint-plugin`: Padronização de identação (2 espaços), aspas simples, sem ponto-e-vírgula desnecessário, quebra de linha no fim do arquivo.
  - `eslint-plugin-react-x` e `eslint-plugin-react-dom`: Regras modernas específicas de boas práticas React 19.
  - `eslint-plugin-tsdoc`: Validação de documentação de interfaces e funções públicas.
  - `@shadcn/lint`: Auditoria de regras e conformidade de componentes shadcn/ui.
  - `eslint-plugin-tailwindcss`: Validação de classes utilitárias e ordenação.

### RNF08 — Import Path Aliases
- Configuração obrigatória do alias `@` apontando para a raiz do código fonte `frontend/src`:
  - `vite.config.ts`: `resolve.alias: { '@': path.resolve(__dirname, './src') }`.
  - `tsconfig.app.json` / `tsconfig.json`: `"paths": { "@/*": ["src/*"] }`.
  - Regra ESLint `no-restricted-imports` proibindo caminhos relativos longos (`../../`).

### RNF09 — Testes Automatizados & Pirâmide de Testes
- **Frontend:**
  - **Vitest:** Executor de testes rápido integrado ao pipeline do Vite.
  - **React Testing Library & @testing-library/jest-dom:** Testes de componentes (renderização de cards, formulários de avaliação, modais).
  - **MSW (Mock Service Worker):** Interceptação de chamadas de rede no nível de teste para testar estados de carregamento, sucesso e erro das queries TanStack sem bater na API real.
- **Backend:**
  - **Pytest + Pytest-asyncio + HTTPX AsyncClient:** Testes de integração de endpoints da API FastAPI (criação de filmes, busca paginada, postagem de review, cálculo de médias).


### RNF11 — Performance, Carregamento & Caching
- **Code Splitting:** Divisão automática de bundles por rota.
- **Image Optimization:** Pôsteres de filmes carregados com `loading="lazy"` e fallback para placeholder elegante quando a imagem falhar ou não existir.
- **Debounce de Pesquisa:** Input de pesquisa na Command Palette e na barra de filtros com debounce de 300ms antes de disparar requisições.

### RNF12 — Segurança, Autenticação & Autorização
- **Autenticação:** Suporte a login administrativo com emissão de token JWT (`access_token`).
- **Guarda de Rotas (Frontend):** Rotas de administração (adicionar filme, editar, remover) protegidas; redirecionamento de usuários não autenticados.
- **Segurança da API:** Validação rigorosa de payloads via schemas Pydantic v2; ativação de `CORSMiddleware` no FastAPI restringindo origens para o frontend (`http://localhost:5173`).

### RNF13 — Carga de Dados e Integridade do Banco
- Script automatizado em Python (ex: `backend/scripts/seed_database.py`) para processar os arquivos CSV localizados em `data/` (`dim_movies.csv`, `dim_genres.csv`, `bridge_*`, `movies_reviews.csv`) e inseri-los no SQLite via SQLAlchemy 2.0 / Alembic.
- Transações atômicas com tratamento de valores nulos e parsing de formatos numéricos e datas.

---

## 4. Mapeamento Completo de Instalações e Ferramental

### 4.1 Frontend — Pacotes a Instalar

O `package.json` atual já contém:
- `react`, `react-dom` (^19.2.8)
- `react`, `react-dom` (^19.2.8)
- `react-router-dom` (^7.18.4)
- `@tanstack/react-query` (^5.103.2)
- `@tanstack/react-form` (^1.33.5)
- `@tailwindcss/vite` (^4.3.3), `tailwindcss` (^4.3.3)

#### Dependências de Produção Necessárias
```bash
cd frontend
bun add react-router-dom zod @tanstack/zod-form-adapter clsx tailwind-merge class-variance-authority lucide-react cmdk framer-motion simplex-noise axios jwt-decode
```

| Pacote | Finalidade |
| :--- | :--- |
| `react-router-dom` | Roteamento declarativo SPA e manipulação de histórico e query params |
| `zod` | Esquemas de validação de dados compartilhados entre rotas, formulários e respostas da API |
| `jwt-decode` | Decodificação instantânea do token JWT no cliente para inspeção de expiração (`exp`), subject (`sub`) e controle síncrono de sessão sem roundtrips |
| `@tanstack/zod-form-adapter` | Validador oficial do TanStack Form integrado ao Zod |
| `clsx` + `tailwind-merge` | Função utilitária `cn()` para concatenação condicional de classes do Tailwind |
| `class-variance-authority` | Criação de variantes de componentes com tipagem estrita (CVA) |
| `lucide-react` | Coleção de ícones vetoriais padronizada do projeto |
| `cmdk` | Primitive da barra de comandos (Command Palette) para shadcn |
| `framer-motion` | Motor de animações para componentes do Aceternity UI e transições de tela |
| `simplex-noise` | Geração procedural matemática de ruído para o efeito visual `wavy-background` |
| `axios` | Cliente HTTP com suporte a instâncias, interceptors de autenticação e cancelamento |

#### Dependências de Desenvolvimento Necessárias
```bash
cd frontend
bun add -d @tanstack/react-query-devtools @stylistic/eslint-plugin eslint-plugin-tsdoc eslint-plugin-react-x eslint-plugin-react-dom @shadcn/lint vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom msw @vitest/coverage-v8 vite-tsconfig-paths
```

| Pacote | Finalidade |
| :--- | :--- |
| `@tanstack/react-query-devtools` | Painel visual para inspecionar queries em cache, status de refetch e mutations |
| `@stylistic/eslint-plugin` | Regras estilísticas e de formatação de código no ESLint Flat Config |
| `eslint-plugin-tsdoc` | Validador sintático de documentação TSDoc no ESLint |
| `eslint-plugin-react-x` + `eslint-plugin-react-dom` | Regras modernas recomendadas pelo template Vite para React 19 |
| `@shadcn/lint` | Linter oficial para garantir conformidade das boas práticas do shadcn |
| `vitest` + `jsdom` | Test runner ultrarrápido baseado no pipeline Vite com DOM simulado |
| `@testing-library/react` | Utilitários de teste orientados a comportamento de componentes |
| `@testing-library/jest-dom` + `user-event` | Matchers semânticos de DOM e simulação de cliques/digitação |
| `msw` | Mock de requisições de rede para testes isolados e reproduzíveis |
| `@vitest/coverage-v8` | Relatório de cobertura de código dos testes automatizados |
| `vite-tsconfig-paths` | Resolução automática de path aliases (`@/*`) no Vite baseada no `tsconfig.json` |

#### Configuração do Storybook
Para inicializar o Storybook 8 com Vite:
```bash
cd frontend
bunx storybook init --type react --builder vite
```

---

### 4.2 Backend — Dependências Adicionais

O `backend/pyproject.toml` já possui:
- `fastapi`, `uvicorn[standard]`, `sqlalchemy`, `aiosqlite`, `pydantic`, `pydantic-settings`, `alembic`
- Dev: `pytest`, `pytest-asyncio`, `httpx`, `ruff`

#### Dependências de Segurança & Autenticação a Adicionar no Backend:
```bash
cd backend
.venv/bin/pip install "pyjwt[crypto]>=2.9.0" "pwdlib[argon2]>=0.2.0" "python-multipart>=0.0.12"
```
*(Ou via `uv add pyjwt pwdlib python-multipart`)*

---

## 5. Matriz de Rastreabilidade: Requisitos do Desafio vs Tecnologias

| Requisito do Documento / PDF | Implementação Técnica Proposta | Bibliotecas / Ferramentas |
| :--- | :--- | :--- |
| **Cadastro de filmes** (título, diretor, ano, gênero, sinopse) | Formulário tipado com feedback inline e validação de campos obrigatórios (`required-fields.png`) | `TanStack Form` + `Zod` + `shadcn/ui Form` |
| **Catálogo paginado** com visualização flexível | Tabela ou grade com alternância dinâmica Grid/List (`sort-by-block-and-list.png`) | `React Router` (`useSearchParams` `page`, `view`) + `shadcn ToggleGroup` |
| **Detalhes do filme & histórico de avaliações** | Rota `/filmes/:id`, cards expansíveis para resenhas longas | `React Router` + `TanStack Query` (detalhes + reviews) + Aceternity `expandable-card` |
| **Barra de pesquisa & Command Palette** | Input com debounce de 300ms e Spotlight global via atalho `Cmd+K` | `cmdk` + `shadcn Command` com backdrop blur intenso e animações |
| **Remover e atualizar filmes** (CRUD Administrador) | Diálogos de confirmação acessíveis e mutações com invalidação imediata de cache | `shadcn AlertDialog` + `TanStack Query` (`useMutation`) |
| **Adicionar nova avaliação** (nota 0 a 10 e resenha) | Modal ou drawer com seletor interativo de estrelas e textarea validado | `TanStack Form` + `StarRating` + `shadcn Dialog` |
| **Média geral das avaliações** | Cálculo no banco/backend exposto no schema Pydantic e badges visuais | `SQLAlchemy` (agregações `func.avg`) + `shadcn Badge` |
| **Filtros e Responsividade** | Filtro por múltiplos gêneros e ordenação sincronizados na URL; layout mobile-first | `React Router` + `Tailwind CSS v4` |
| **Caching de Consultas** | Persistência em memória de queries frequentes e prefetching no hover | `TanStack Query v5` (`staleTime: 5min`) |
| **Documentação viva** | Catálogo interativo de componentes e estados de interface | `Storybook 8` |
| **Testes Automatizados** | Testes unitários, de componentes e de API cobrindo os fluxos principais | `Vitest` + `Testing Library` + `MSW` + `Pytest` |

---

## 6. Próximos Passos de Execução

1. **Instalação das dependências do Frontend:** Executar comandos com `bun add` e `bun add -d`.
2. **Ajuste de Configurações Base:**
   - Atualizar `frontend/vite.config.ts` com plugins Vite (`@vitejs/plugin-react`, `@tailwindcss/vite`) e resolução de aliases `@`.
   - Atualizar `frontend/tsconfig.json` e `tsconfig.app.json` para suportar `@/*`.
   - Configurar `frontend/eslint.config.js` ativando regras de `@stylistic`, `@typescript-eslint`, React moderno e `@shadcn/lint`.
   - Inicializar `shadcn` (`bunx --bun shadcn@latest init`).
3. **Setup de Testes & Storybook:** Criar `vitest.config.ts`, setup do MSW e comando `bun run storybook`.
4. **Backend Seed Script:** Criar rotina de carga em Python para popular o SQLite a partir dos arquivos CSV da pasta `data/`.
