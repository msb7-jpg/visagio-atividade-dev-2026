# CineFlow — Catálogo Cinematográfico & Hub Analítico

Sistema moderno e completo para exploração cinematográfica, consulta analítica de desempenho de mercado (ROI, bilheteria, popularidade) e gestão de filmes e avaliações da comunidade.

Construído sob a arquitetura **Vertical Slices**, separando domínios em fatias autônomas e desacopladas, com foco em alta performance, fidelidade editorial cinematográfica e governança estrita de código.

---

## 🛠️ Stack Tecnológica

### Backend
- **Python 3.11+** com gerenciamento de dependências via **uv**.
- **FastAPI**: Endpoints assíncronos de alta performance, documentados automaticamente via Swagger/OpenAPI.
- **SQLAlchemy 2.0 (Async)** com **aiosqlite** e **SQLite**.
- **Alembic**: Versionamento e migrações relacionais contínuas.
- **Autenticação**: Tokens JWT assinados com `pyjwt` e hash de senhas moderno via `pwdlib[argon2]`.
- **Qualidade & Testes**: `pytest`, `pytest-asyncio`, `httpx` e `ruff`.

### Frontend
- **React 19** e **TypeScript 5.9+** alimentados por **Vite 8** e executados com **Bun**.
- **Tailwind CSS v4** e componentes **shadcn/ui** integrados sob paleta escura cinematográfica e tipografia **Geist**.
- **TanStack Query v5** (gerenciamento assíncrono de estado do servidor com cache) e **TanStack Form** (validação type-safe de formulários com **Zod**).
- **Framer Motion**: Animações fluidas, transições orgânicas entre abas e microinterações.
- **Command Palette (`cmdk`)**: Busca rápida (`⌘K`) por título, atalhos para a biblioteca (Favoritos, Watchlist), navegação e ações de administração.
- **Qualidade & Testes**: **Vitest**, **Testing Library**, **ESLint 9+** (com plugins `@shadcn/lint`, `eslint-plugin-react-x`, `eslint-plugin-react-hooks`) e **Fallow**.

---

## 🚀 Passo a Passo de Execução

