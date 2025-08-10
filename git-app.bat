@echo off
cd /d "%~dp0"
echo Inserindo arquivos...
git add .
git commit -m "Atualização automática"
git push origin main
pause
