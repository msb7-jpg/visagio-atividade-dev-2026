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
# 1. Verificação de Ferramentas / Pré-requisitos & Detecção de Fallbacks
# ------------------------------------------------------------------------------
echo -e "${C_CYAN}🔍 Verificando ferramentas instaladas e selecionando runtimes...${C_RESET}"

# Detecção Backend: uv (preferencial) ou python3 + venv/pip (fallback)
BACKEND_RUNNER=""
if command -v uv &> /dev/null; then
  BACKEND_RUNNER="uv"
  echo -e "${C_GREEN}   ✓ Backend runtime: 'uv' detectado (modo de alta performance).${C_RESET}"
elif command -v python3 &> /dev/null; then
  # Testa se o módulo venv está disponível no python3
  if python3 -m venv --help &> /dev/null; then
    BACKEND_RUNNER="pip"
    echo -e "${C_YELLOW}   ⚠️  'uv' não encontrado. Usando fallback do Backend: 'python3 -m venv' e 'pip'.${C_RESET}"
  else
    echo -e "${C_RED}❌ Erro: Nem 'uv' nem o pacote 'python3-venv' foram encontrados.${C_RESET}"
    echo -e "   Instale o uv (https://docs.astral.sh/uv/) ou o pacote venv (ex: sudo apt install python3-venv).${C_RESET}"
    exit 1
  fi
else
  echo -e "${C_RED}❌ Erro: Nenhum runtime Python ou 'uv' foi encontrado no sistema.${C_RESET}"
  exit 1
fi

# Detecção Frontend: bun (preferencial) ou npm + node (fallback)
FRONTEND_RUNNER=""
if command -v bun &> /dev/null; then
  FRONTEND_RUNNER="bun"
  echo -e "${C_GREEN}   ✓ Frontend runtime: 'bun' detectado (modo de alta performance).${C_RESET}"
elif command -v npm &> /dev/null && command -v node &> /dev/null; then
  FRONTEND_RUNNER="npm"
  echo -e "${C_YELLOW}   ⚠️  'bun' não encontrado. Usando fallback do Frontend: 'npm' e 'node'.${C_RESET}"
else
  echo -e "${C_RED}❌ Erro: Nem 'bun' nem 'npm' foram encontrados no sistema.${C_RESET}"
  echo -e "   Instale o Bun (https://bun.sh/) ou o Node.js / npm (https://nodejs.org/).${C_RESET}"
  exit 1
fi

# ------------------------------------------------------------------------------
# 2. Configuração de Variáveis de Ambiente
# ------------------------------------------------------------------------------
if [ ! -f "$BACKEND_DIR/.env" ]; then
  echo -e "\n${C_YELLOW}⚙️  Arquivo .env ausente no backend. Criando a partir de .env.example...${C_RESET}"
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
VENV_DIR="$BACKEND_DIR/.venv"
VENV_PYTHON="$VENV_DIR/bin/python"
VENV_ALEMBIC="$VENV_DIR/bin/alembic"
VENV_UVICORN="$VENV_DIR/bin/uvicorn"

if [ "$BACKEND_RUNNER" = "uv" ]; then
  echo -e "\n${C_CYAN}📦 Sincronizando dependências do Backend (uv sync)...${C_RESET}"
  (cd "$BACKEND_DIR" && uv sync --all-extras)
  # Verifica se uvicorn foi instalado corretamente
  if ! (cd "$BACKEND_DIR" && uv run python -c "import uvicorn" 2>/dev/null); then
    echo -e "${C_RED}[ERRO] Pré-requisito ausente: 'uvicorn' não encontrado após uv sync.${C_RESET}"
    echo -e "${C_RED}   Verifique se uvicorn está listado nas dependências do pyproject.toml.${C_RESET}"
    exit 1
  fi
  echo -e "${C_GREEN}   ✓ uvicorn disponível no ambiente uv.${C_RESET}"
else
  echo -e "\n${C_CYAN}📦 Preparando ambiente virtual do Backend (venv + pip)...${C_RESET}"
  if [ ! -d "$VENV_DIR" ]; then
    echo -e "   Criando ambiente virtual em $VENV_DIR..."
    python3 -m venv "$VENV_DIR"
  fi
  echo -e "   Instalando/atualizando dependências com pip..."
  (cd "$BACKEND_DIR" && "$VENV_DIR/bin/pip" install --upgrade pip && "$VENV_DIR/bin/pip" install -e ".[dev]")
  # Verifica se uvicorn foi instalado no venv
  if [ ! -x "$VENV_UVICORN" ]; then
    echo -e "${C_RED}[ERRO] Pré-requisito ausente: 'uvicorn' não encontrado em $VENV_UVICORN após pip install.${C_RESET}"
    echo -e "${C_RED}   Verifique se uvicorn está listado nas dependências do pyproject.toml ou requirements.${C_RESET}"
    exit 1
  fi
  echo -e "${C_GREEN}   ✓ uvicorn disponível no venv.${C_RESET}"
