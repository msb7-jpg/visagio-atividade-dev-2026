#!/usr/bin/env bash

BACKEND_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$BACKEND_DIR"

if command -v uv &> /dev/null; then
  exec uv run uvicorn app.main:app --reload --port 8000
elif [ -x "$BACKEND_DIR/.venv/bin/uvicorn" ]; then
  exec "$BACKEND_DIR/.venv/bin/uvicorn" app.main:app --reload --port 8000
else
  echo "Erro: nem 'uv' nem ambiente virtual com uvicorn foram encontrados em $BACKEND_DIR/.venv"
  exit 1
fi