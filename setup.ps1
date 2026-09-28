# ==============================================================================
# CineFlow -- Script de Orquestracao, Setup Inteligente e Execucao (setup.ps1)
# Compativel com Windows PowerShell 5.1+ e PowerShell Core (pwsh)
# ==============================================================================

[CmdletBinding()]
param()

$ErrorActionPreference = "Stop"

$ProjectRoot = $PSScriptRoot
$BackendDir = Join-Path $ProjectRoot "backend"
$FrontendDir = Join-Path $ProjectRoot "frontend"
$DataDir = Join-Path $ProjectRoot "data"
$DbPath = Join-Path $BackendDir "rocketlab.db"

Write-Host "`n[CineFlow] Iniciando orquestrador do sistema no Windows...`n" -ForegroundColor Cyan

# ------------------------------------------------------------------------------
# 1. Verificacao de Ferramentas / Pre-requisitos & Deteccao de Fallbacks
# ------------------------------------------------------------------------------
Write-Host "[>] Verificando ferramentas instaladas e selecionando runtimes..." -ForegroundColor Cyan

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

# Deteccao Backend: uv (preferencial) ou python venv/pip (fallback)
$BackendRunner = ""
if (Test-CommandAvailable "uv") {
    $BackendRunner = "uv"
    Write-Host "   [OK] Backend runtime: 'uv' detectado (modo de alta performance)." -ForegroundColor Green
} elseif ($null -ne $PythonCmd) {
    $BackendRunner = "pip"
    Write-Host "   [!]  'uv' nao encontrado. Usando fallback do Backend: '$PythonCmd -m venv' e 'pip'." -ForegroundColor Yellow
} else {
    Write-Host "[ERRO] Nem 'uv' nem 'python' foram encontrados no sistema." -ForegroundColor Red
    Write-Host "   Instale uv (https://docs.astral.sh/uv/) ou Python 3.11+ e adicione ao PATH." -ForegroundColor Red
    exit 1
}

# Deteccao Frontend: bun (preferencial) ou npm (fallback)
$FrontendRunner = ""
if (Test-CommandAvailable "bun") {
    $FrontendRunner = "bun"
    Write-Host "   [OK] Frontend runtime: 'bun' detectado (modo de alta performance)." -ForegroundColor Green
} elseif (Test-CommandAvailable "npm") {
    $FrontendRunner = "npm"
    Write-Host "   [!]  'bun' nao encontrado. Usando fallback do Frontend: 'npm' e 'node'." -ForegroundColor Yellow
} else {
    Write-Host "[ERRO] Nem 'bun' nem 'npm' foram encontrados no sistema." -ForegroundColor Red
    Write-Host "   Instale o Bun (https://bun.sh/) ou o Node.js / npm (https://nodejs.org/)." -ForegroundColor Red
    exit 1
}

# ------------------------------------------------------------------------------
# 2. Configuracao de Variaveis de Ambiente
# ------------------------------------------------------------------------------
$EnvFile = Join-Path $BackendDir ".env"
$EnvExample = Join-Path $BackendDir ".env.example"

if (-not (Test-Path $EnvFile)) {
    Write-Host "`n[>] Arquivo .env ausente no backend. Criando a partir de .env.example..." -ForegroundColor Yellow
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
    Write-Host "   [OK] $EnvFile criado." -ForegroundColor Green
}

# ------------------------------------------------------------------------------
# 3. Sincronizacao de Dependencias
# ------------------------------------------------------------------------------
$VenvDir = Join-Path $BackendDir ".venv"
$VenvScripts = Join-Path $VenvDir "Scripts"
$VenvPython = Join-Path $VenvScripts "python.exe"
$VenvPip = Join-Path $VenvScripts "pip.exe"
$VenvAlembic = Join-Path $VenvScripts "alembic.exe"
$VenvUvicorn = Join-Path $VenvScripts "uvicorn.exe"