fi

install_frontend_deps() {
  if [ "$FRONTEND_RUNNER" = "bun" ]; then
    (cd "$FRONTEND_DIR" && bun install)
  else
    (cd "$FRONTEND_DIR" && npm install)
  fi
}

VITE_BIN="$FRONTEND_DIR/node_modules/.bin/vite"

if [ "$FRONTEND_RUNNER" = "bun" ]; then
  echo -e "\n${C_CYAN}📦 Verificando dependências do Frontend (bun install)...${C_RESET}"
  if [ ! -d "$FRONTEND_DIR/node_modules" ] || [ ! -f "$VITE_BIN" ]; then
    if [ -d "$FRONTEND_DIR/node_modules" ]; then
      echo -e "${C_YELLOW}   ⚠️  node_modules existe mas 'vite' não encontrado em .bin/. Reinstalando...${C_RESET}"
    fi
    install_frontend_deps
  else
    echo -e "${C_GREEN}   ✓ node_modules e vite presentes no frontend.${C_RESET}"
  fi
else
  echo -e "\n${C_CYAN}📦 Verificando dependências do Frontend (npm install)...${C_RESET}"
  if [ ! -d "$FRONTEND_DIR/node_modules" ] || [ ! -f "$VITE_BIN" ]; then
    if [ -d "$FRONTEND_DIR/node_modules" ]; then
      echo -e "${C_YELLOW}   ⚠️  node_modules existe mas 'vite' não encontrado em .bin/. Reinstalando...${C_RESET}"
    fi
    install_frontend_deps
  else
    echo -e "${C_GREEN}   ✓ node_modules e vite presentes no frontend.${C_RESET}"
  fi
fi

# Verificação final: vite deve existir após install
if [ ! -f "$VITE_BIN" ]; then
  echo -e "${C_RED}[ERRO] Pré-requisito ausente: 'vite' não encontrado em node_modules/.bin/ após install.${C_RESET}"
  echo -e "${C_RED}   Verifique se 'vite' está listado como devDependency no package.json do frontend.${C_RESET}"
  echo -e "${C_RED}   Tente manualmente: cd frontend && npm install${C_RESET}"
  exit 1
fi


# ------------------------------------------------------------------------------
# 4. Detecção de Estado do Banco de Dados & Ingestão
# ------------------------------------------------------------------------------
echo -e "\n${C_CYAN}🗄️  Analisando estado da base de dados ($DB_PATH)...${C_RESET}"

NEEDS_MIGRATIONS=false
NEEDS_SEED=false

# Escolhe o executável Python a ser usado para inspecionar o SQLite
PY_CMD="python3"
if [ -x "$VENV_PYTHON" ]; then
  PY_CMD="$VENV_PYTHON"
fi

if [ ! -f "$DB_PATH" ] || [ ! -s "$DB_PATH" ]; then
  echo -e "${C_YELLOW}⚠️  Banco de dados não encontrado ou vazio. Setup inicial necessário!${C_RESET}"
  NEEDS_MIGRATIONS=true
  NEEDS_SEED=true
