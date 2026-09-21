@echo off
title FishBazar Full Stack Launcher
echo ========================================================
echo   Starting FishBazar Full Stack Platform
echo   - Backend API: http://localhost:8000/api/v1/
echo   - Frontend:    http://localhost:3000
echo ========================================================
echo.

start "FishBazar Backend API" cmd /c "run_backend.bat"
timeout /t 2 >nul
start "FishBazar Frontend" cmd /c "run_frontend.bat"
