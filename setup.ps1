# ==============================================================================
# CineFlow — Script de Orquestração, Setup Inteligente e Execução (setup.ps1)
# Compatível com Windows PowerShell 5.1+ e PowerShell Core (pwsh)
# ==============================================================================

[CmdletBinding()]
param()

$ErrorActionPreference = "Stop"

$ProjectRoot = $PSScriptRoot
$BackendDir = Join-Path $ProjectRoot "backend"
$FrontendDir = Join-Path $ProjectRoot "frontend"
$DataDir = Join-Path $ProjectRoot "data"
$DbPath = Join-Path $BackendDir "rocketlab.db"

Write-Host "`n🎬 [CineFlow] Iniciando orquestrador do sistema no Windows...`n" -ForegroundColor Cyan

# ------------------------------------------------------------------------------
# 1. Verificação de Ferramentas / Pré-requisitos
# ------------------------------------------------------------------------------
Write-Host "🔍 Verificando ferramentas instaladas..." -ForegroundColor Cyan

function Test-CommandAvailable {
    param([string]$CommandName)
    return [bool](Get-Command $CommandName -ErrorAction SilentlyContinue)
}

if (-not (Test-CommandAvailable "uv")) {
    Write-Host "❌ Erro: 'uv' não encontrado. Instale o uv (https://docs.astral.sh/uv/) e adicione ao PATH." -ForegroundColor Red
    exit 1
}

if (-not (Test-CommandAvailable "bun")) {
    Write-Host "❌ Erro: 'bun' não encontrado. Instale o Bun (https://bun.sh/) e adicione ao PATH." -ForegroundColor Red
    exit 1
}

$PythonCmd = $null
if (Test-CommandAvailable "python") {
    $PythonCmd = "python"
} elseif (Test-CommandAvailable "python3") {
    $PythonCmd = "python3"
} elseif (Test-CommandAvailable "py") {
    $PythonCmd = "py"
} else {
    Write-Host "❌ Erro: Python não encontrado. Instale Python 3.11+ e adicione ao PATH." -ForegroundColor Red
    exit 1
}

Write-Host "   ✓ uv, bun e python disponíveis." -ForegroundColor Green

# ------------------------------------------------------------------------------
# 2. Configuração de Variáveis de Ambiente
# ------------------------------------------------------------------------------
$EnvFile = Join-Path $BackendDir ".env"
$EnvExample = Join-Path $BackendDir ".env.example"

if (-not (Test-Path $EnvFile)) {
    Write-Host "⚙️  Arquivo .env ausente no backend. Criando a partir de .env.example..." -ForegroundColor Yellow
    if (Test-Path $EnvExample) {
        Copy-Item -Path $EnvExample -Destination $EnvFile
    } else {
        @"
ENVIRONMENT=local
PROJECT_VERSION=2026.2
DATABASE_URL=sqlite+aiosqlite:///./rocketlab.db
BACKEND_CORS_ORIGINS=["http://localhost:5173"]
LOG_LEVEL=INFO
"@ | Set-Content -Path $EnvFile -Encoding UTF8
    }
    Write-Host "   ✓ $EnvFile criado." -ForegroundColor Green
}

# ------------------------------------------------------------------------------
# 3. Sincronização de Dependências
# ------------------------------------------------------------------------------
Write-Host "`n📦 Sincronizando dependências do Backend (uv sync)..." -ForegroundColor Cyan
Push-Location $BackendDir
try {
    & uv sync --all-extras
    if ($LASTEXITCODE -ne 0) { throw "Falha ao executar uv sync" }
} finally {
    Pop-Location
}

Write-Host "`n📦 Verificando dependências do Frontend (bun install)..." -ForegroundColor Cyan
$NodeModulesDir = Join-Path $FrontendDir "node_modules"
if (-not (Test-Path $NodeModulesDir)) {
    Push-Location $FrontendDir
    try {
        & bun install
        if ($LASTEXITCODE -ne 0) { throw "Falha ao executar bun install" }
    } finally {
        Pop-Location
    }
} else {
    Write-Host "   ✓ node_modules já presente no frontend." -ForegroundColor Green
}

# ------------------------------------------------------------------------------
# 4. Detecção de Estado do Banco de Dados & Ingestão
# ------------------------------------------------------------------------------
Write-Host "`n🗄️  Analisando estado da base de dados ($DbPath)..." -ForegroundColor Cyan

$NeedsMigrations = $false
$NeedsSeed = $false