### 1. Pré-Requisitos
Certifique-se de ter instalado no sistema:
- [Python](https://www.python.org/) 3.11 ou superior
- [uv](https://docs.astral.sh/uv/) (gerenciador rápido de pacotes Python)
- [Bun](https://bun.sh/) (runtime e gerenciador de pacotes JS/TS)

---

### 2. Configuração e Inicialização do Backend

Abra um terminal no diretório raiz do projeto:

```bash
cd backend

# 1. Configurar variáveis de ambiente
cp .env.example .env

# 2. Instalar dependências backend
uv sync --all-extras

# 3. Aplicar as migrações do banco relacional SQLite
uv run alembic upgrade head

# 4. (Opcional/Inicial) Executar o seed dos dados analíticos (Diamond Layer + Reviews)
uv run python scripts/seed_database.py

# 5. Iniciar o servidor de desenvolvimento FastAPI
uv run uvicorn app.main:app --reload --port 8000
```

> **API Disponível em:** `http://localhost:8000`  
> **Documentação Swagger (OpenAPI):** `http://localhost:8000/docs`  
> **Health Check:** `http://localhost:8000/health`

---

### 3. Configuração e Inicialização do Frontend

Em outro terminal:

```bash
cd frontend

# 1. Instalar dependências frontend
bun install

# 2. Iniciar o servidor Vite de desenvolvimento
bun run dev
```

> **Aplicação Web Disponível em:** `http://localhost:5173`

---

### 4. Credenciais de Acesso (Administrador)

Para testar recursos exclusivos de administração (cadastro, edição e exclusão de filmes):
- **Email:** `admin@cinema.com`
- **Senha:** `admin123`

*(A tela de login possui botão de preenchimento automático para testes rápidos).*

---

## 🧪 Execução da Suíte de Testes Automatizados

O projeto conta com ampla cobertura de testes unitários e de integração, garantindo o funcionamento de todas as regras de negócio:

### Testes do Backend (Pytest)
```bash
cd backend
uv run pytest
```
> Executa 37 testes cobrindo autenticação JWT, catálogo paginado, filtros analíticos, busca rápida, ficha técnica completa, recalculo atômico de avaliações, CRUD transacional e persistência de biblioteca do usuário.

### Testes do Frontend (Vitest)
```bash
cd frontend
bun run test
```
> Executa 137 testes unitários e de componentes cobrindo formulários TanStack, hooks customizados, Command Palette, alternador de visualização, modais, estados vazios e biblioteca do usuário.

---

## 🔍 Auditoria de Qualidade & Linters

Para verificar e garantir a aderência aos padrões de código:

### Linter do Frontend (ESLint 9 + shadcn/lint)
```bash
cd frontend
bun run lint
```
*(Garante 0 erros em contratos de design system, ausência de restilizações arbitrárias e pureza do React Compiler).*

### Verificação de Tipos e Build de Produção
```bash
cd frontend
bun run build
```
*(Executa a checagem estrita de tipos do TypeScript com `tsc -b` e compila os bundles otimizados com Vite).*

### Linter do Backend (Ruff)
```bash
cd backend
uv run ruff check .
```
*(Valida conformidade PEP 8, ordenação de imports e boas práticas Python).*

---

## 📂 Estrutura Arquitetural

```text
.
├── backend/
│   ├── app/
│   │   ├── api/v1/          # Roteamento consolidado de endpoints REST
│   │   ├── core/            # Configurações de ambiente, segurança e logging
│   │   ├── db/              # Sessões assíncronas do SQLAlchemy e Base ORM
│   │   ├── features/        # Slices verticais de negócio:
│   │   │   ├── auth/        # Autenticação JWT e dependências de usuário
│   │   │   ├── movies/      # Catálogo, detalhes, CRUD de filmes e métricas
│   │   │   ├── reviews/     # Resenhas e recalculo transacional de notas
│   │   │   ├── metadata/    # Gêneros, produtoras e busca de diretores
│   │   │   └── user_library/# Biblioteca do usuário (Favoritos & Watchlist)
│   │   ├── movies/models.py # Modelos ORM do domínio analítico cinematográfico
│   │   └── shared/          # Utilitários de paginação, documentação e exceções
│   ├── migrations/          # Histórico de revisões Alembic
│   ├── scripts/             # Script de carga em lote (seed_database.py)
│   └── tests/               # Suíte completa de testes assíncronos pytest
│
├── frontend/
│   ├── src/
│   │   ├── components/      # UI base (shadcn/ui), feedback e layout
│   │   ├── features/        # Slices verticais de frontend:
│   │   │   ├── auth/        # Login com Storyset SVGs animados e validação TanStack Form
│   │   │   ├── catalog/     # Catálogo paginado, grid/list, ordenação e dropdowns
│   │   │   ├── command-palette/ # Spotlight ⌘K para títulos e atalhos rápidos
│   │   │   ├── movie-details/   # Ficha técnica editorial, KPIs, equipe e lightbox
│   │   │   ├── movie-admin/     # Formulário de criação/edição com poster preview 2:3
│   │   │   ├── reviews/         # Avaliações com selector de nota 1-10 e modal
│   │   │   └── user-library/    # Minha Lista com abas Favoritos e Watchlist
│   │   ├── lib/             # Clientes globais (api-client, query-client)
│   │   └── routes/          # Definição e proteção de rotas (AppRoutes)
│   └── eslint.config.js     # Configuração estrita de linter e design system
│
├── data/                    # CSVs da camada Diamond e reviews
├── plano-execucao.md        # Documento vivo de rastreabilidade de todas as etapas
└── README.md                # Este documento de referência
```

---

## 🎨 Design System e Diretrizes Visuais
- **Identidade Visual**: Paleta cinematográfica escura com contrastes suaves (`bg-background`, `border-white/10`, `text-muted-foreground`), acentos dourados/âmbar (`primary`) e zero ruído visual.
- **Anti-Cardite**: Layouts fluidos e contínuos que valorizam o conteúdo textual, dados e pôsteres, evitando o excesso de cartões com bordas pesadas.
- **Governança de Componentes**: Primitivas shadcn encapsulam estilos e tamanhos próprios, prevenindo quebras de design por classes arbitrárias.
