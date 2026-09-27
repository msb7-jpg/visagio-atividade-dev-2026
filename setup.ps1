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
# 1. Verificação de Ferramentas / Pré-requisitos & Detecção de Fallbacks
# ------------------------------------------------------------------------------
Write-Host "🔍 Verificando ferramentas instaladas e selecionando runtimes..." -ForegroundColor Cyan

function Test-CommandAvailable {
    param([string]$CommandName)
    return [bool](Get-Command $CommandName -ErrorAction SilentlyContinue)
}

$PythonCmd = $null
if (Test-CommandAvailable "python") {
    $PythonCmd = "python"
} elseif (Test-CommandAvailable "python3") {
    $PythonCmd = "python3"
} elseif (Test-CommandAvailable "py") {
    $PythonCmd = "py"
}

# Detecção Backend: uv (preferencial) ou python venv/pip (fallback)
$BackendRunner = ""
if (Test-CommandAvailable "uv") {
    $BackendRunner = "uv"
    Write-Host "   ✓ Backend runtime: 'uv' detectado (modo de alta performance)." -ForegroundColor Green
} elseif ($null -ne $PythonCmd) {
    $BackendRunner = "pip"
    Write-Host "   ⚠️  'uv' não encontrado. Usando fallback do Backend: '$PythonCmd -m venv' e 'pip'." -ForegroundColor Yellow
} else {
    Write-Host "❌ Erro: Nem 'uv' nem 'python' foram encontrados no sistema." -ForegroundColor Red
    Write-Host "   Instale uv (https://docs.astral.sh/uv/) ou Python 3.11+ e adicione ao PATH." -ForegroundColor Red
    exit 1
}

# Detecção Frontend: bun (preferencial) ou npm (fallback)
$FrontendRunner = ""
if (Test-CommandAvailable "bun") {
    $FrontendRunner = "bun"
    Write-Host "   ✓ Frontend runtime: 'bun' detectado (modo de alta performance)." -ForegroundColor Green
} elseif (Test-CommandAvailable "npm") {
    $FrontendRunner = "npm"
    Write-Host "   ⚠️  'bun' não encontrado. Usando fallback do Frontend: 'npm' e 'node'." -ForegroundColor Yellow
} else {
    Write-Host "❌ Erro: Nem 'bun' nem 'npm' foram encontrados no sistema." -ForegroundColor Red
    Write-Host "   Instale o Bun (https://bun.sh/) ou o Node.js / npm (https://nodejs.org/)." -ForegroundColor Red
    exit 1
}

# ------------------------------------------------------------------------------
# 2. Configuração de Variáveis de Ambiente
# ------------------------------------------------------------------------------
$EnvFile = Join-Path $BackendDir ".env"
$EnvExample = Join-Path $BackendDir ".env.example"

