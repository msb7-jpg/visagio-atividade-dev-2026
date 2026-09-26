#!/usr/bin/env bash
# ==============================================================================
# CineFlow — Script de Orquestração, Setup Inteligente e Execução (setup.sh)
# ==============================================================================

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$PROJECT_ROOT/backend"
FRONTEND_DIR="$PROJECT_ROOT/frontend"
DATA_DIR="$PROJECT_ROOT/data"
DB_PATH="$BACKEND_DIR/rocketlab.db"

# Cores para formatação no terminal
C_RESET="\033[0m"
C_BOLD="\033[1m"
C_CYAN="\033[36m"
C_GREEN="\033[32m"
C_YELLOW="\033[33m"
C_RED="\033[31m"

echo -e "\n${C_BOLD}${C_CYAN}🎬 [CineFlow] Iniciando orquestrador do sistema...${C_RESET}\n"

# ------------------------------------------------------------------------------
# 1. Verificação de Ferramentas / Pré-requisitos
# ------------------------------------------------------------------------------
echo -e "${C_CYAN}🔍 Verificando ferramentas instaladas...${C_RESET}"

if ! command -v uv &> /dev/null; then
  echo -e "${C_RED}❌ Erro: 'uv' não encontrado. Instale o uv (https://docs.astral.sh/uv/) e tente novamente.${C_RESET}"
  exit 1
fi

if ! command -v bun &> /dev/null; then
  echo -e "${C_RED}❌ Erro: 'bun' não encontrado. Instale o Bun (https://bun.sh/) e tente novamente.${C_RESET}"
  exit 1
fi

if ! command -v python3 &> /dev/null; then
  echo -e "${C_RED}❌ Erro: 'python3' não encontrado.${C_RESET}"
  exit 1
fi

echo -e "${C_GREEN}   ✓ uv, bun e python3 disponíveis.${C_RESET}"

# ------------------------------------------------------------------------------
# 2. Configuração de Variáveis de Ambiente
# ------------------------------------------------------------------------------
if [ ! -f "$BACKEND_DIR/.env" ]; then
  echo -e "${C_YELLOW}⚙️  Arquivo .env ausente no backend. Criando a partir de .env.example...${C_RESET}"
  if [ -f "$BACKEND_DIR/.env.example" ]; then
    cp "$BACKEND_DIR/.env.example" "$BACKEND_DIR/.env"
  else
    cat <<EOF > "$BACKEND_DIR/.env"
ENVIRONMENT=local
PROJECT_VERSION=2026.2
DATABASE_URL=sqlite+aiosqlite:///./rocketlab.db
BACKEND_CORS_ORIGINS=["http://localhost:5173"]
LOG_LEVEL=INFO
EOF
  fi
  echo -e "${C_GREEN}   ✓ $BACKEND_DIR/.env criado.${C_RESET}"
fi

# ------------------------------------------------------------------------------
# 3. Sincronização de Dependências
# ------------------------------------------------------------------------------
echo -e "\n${C_CYAN}📦 Sincronizando dependências do Backend (uv sync)...${C_RESET}"
(cd "$BACKEND_DIR" && uv sync --all-extras)

echo -e "\n${C_CYAN}📦 Verificando dependências do Frontend (bun install)...${C_RESET}"
if [ ! -d "$FRONTEND_DIR/node_modules" ]; then
  (cd "$FRONTEND_DIR" && bun install)
else
  echo -e "${C_GREEN}   ✓ node_modules já presente no frontend.${C_RESET}"
fi

# ------------------------------------------------------------------------------
# 4. Detecção de Estado do Banco de Dados & Ingestão
# ------------------------------------------------------------------------------
echo -e "\n${C_CYAN}🗄️  Analisando estado da base de dados ($DB_PATH)...${C_RESET}"

NEEDS_MIGRATIONS=false
NEEDS_SEED=false