# Suporte caso o ambiente seja criado com padrao POSIX bin/
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
    Write-Host "`n[PKG] Sincronizando dependencias do Backend (uv sync)..." -ForegroundColor Cyan
    Push-Location $BackendDir
    try {
        & uv sync --all-extras
        if ($LASTEXITCODE -ne 0) { throw "Falha ao executar uv sync" }
    } finally {
        Pop-Location
    }
    # Verifica se uvicorn foi instalado corretamente pelo uv (deve rodar dentro do BackendDir)
    $prevEAP = $ErrorActionPreference
    $ErrorActionPreference = "Continue"
    Push-Location $BackendDir
    & uv run python -c "import uvicorn" 2>&1 | Out-Null
    $uvicornOk = ($LASTEXITCODE -eq 0)
    Pop-Location
    $ErrorActionPreference = $prevEAP
    if (-not $uvicornOk) {
        Write-Host "[ERRO] Pre-requisito ausente: 'uvicorn' nao encontrado apos uv sync." -ForegroundColor Red
        Write-Host "   Verifique se uvicorn esta listado nas dependencias do pyproject.toml." -ForegroundColor Red
        exit 1
    }
    Write-Host "   [OK] uvicorn disponivel no ambiente uv." -ForegroundColor Green
} else {
    Write-Host "`n[PKG] Preparando ambiente virtual do Backend (venv + pip)..." -ForegroundColor Cyan
    if (-not (Test-Path $VenvDir)) {
        Write-Host "   Criando ambiente virtual em $VenvDir..."
        & $PythonCmd -m venv $VenvDir
    }
    Write-Host "   Instalando/atualizando dependencias com pip..."
    Push-Location $BackendDir
    try {
        & $VenvPython -m pip install --upgrade pip
        & $VenvPython -m pip install -e ".[dev]"
        if ($LASTEXITCODE -ne 0) { throw "Falha na instalacao de dependencias do backend com pip" }
    } finally {
        Pop-Location
    }
    # Verifica se uvicorn foi instalado no venv
    if (-not (Test-Path $VenvUvicorn)) {
        Write-Host "[ERRO] Pre-requisito ausente: 'uvicorn' nao encontrado em $VenvUvicorn apos pip install." -ForegroundColor Red
        Write-Host "   Verifique se uvicorn esta listado nas dependencias do pyproject.toml ou requirements." -ForegroundColor Red
        exit 1
    }
    Write-Host "   [OK] uvicorn disponivel no venv." -ForegroundColor Green
}

# Binarios criticos do frontend
$NodeModulesDir = Join-Path $FrontendDir "node_modules"
$ViteBinDir     = Join-Path (Join-Path $FrontendDir "node_modules") ".bin"
$ViteBin        = Join-Path $ViteBinDir "vite"
$ViteBinCmd     = Join-Path $ViteBinDir "vite.cmd"
$VitePresent    = (Test-Path $ViteBin) -or (Test-Path $ViteBinCmd)

function Install-FrontendDeps {
    param([string]$runner)
    Push-Location $FrontendDir
    try {
        if ($runner -eq "bun") {
            & bun install
        } else {
            & npm install
        }
        if ($LASTEXITCODE -ne 0) { throw "Falha ao instalar dependencias do frontend com $runner" }
    } finally {
        Pop-Location
    }
}

if ($FrontendRunner -eq "bun") {
    Write-Host "`n[PKG] Verificando dependencias do Frontend (bun install)..." -ForegroundColor Cyan
    if (-not (Test-Path $NodeModulesDir) -or -not $VitePresent) {
        if (Test-Path $NodeModulesDir) {
            Write-Host "   [!]  node_modules existe mas 'vite' nao encontrado em .bin/. Reinstalando..." -ForegroundColor Yellow
        }
        Install-FrontendDeps "bun"
    } else {
        Write-Host "   [OK] node_modules e vite presentes no frontend." -ForegroundColor Green
    }
} else {
    Write-Host "`n[PKG] Verificando dependencias do Frontend (npm install)..." -ForegroundColor Cyan
    if (-not (Test-Path $NodeModulesDir) -or -not $VitePresent) {
        if (Test-Path $NodeModulesDir) {
            Write-Host "   [!]  node_modules existe mas 'vite' nao encontrado em .bin/. Reinstalando..." -ForegroundColor Yellow
        }
        Install-FrontendDeps "npm"
    } else {
        Write-Host "   [OK] node_modules e vite presentes no frontend." -ForegroundColor Green
    }
}

# Verificacao final: vite deve existir apos install
$VitePresent = (Test-Path $ViteBin) -or (Test-Path $ViteBinCmd)
if (-not $VitePresent) {
    Write-Host "[ERRO] Pre-requisito ausente: 'vite' nao encontrado em node_modules/.bin/ apos install." -ForegroundColor Red
    Write-Host "   Verifique se 'vite' esta listado como devDependency no package.json do frontend." -ForegroundColor Red
    Write-Host "   Tente manualmente: cd frontend && npm install" -ForegroundColor Red
    exit 1
}


# ------------------------------------------------------------------------------
# 4. Deteccao de Estado do Banco de Dados & Ingestao
# ------------------------------------------------------------------------------
Write-Host "`n[DB] Analisando estado da base de dados ($DbPath)..." -ForegroundColor Cyan

$NeedsMigrations = $false
$NeedsSeed = $false

$EffectivePy = if (Test-Path $VenvPython) { $VenvPython } else { $PythonCmd }

if ((-not (Test-Path $DbPath)) -or ((Get-Item $DbPath).Length -eq 0)) {
    Write-Host "[!]  Banco de dados nao encontrado ou vazio. Setup inicial necessario!" -ForegroundColor Yellow
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
        Write-Host "[!]  Banco existe mas sem registros em 'dim_movies' (count: 0). Re-executando seed..." -ForegroundColor Yellow
        $NeedsMigrations = $true
        $NeedsSeed = $true
    } else {
        Write-Host "   [OK] Banco de dados populado detectado ($MoviesCount filmes cadastrados)." -ForegroundColor Green
        $NeedsMigrations = $true
    }
}

