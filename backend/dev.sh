# !bin/bash

BACKEND_DIR=$(dirname "$0")

cd $BACKEND_DIR

uv run uvicorn app.main:app --reload