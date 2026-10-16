@echo off
chcp 65001 >nul
title GymFlow
cd /d "%~dp0"
echo Abrindo o GymFlow...
where python >nul 2>nul
if %errorlevel%==0 (
  echo Servidor local em http://localhost:5500  -  feche esta janela para encerrar.
  start "" "http://localhost:5500/index.html"
  python -m http.server 5500
) else (
  echo Python nao encontrado: abrindo o arquivo direto no navegador.
  echo Funciona no modo local. Para login com Firebase, instale o Python ou use o link do Vercel.
  start "" "%~dp0index.html"
)
pause