else
  # Verifica se a tabela principal existe e possui dados
  MOVIES_COUNT=$($PY_CMD -c "
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
  if [ "$BACKEND_RUNNER" = "uv" ]; then
    (cd "$BACKEND_DIR" && uv run alembic upgrade head)
  else
    (cd "$BACKEND_DIR" && "$VENV_ALEMBIC" upgrade head)
  fi
  echo -e "${C_GREEN}   ✓ Migrações aplicadas com sucesso.${C_RESET}"
fi

if [ "$NEEDS_SEED" = true ]; then
  echo -e "\n${C_CYAN}🌱 Verificando arquivos CSV para ingestão de dados em $DATA_DIR...${C_RESET}"
  if [ -d "$DATA_DIR" ] && [ -f "$DATA_DIR/dim_movies.csv" ]; then
    echo -e "${C_GREEN}   ✓ CSVs encontrados. Executando seed_database.py (isso pode levar ~25s)...${C_RESET}"
    if [ "$BACKEND_RUNNER" = "uv" ]; then
      (cd "$BACKEND_DIR" && uv run python scripts/seed_database.py)
    else
      (cd "$BACKEND_DIR" && "$VENV_PYTHON" scripts/seed_database.py)
    fi
    echo -e "${C_GREEN}   ✓ Ingestão analítica concluída com sucesso!${C_RESET}"
  else
    echo -e "${C_RED}❌ ERRO: Pasta data/ ou dim_movies.csv não encontrados em $DATA_DIR.${C_RESET}"
    echo -e "${C_RED}   Certifique-se de posicionar os CSVs da atividade em data/ para realizar a ingestão.${C_RESET}"
    exit 1
  fi
fi

# ------------------------------------------------------------------------------
# 6. Execução Conjunta: Backend FastAPI + Frontend Vite com Encerramento Limpo
# ------------------------------------------------------------------------------
echo -e "\n${C_BOLD}${C_GREEN}🚀 Tudo pronto! Iniciando servidores...${C_RESET}"
echo -e "   • Backend FastAPI: ${C_BOLD}http://0.0.0.0:8000${C_RESET} (Docs: http://0.0.0.0:8000/docs | http://localhost:8000/docs)"
echo -e "   • Frontend React:  ${C_BOLD}http://0.0.0.0:5173${C_RESET} (Local: http://localhost:5173)"
echo -e "   • Pressione ${C_BOLD}Ctrl+C${C_RESET} para encerrar ambos os serviços.\n"

BACKEND_PID=""
FRONTEND_PID=""

kill_tree() {
  local parent_pid=$1
  if [ -n "$parent_pid" ] && kill -0 "$parent_pid" 2>/dev/null; then
    # Localiza PIDs filhos recursivamente
    local children
    children=$(pgrep -P "$parent_pid" 2>/dev/null || true)
    for child in $children; do
      kill_tree "$child"
    done
    kill -TERM "$parent_pid" 2>/dev/null || true
  fi
}

cleanup() {
  trap - SIGINT SIGTERM EXIT
  echo -e "\n${C_YELLOW}🛑 Encerrando servidores e liberando portas...${C_RESET}"

  if [ -n "$BACKEND_PID" ]; then
    kill_tree "$BACKEND_PID"
  fi

  if [ -n "$FRONTEND_PID" ]; then
    kill_tree "$FRONTEND_PID"
  fi

  # Aguarda até 2 segundos para encerramento gracioso
  sleep 0.5

  # Força encerramento se ainda houver resquícios nos PIDs
  if [ -n "$BACKEND_PID" ] && kill -0 "$BACKEND_PID" 2>/dev/null; then
    kill -KILL "$BACKEND_PID" 2>/dev/null || true
  fi
  if [ -n "$FRONTEND_PID" ] && kill -0 "$FRONTEND_PID" 2>/dev/null; then
    kill -KILL "$FRONTEND_PID" 2>/dev/null || true
  fi

  # Mata também qualquer processo filho remanescente no grupo de processos
  kill 0 2>/dev/null || true

  echo -e "${C_GREEN}   ✓ Todos os processos foram encerrados com sucesso.${C_RESET}"
  exit 0
}

trap cleanup SIGINT SIGTERM EXIT

# Inicia backend em background
if [ "$BACKEND_RUNNER" = "uv" ]; then
  (cd "$BACKEND_DIR" && exec uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000) &
  BACKEND_PID=$!
else
  (cd "$BACKEND_DIR" && exec "$VENV_UVICORN" app.main:app --reload --host 0.0.0.0 --port 8000) &
  BACKEND_PID=$!
fi

# Inicia frontend em background
if [ "$FRONTEND_RUNNER" = "bun" ]; then
  (cd "$FRONTEND_DIR" && exec bun run dev -- --host 0.0.0.0) &
  FRONTEND_PID=$!
else
  (cd "$FRONTEND_DIR" && exec npm run dev -- --host 0.0.0.0) &
  FRONTEND_PID=$!
fi

# Monitoramento de processos: se qualquer um falhar ou sair, dispara cleanup
while true; do
  if ! kill -0 "$BACKEND_PID" 2>/dev/null; then
    echo -e "${C_RED}⚠️  Processo do Backend encerrou inesperadamente.${C_RESET}"
    break
  fi
  if ! kill -0 "$FRONTEND_PID" 2>/dev/null; then
    echo -e "${C_RED}⚠️  Processo do Frontend encerrou inesperadamente.${C_RESET}"
    break
  fi
  sleep 1
done

cleanup