# ------------------------------------------------------------------------------
# 5. Execucao de Migracoes e Seed
# ------------------------------------------------------------------------------
if ($NeedsMigrations) {
    Write-Host "[>>] Aplicando migracoes relacionais (Alembic)..." -ForegroundColor Cyan
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
        if ($LASTEXITCODE -ne 0) { throw "Falha ao aplicar migracoes do Alembic" }
        Write-Host "   [OK] Migracoes aplicadas com sucesso." -ForegroundColor Green
    } finally {
        Pop-Location
    }
}

if ($NeedsSeed) {
    Write-Host "`n[SEED] Verificando arquivos CSV para ingestao de dados em $DataDir..." -ForegroundColor Cyan
    $DimMoviesCsv = Join-Path $DataDir "dim_movies.csv"
    if ((Test-Path $DataDir) -and (Test-Path $DimMoviesCsv)) {
        Write-Host "   [OK] CSVs encontrados. Executando seed_database.py (isso pode levar ~25s)..." -ForegroundColor Green
        Push-Location $BackendDir
        try {
            if ($BackendRunner -eq "uv") {
                & uv run python scripts/seed_database.py
            } else {
                & $VenvPython scripts/seed_database.py
            }
            if ($LASTEXITCODE -ne 0) { throw "Falha na ingestao analitica dos CSVs" }
            Write-Host "   [OK] Ingestao analitica concluida com sucesso!" -ForegroundColor Green
        } finally {
            Pop-Location
        }
    } else {
        Write-Host "[ERRO] Pasta data/ ou dim_movies.csv nao encontrados em $DataDir." -ForegroundColor Red
        Write-Host "   Certifique-se de posicionar os CSVs da atividade em data/ para realizar a ingestao." -ForegroundColor Red
        exit 1
    }
}

# ------------------------------------------------------------------------------
# 6. Execucao Conjunta: Backend FastAPI + Frontend Vite
# ------------------------------------------------------------------------------
Write-Host "`n[RUN] Tudo pronto! Iniciando servidores..." -ForegroundColor Green
Write-Host "   * Backend FastAPI: http://localhost:8000 (Docs: http://localhost:8000/docs)" -ForegroundColor Gray
Write-Host "   * Frontend React:  http://localhost:5173" -ForegroundColor Gray
Write-Host "   * Pressione Ctrl+C para encerrar ambos os servicos.`n" -ForegroundColor Yellow

$BackendJob = Start-Job -ScriptBlock {
    param($dir, $runner, $uvicornPath)
    Set-Location $dir
    if ($runner -eq "uv") {
        & uv run uvicorn app.main:app --reload --port 8000 2>&1
    } else {
        & $uvicornPath app.main:app --reload --port 8000 2>&1
    }
} -ArgumentList $BackendDir, $BackendRunner, $VenvUvicorn

$FrontendJob = Start-Job -ScriptBlock {
    param($dir, $runner)
    Set-Location $dir
    if ($runner -eq "bun") {
        & bun run dev 2>&1
    } else {
        & npm run dev 2>&1
    }
} -ArgumentList $FrontendDir, $FrontendRunner

try {
    while ($true) {
        $ErrorActionPreference = "Continue"
        Receive-Job -Job $BackendJob -ErrorAction SilentlyContinue | ForEach-Object { Write-Host "[backend]  $_" -ForegroundColor DarkCyan }
        Receive-Job -Job $FrontendJob -ErrorAction SilentlyContinue | ForEach-Object { Write-Host "[frontend] $_" -ForegroundColor DarkMagenta }

        if ($BackendJob.State -ne 'Running' -and $FrontendJob.State -ne 'Running') {
            break
        }
        Start-Sleep -Milliseconds 500
    }
} finally {
    Write-Host "`n[STOP] Encerrando servidores e liberando portas..." -ForegroundColor Yellow
    Stop-Job -Job $BackendJob -ErrorAction SilentlyContinue
    Stop-Job -Job $FrontendJob -ErrorAction SilentlyContinue
    Remove-Job -Job $BackendJob -Force -ErrorAction SilentlyContinue
    Remove-Job -Job $FrontendJob -Force -ErrorAction SilentlyContinue

    # Encerra processos uvicorn e vite caso tenham ficado em execucao desanexados no Windows
    Get-Process -Name "uvicorn", "node", "bun" -ErrorAction SilentlyContinue | Where-Object {
        $_.Path -like "*$BackendDir*" -or $_.Path -like "*$FrontendDir*"
    } | Stop-Process -Force -ErrorAction SilentlyContinue
    Write-Host "   [OK] Servidores encerrados com sucesso." -ForegroundColor Green
}
