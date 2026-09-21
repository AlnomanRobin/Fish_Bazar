@echo off
title FishBazar Frontend
echo ========================================================
echo   FishBazar Frontend (Static Server)
echo   Opening http://localhost:3000 in your browser...
echo ========================================================
echo.

start "" "http://localhost:3000/index.html"
python -m http.server 3000 --directory frontend
pause