if (-not (Test-Path $EnvFile)) {
    Write-Host "`n⚙️  Arquivo .env ausente no backend. Criando a partir de .env.example..." -ForegroundColor Yellow
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
$VenvDir = Join-Path $BackendDir ".venv"
$VenvScripts = Join-Path $VenvDir "Scripts"
$VenvPython = Join-Path $VenvScripts "python.exe"
$VenvPip = Join-Path $VenvScripts "pip.exe"
$VenvAlembic = Join-Path $VenvScripts "alembic.exe"
$VenvUvicorn = Join-Path $VenvScripts "uvicorn.exe"

# Suporte caso o ambiente seja criado com padrão POSIX bin/
if (-not (Test-Path $VenvPython)) {
    $VenvScripts = Join-Path $VenvDir "bin"
    $VenvPython = Join-Path $VenvScripts "python.exe"
    if (-not (Test-Path $VenvPython)) { $VenvPython = Join-Path $VenvScripts "python" }
    $VenvPip = Join-Path $VenvScripts "pip.exe"
    if (-not (Test-Path $VenvPip)) { $VenvPip = Join-Path $VenvScripts "pip" }
    $VenvAlembic = Join-Path $VenvScripts "alembic.exe"
    if (-not (Test-Path $VenvAlembic)) { $VenvAlembic = Join-Path $VenvScripts "alembic" }
    $VenvUvicorn = Join-Path $VenvScripts "uvicorn.exe"
    if (-not (Test-Path $VenvUvicorn)) { $VenvUvicorn = Join-Path $VenvScripts "uvicorn" }
}

if ($BackendRunner -eq "uv") {
    Write-Host "`n📦 Sincronizando dependências do Backend (uv sync)..." -ForegroundColor Cyan
    Push-Location $BackendDir
    try {
        & uv sync --all-extras
        if ($LASTEXITCODE -ne 0) { throw "Falha ao executar uv sync" }
    } finally {
        Pop-Location
    }
} else {
    Write-Host "`n📦 Preparando ambiente virtual do Backend (venv + pip)..." -ForegroundColor Cyan
    if (-not (Test-Path $VenvDir)) {
        Write-Host "   Criando ambiente virtual em $VenvDir..."
        & $PythonCmd -m venv $VenvDir
    }
    Write-Host "   Instalando/atualizando dependências com pip..."
    Push-Location $BackendDir
    try {
        & $VenvPython -m pip install --upgrade pip
        & $VenvPython -m pip install -e ".[dev]"
        if ($LASTEXITCODE -ne 0) { throw "Falha na instalação de dependências do backend com pip" }
    } finally {
        Pop-Location
    }
}

$NodeModulesDir = Join-Path $FrontendDir "node_modules"
if ($FrontendRunner -eq "bun") {
    Write-Host "`n📦 Verificando dependências do Frontend (bun install)..." -ForegroundColor Cyan
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
} else {
    Write-Host "`n📦 Verificando dependências do Frontend (npm install)..." -ForegroundColor Cyan
    if (-not (Test-Path $NodeModulesDir)) {
        Push-Location $FrontendDir
        try {
            & npm install
            if ($LASTEXITCODE -ne 0) { throw "Falha ao executar npm install" }
        } finally {
            Pop-Location
        }
    } else {
        Write-Host "   ✓ node_modules já presente no frontend." -ForegroundColor Green
    }
}

# ------------------------------------------------------------------------------
# 4. Detecção de Estado do Banco de Dados & Ingestão
# ------------------------------------------------------------------------------
Write-Host "`n🗄️  Analisando estado da base de dados ($DbPath)..." -ForegroundColor Cyan

$NeedsMigrations = $false
$NeedsSeed = $false

$EffectivePy = if (Test-Path $VenvPython) { $VenvPython } else { $PythonCmd }

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
    $MoviesCountRaw = & $EffectivePy -c $CheckScript 2>$null
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
        if ($BackendRunner -eq "uv") {
            & uv run alembic upgrade head
        } else {
            if (Test-Path $VenvAlembic) {
                & $VenvAlembic upgrade head
            } else {
                & $VenvPython -m alembic upgrade head
            }
        }
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
            if ($BackendRunner -eq "uv") {
                & uv run python scripts/seed_database.py
            } else {
                & $VenvPython scripts/seed_database.py
            }
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
    param($dir, $runner, $uvicornPath)
    Set-Location $dir
    if ($runner -eq "uv") {
        & uv run uvicorn app.main:app --reload --port 8000
    } else {
        & $uvicornPath app.main:app --reload --port 8000
    }
} -ArgumentList $BackendDir, $BackendRunner, $VenvUvicorn

$FrontendJob = Start-Job -ScriptBlock {
    param($dir, $runner)
    Set-Location $dir
    if ($runner -eq "bun") {
        & bun run dev
    } else {
        & npm run dev
    }
} -ArgumentList $FrontendDir, $FrontendRunner

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
    Write-Host "`n🛑 Encerrando servidores e liberando portas..." -ForegroundColor Yellow
    Stop-Job -Job $BackendJob -ErrorAction SilentlyContinue
    Stop-Job -Job $FrontendJob -ErrorAction SilentlyContinue
    Remove-Job -Job $BackendJob -Force -ErrorAction SilentlyContinue
    Remove-Job -Job $FrontendJob -Force -ErrorAction SilentlyContinue

    # Encerra processos uvicorn e vite caso tenham ficado em execução desanexados no Windows
    Get-Process -Name "uvicorn", "node", "bun" -ErrorAction SilentlyContinue | Where-Object {
        $_.Path -like "*$BackendDir*" -or $_.Path -like "*$FrontendDir*"
    } | Stop-Process -Force -ErrorAction SilentlyContinue
    Write-Host "   ✓ Servidores encerrados com sucesso." -ForegroundColor Green
}
