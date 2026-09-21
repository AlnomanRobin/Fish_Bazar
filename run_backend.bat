@echo off
title FishBazar Backend (Django API)
echo ========================================================
echo   FishBazar Backend API Server (Django REST Framework)
echo   API URL: http://localhost:8000/api/v1/
echo   Admin:   http://localhost:8000/admin/
echo ========================================================
echo.

if not exist backend\venv\Scripts\python.exe (
    echo [ERROR] Virtual environment not found in backend\venv
    echo Creating virtual environment and installing dependencies...
    python -m venv backend\venv
    backend\venv\Scripts\pip.exe install -r backend\requirements.txt
    backend\venv\Scripts\python.exe backend\manage.py migrate
    backend\venv\Scripts\python.exe backend\manage.py seed_data
)

echo Starting Django server on port 8000...
backend\venv\Scripts\python.exe backend\manage.py runserver 0.0.0.0:8000
pause