if ((-not (Test-Path $DbPath)) -or ((Get-Item $DbPath).Length -eq 0)) {
    Write-Host "⚠️  Banco de dados não encontrado ou vazio. Setup inicial necessário!" -ForegroundColor Yellow
    $NeedsMigrations = $true
    $NeedsSeed = $true
} else {
    $CheckScript = @"
import sqlite3
import sys

db_file = r'$DbPath'
try:
    conn = sqlite3.connect(db_file)
    c = conn.cursor()
    c.execute('SELECT COUNT(*) FROM dim_movies')
    row = c.fetchone()
    print(row[0] if row else 0)
    conn.close()
except Exception:
    print('0')
"@
    $MoviesCountRaw = & $PythonCmd -c $CheckScript 2>$null
    $MoviesCount = 0
    [int]::TryParse(($MoviesCountRaw | Select-Object -First 1), [ref]$MoviesCount) | Out-Null

    if ($MoviesCount -eq 0) {
        Write-Host "⚠️  Banco existe mas sem registros em 'dim_movies' (count: 0). Re-executando seed..." -ForegroundColor Yellow
        $NeedsMigrations = $true
        $NeedsSeed = $true
    } else {
        Write-Host "   ✓ Banco de dados populado detectado ($MoviesCount filmes cadastrados)." -ForegroundColor Green
        $NeedsMigrations = $true
    }
}

# ------------------------------------------------------------------------------
# 5. Execução de Migrações e Seed
# ------------------------------------------------------------------------------
if ($NeedsMigrations) {
    Write-Host "🔄 Aplicando migrações relacionais (Alembic)..." -ForegroundColor Cyan
    Push-Location $BackendDir
    try {
        & uv run alembic upgrade head
        if ($LASTEXITCODE -ne 0) { throw "Falha ao aplicar migrações do Alembic" }
        Write-Host "   ✓ Migrações aplicadas com sucesso." -ForegroundColor Green
    } finally {
        Pop-Location
    }
}

if ($NeedsSeed) {
    Write-Host "`n🌱 Verificando arquivos CSV para ingestão de dados em $DataDir..." -ForegroundColor Cyan
    $DimMoviesCsv = Join-Path $DataDir "dim_movies.csv"
    if ((Test-Path $DataDir) -and (Test-Path $DimMoviesCsv)) {
        Write-Host "   ✓ CSVs encontrados. Executando seed_database.py (isso pode levar ~25s)..." -ForegroundColor Green
        Push-Location $BackendDir
        try {
            & uv run python scripts/seed_database.py
            if ($LASTEXITCODE -ne 0) { throw "Falha na ingestão analítica dos CSVs" }
            Write-Host "   ✓ Ingestão analítica concluída com sucesso!" -ForegroundColor Green
        } finally {
            Pop-Location
        }
    } else {
        Write-Host "❌ ERRO: Pasta data/ ou dim_movies.csv não encontrados em $DataDir." -ForegroundColor Red
        Write-Host "   Certifique-se de posicionar os CSVs da atividade em data/ para realizar a ingestão." -ForegroundColor Red
        exit 1
    }
}

# ------------------------------------------------------------------------------
# 6. Execução Conjunta: Backend FastAPI + Frontend Vite
# ------------------------------------------------------------------------------
Write-Host "`n🚀 Tudo pronto! Iniciando servidores..." -ForegroundColor Green
Write-Host "   • Backend FastAPI: http://localhost:8000 (Docs: http://localhost:8000/docs)" -ForegroundColor Gray
Write-Host "   • Frontend React:  http://localhost:5173" -ForegroundColor Gray
Write-Host "   • Pressione Ctrl+C para encerrar ambos os serviços.`n" -ForegroundColor Yellow

$BackendJob = Start-Job -ScriptBlock {
    param($dir)
    Set-Location $dir
    & uv run uvicorn app.main:app --reload --port 8000
} -ArgumentList $BackendDir

$FrontendJob = Start-Job -ScriptBlock {
    param($dir)
    Set-Location $dir
    & bun run dev
} -ArgumentList $FrontendDir

try {
    while ($true) {
        Receive-Job -Job $BackendJob | ForEach-Object { Write-Host "[backend]  $_" -ForegroundColor DarkCyan }
        Receive-Job -Job $FrontendJob | ForEach-Object { Write-Host "[frontend] $_" -ForegroundColor DarkMagenta }

        if ($BackendJob.State -ne 'Running' -and $FrontendJob.State -ne 'Running') {
            break
        }
        Start-Sleep -Milliseconds 500
    }
} finally {
    Write-Host "`n🛑 Encerrando servidores..." -ForegroundColor Yellow
    Stop-Job -Job $BackendJob -ErrorAction SilentlyContinue
    Stop-Job -Job $FrontendJob -ErrorAction SilentlyContinue
    Remove-Job -Job $BackendJob -Force -ErrorAction SilentlyContinue
    Remove-Job -Job $FrontendJob -Force -ErrorAction SilentlyContinue
}
