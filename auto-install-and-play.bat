@echo off
REM Dynasty of Emberveil - Auto Install and Play Script (Windows)
REM This script automatically installs dependencies, builds, and starts the game

setlocal enabledelayedexpansion

color 0D
title Dynasty of Emberveil - Auto Installer

echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║                                                               ║
echo ║      ██████╗ ██╗   ██╗███╗   ██╗ █████╗ ███████╗████████╗   ║
echo ║      ██╔══██╗╚██╗ ██╔╝████╗  ██║██╔══██╗██╔════╝╚══██╔══╝   ║
echo ║      ██║  ██║ ╚████╔╝ ██╔██╗ ██║███████║███████╗   ██║      ║
echo ║      ██║  ██║  ╚██╔╝  ██║╚██╗██║██╔══██║╚════██║   ██║      ║
echo ║      ██████╔╝   ██║   ██║ ╚████║██║  ██║███████║   ██║      ║
echo ║      ╚═════╝    ╚═╝   ╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝   ╚═╝      ║
echo ║                                                               ║
echo ║             OF EMBERVEIL - Auto Install ^& Play                ║
echo ║                                                               ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.
echo 🎮 Welcome to Dynasty of Emberveil Auto-Installer!
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

REM Check for Node.js
echo [INFO] Checking for Node.js...
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed!
    echo.
    echo Please install Node.js 18+ from https://nodejs.org
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo [✓] Node.js is installed: %NODE_VERSION%

REM Check for npm
where npm >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm is not installed!
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo [✓] npm is installed: v%NPM_VERSION%
echo.

REM Navigate to script directory
cd /d "%~dp0"
echo [INFO] Current directory: %CD%
echo.

REM Install dependencies
echo [INFO] Installing dependencies...
echo This may take a few minutes...
echo.

call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install dependencies!
    pause
    exit /b 1
)

echo [✓] Dependencies installed successfully!
echo.

REM Build the game
echo [INFO] Building the game...
echo.

call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to build the game!
    pause
    exit /b 1
)

echo [✓] Game built successfully!
echo.

REM Find available port
set PORT=3000
echo [INFO] Will use port: %PORT%
echo.

REM Start the server
echo ╔═══════════════════════════════════════════════════════╗
echo ║                                                       ║
echo ║  🎮  Dynasty of Emberveil is starting...             ║
echo ║                                                       ║
echo ╚═══════════════════════════════════════════════════════╝
echo.

REM Wait a moment then open browser
timeout /t 2 /nobreak >nul

echo [INFO] Opening game in browser...
start http://localhost:%PORT%
echo.

echo ════════════════════════════════════════════════
echo     Game Controls:
echo     WASD - Move
echo     Space - Jump
echo     Mouse - Look around
echo     Click icons - Open menus
echo ════════════════════════════════════════════════
echo.
echo Press Ctrl+C to stop the server
echo.

REM Start the development server
call npm run dev -- --port %PORT%

pause