if [ ! -f "$DB_PATH" ] || [ ! -s "$DB_PATH" ]; then
  echo -e "${C_YELLOW}⚠️  Banco de dados não encontrado ou vazio. Setup inicial necessário!${C_RESET}"
  NEEDS_MIGRATIONS=true
  NEEDS_SEED=true
else
  # Verifica se a tabela principal existe e possui dados
  MOVIES_COUNT=$(python3 -c "
import sqlite3
try:
    conn = sqlite3.connect('$DB_PATH')
    c = conn.cursor()
    c.execute('SELECT COUNT(*) FROM dim_movies')
    print(c.fetchone()[0])
    conn.close()
except Exception:
    print('0')
" 2>/dev/null || echo "0")

  if [ "$MOVIES_COUNT" -eq "0" ]; then
    echo -e "${C_YELLOW}⚠️  Banco existe mas sem registros em 'dim_movies' (count: 0). Re-executando seed...${C_RESET}"
    NEEDS_MIGRATIONS=true
    NEEDS_SEED=true
  else
    echo -e "${C_GREEN}   ✓ Banco de dados populado detectado (${MOVIES_COUNT} filmes cadastrados).${C_RESET}"
    NEEDS_MIGRATIONS=true
  fi
fi

# ------------------------------------------------------------------------------
# 5. Execução de Migrações e Seed
# ------------------------------------------------------------------------------
if [ "$NEEDS_MIGRATIONS" = true ]; then
  echo -e "${C_CYAN}🔄 Aplicando migrações relacionais (Alembic)...${C_RESET}"
  (cd "$BACKEND_DIR" && uv run alembic upgrade head)
  echo -e "${C_GREEN}   ✓ Migrações aplicadas com sucesso.${C_RESET}"
fi

if [ "$NEEDS_SEED" = true ]; then
  echo -e "\n${C_CYAN}🌱 Verificando arquivos CSV para ingestão de dados em $DATA_DIR...${C_RESET}"
  if [ -d "$DATA_DIR" ] && [ -f "$DATA_DIR/dim_movies.csv" ]; then
    echo -e "${C_GREEN}   ✓ CSVs encontrados. Executando seed_database.py (isso pode levar ~25s)...${C_RESET}"
    (cd "$BACKEND_DIR" && uv run python scripts/seed_database.py)
    echo -e "${C_GREEN}   ✓ Ingestão analítica concluída com sucesso!${C_RESET}"
  else
    echo -e "${C_RED}❌ ERRO: Pasta data/ ou dim_movies.csv não encontrados em $DATA_DIR.${C_RESET}"
    echo -e "${C_RED}   Certifique-se de posicionar os CSVs da atividade em data/ para realizar a ingestão.${C_RESET}"
    exit 1
  fi
fi

# ------------------------------------------------------------------------------
# 6. Execução Conjunta: Backend FastAPI + Frontend Vite
# ------------------------------------------------------------------------------
echo -e "\n${C_BOLD}${C_GREEN}🚀 Tudo pronto! Iniciando servidores...${C_RESET}"
echo -e "   • Backend FastAPI: ${C_BOLD}http://localhost:8000${C_RESET} (Docs: http://localhost:8000/docs)"
echo -e "   • Frontend React:  ${C_BOLD}http://localhost:5173${C_RESET}"
echo -e "   • Pressione ${C_BOLD}Ctrl+C${C_RESET} para encerrar ambos os serviços.\n"

cleanup() {
  echo -e "\n${C_YELLOW}🛑 Encerrando servidores...${C_RESET}"
  kill 0
  exit 0
}

trap cleanup SIGINT SIGTERM EXIT

# Inicia backend em background
(cd "$BACKEND_DIR" && uv run uvicorn app.main:app --reload --port 8000) &
BACKEND_PID=$!

# Inicia frontend em background
(cd "$FRONTEND_DIR" && bun run dev) &
FRONTEND_PID=$!

# Aguarda ambos os processos
wait $BACKEND_PID $FRONTEND_PID
