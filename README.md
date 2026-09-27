# CineFlow — Catálogo Cinematográfico & Hub Analítico

<div align="center">

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-UI_Components-000000?style=for-the-badge&logo=shadcnui&logoColor=white)](https://ui.shadcn.com)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-v5-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)](https://tanstack.com/query)
[![SQLite](https://img.shields.io/badge/SQLite-aiosqlite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://sqlite.org)
[![uv](https://img.shields.io/badge/Package_Manager-uv-DE5FE9?style=for-the-badge&logo=astral&logoColor=white)](https://docs.astral.sh/uv/)
[![Bun](https://img.shields.io/badge/Runtime-Bun-F472B6?style=for-the-badge&logo=bun&logoColor=black)](https://bun.sh)

Plataforma cinematográfica completa inspirada no Letterboxd, integrando catálogo analítico de alta performance, ficha técnica editorial, sistema de avaliações comunitárias, biblioteca pessoal e painel administrativo para gestão de obras.

</div>

---

## 🎬 Demonstração & Mídias da Aplicação

### 🎥 Demonstração em Vídeo & Animações


#### 1. Visão Geral do Catálogo & Navegação Fluida
![Visão Geral do Catálogo](media/video-replacement/catalog-page-overviewmp4.gif)

---

#### 2. Ações de Menu de Contexto, Avaliação, Favoritos & Watchlist
![Menu de Contexto e Ações](media/video-replacement/catalog-page-context-menu-review-favorite-add-to-list.gif)

---

#### 3. Command Palette (⌘K) — Busca Global & Navegação Cross-App Instantânea
![Command Palette & Navegação Cross-App](media/video-replacement/catalog-page-using-command-pallete-to-navigate-cross-app.gif)

---

#### 4. Autenticação Administrativa & Microinterações de Login
![Login Administrativo](media/video-replacement/login-page-overview-mp4.gif)

---

### 📸 Telas e Fluxos Principais

#### Catálogo & Modos de Visualização
| Catálogo em Grid (Pôsteres 2:3) | Catálogo em Lista Analítica |
| :---: | :---: |
| ![Catálogo Grid](media/catalog-page-block.png) | ![Catálogo Lista](media/catalog-page-list.png) |

#### Ficha Técnica Editorial & Avaliações
| Ficha Técnica & Backdrop Panorâmico | Avaliação & Nova Resenha |
| :---: | :---: |
| ![Ficha Técnica](media/films-page-overview.png) | ![Modal de Resenha](media/films-page-review-add-or-edit.png) |

#### Gestão de Obras & Biblioteca Pessoal
| Cadastro / Edição com Live Poster Preview | Minha Biblioteca (Favoritos & Watchlist) |
| :---: | :---: |
| ![Formulário de Filme](media/films-page-create-or-edit.png) | ![Minha Lista](media/my-list-page-overview.png) |

---

## 🎯 Histórias de Usuário & Funcionalidades

O sistema foi desenhado a partir dos requisitos centrais da especificação oficial e expandido com recursos de ponta:

- **Navegação no Catálogo Paginado:**
  - Alternância imediata entre visualização em **Grid (Cards 2:3)** e **Lista Analítica**.
  - Filtros dinâmicos por **Gênero** e **Ano de Lançamento** (alimentados diretamente do banco de dados).
  - Ordenação multicritério por Popularidade, Nota dos Usuários, Bilheteria (USD), Ano de Lançamento e Título.
- **Busca Global e Instantânea:**
  - Barra de pesquisa integrada in-page e **Command Palette (`⌘K` / `Ctrl+K`)** para busca em tempo real com debouncing e navegação via teclado.
- **Ficha Técnica & Comparativo Analítico:**
  - Dados completos da obra (sinopse, duração formatada, diretor, roteiristas, estúdios e elenco principal).
  - **Comparador de Notas:** Avaliação média interna do CineFlow vs. TMDb vs. IMDb.
  - **Painel Financeiro & Métricas:** Orçamento, faturamento global, ROI consolidado (USD/BRL) e índice de popularidade.
  - Lightbox para ampliação do pôster em alta definição.
- **Comunidade & Avaliações:**
  - Submissão de novas avaliações com notas de **1 a 10** e resenha em texto.
  - Recálculo atômico e transacional da nota média e total de avaliações do filme.
  - Histórico de resenhas com cards interativos e expansão suave de comentários longos.
- **Biblioteca Pessoal do Usuário (Minha Lista):**
  - Salvar em **Favoritos** e **Watchlist** em 1 clique (na pílula de hover do pôster, no menu de contexto ou na ficha técnica).
  - **Optimistic Updates:** Feedback visual instantâneo sem congelar a interface.
  - Aba unificada `/minha-lista` para gerenciar as obras salvas.
- **Administração de Catálogo (CRUD Completo):**
  - Autenticação segura com emissão de token JWT (`admin@rocketfilms.com` / `admin123`).
  - Cadastro de novos filmes com validação em tempo real e **Live Poster Preview 2:3**.
  - Edição de filmes existentes com recuperação de rascunhos.
  - Exclusão segura com diálogo de confirmação destrutivo e remoção em cascata.

---

## 🚀 Como Executar o Projeto

### 1. Pré-Requisitos e Arquivos de Dados (CSV)

O projeto depende de **Python 3.11+**, [**uv**](https://docs.astral.sh/uv/) e [**Bun**](https://bun.sh/).

> ⚠️ **IMPORTANTE (Arquivos CSV Necessários):**  
> A ingestão de dados analíticos requer que os arquivos CSV fornecidos estejam presentes no diretório raiz `data/`:
> - `dim_movies.csv`
> - `dim_genres.csv`
> - `dim_companies.csv`
> - `dim_people.csv`
> - `bridge_movie_genre.csv`
> - `bridge_movie_company.csv`
> - `bridge_movie_person.csv`
> - `fact_movies_performance.csv`
> - `dim_reviews.csv`
> - `movies_reviews.csv`

---

### 2. Inicialização Rápida em Um Comando (Recomendado)

O repositório inclui o script inteligente [`setup.sh`](setup.sh) que automatiza todo o fluxo: detecta se o banco de dados já existe e está populado, aplica migrações do Alembic, sincroniza dependências (`uv` e `bun`), executa o seed analítico caso necessário e sobe ambos os servidores (FastAPI + Vite) concorrentemente:

```bash
# Na raiz do projeto:
./setup.sh
```

---

### 3. Configuração Manual Passo a Passo (Opcional)

Caso prefira rodar cada etapa manualmente em terminais separados:

#### Backend (FastAPI + SQLite + Alembic)
```bash
cd backend

# 1. Copiar variáveis de ambiente de exemplo
cp .env.example .env

# 2. Sincronizar o ambiente virtual e instalar dependências via uv
uv sync --all-extras

# 3. Aplicar as migrações do banco de dados relacional via Alembic
uv run alembic upgrade head

# 4. Executar o script de seed para popular o banco com os CSVs de data/
uv run python scripts/seed_database.py

# 5. Iniciar o servidor de desenvolvimento FastAPI
uv run uvicorn app.main:app --reload --port 8000
```

- **API REST:** `http://localhost:8000`
- **Documentação Interativa (Swagger/OpenAPI):** `http://localhost:8000/docs`
- **Health Check:** `http://localhost:8000/health`

---

### 3. Configuração do Frontend (Vite + React 19 + Bun)

Em outro terminal:

```bash
cd frontend

# 1. Instalar dependências com Bun
bun install

# 2. Iniciar o servidor de desenvolvimento Vite
bun run dev
```

- **Aplicação Web:** `http://localhost:5173`

#### Credenciais de Acesso (Administrador)
- **E-mail:** `admin@rocketfilms.com`
- **Senha:** `admin123`
*(A tela de login possui botão de preenchimento automático para testes rápidos).*

---

### 4. Testes Automatizados & Qualidade de Código

```bash
# Testes do Backend (Pytest assíncrono - 37 testes)
cd backend && uv run pytest

# Testes do Frontend (Vitest - 143 testes)
cd frontend && bun run test

# Linters e Checagem de Tipos
cd backend && uv run ruff check .
cd frontend && bun run lint && bun run build

# Detecção de Código Morto & Dependências Não Utilizadas (Fallow)
cd frontend && bun run fallow

# Manutenção & Sincronização do Tailwind CSS v4 (@tailwindcss/upgrade)
cd frontend && bun run tailwind-upgrade
```

#### Ferramentas de Auditoria & Qualidade:
- **`fallow` (`bun run fallow`):** Analisador estático que detecta **dead code**, dependências não utilizadas em `package.json`, exports órfãos e arquivos não referenciados na árvore de módulos do frontend, mantendo o bundle enxuto.
- **`tailwind-upgrade` (`bun run tailwind-upgrade`):** Utilitário oficial (`@tailwindcss/upgrade`) que audita e migra automaticamente classes utilitárias depreciadas, configurações legadas e sintaxes para o padrão nativo do **Tailwind CSS v4 (engine Oxide)**.
- **`ruff` & `eslint`:** Validação estrita de linting e boas práticas tanto no Python 3.11+ (regras PEP 8, imports limpos) quanto no TypeScript 5.9+ / React 19.

---

## 🏛️ Arquitetura em Vertical Slices

Ao invés de camadas horizontais que espalham a mesma funcionalidade por diretórios técnicos distantes, o CineFlow adota **Vertical Slice Architecture**. Cada domínio de funcionalidade agrupa suas próprias rotas, contratos de dados, regras de negócio e componentes de interface.

## 📖 Documentação Detalhada

Para guias aprofundados de arquitetura, design system, boas práticas e planejamento, consulte a pasta [`docs/`](docs/README.md):
- [**docs/architecture/**](docs/architecture/ARQUITETURA.md): Decisões arquiteturais, contratos de dados e diretrizes de backend.
- [**docs/design/**](docs/design/DESIGN.md): Tokens semânticos, paleta escura cinematográfica e design system shadcn.
- [**docs/engineering/**](docs/engineering/GUIDELINES.md): Boas práticas com React 19, hooks e requisitos não-funcionais.
- [**docs/planning/**](docs/planning/plano-execucao.md): Plano de execução detalhado com checklist e rastreabilidade de todas as fatias verticais.
- [**docs/specs/**](docs/specs/atividade-dev.md): Requisitos funcionais da especificação oficial.

