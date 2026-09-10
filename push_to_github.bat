@echo off
:: Configura Git
git config --global user.email "massimo.fornara.2212@gmail.com"
git config --global user.name "Massimo"

:: Elimina la cartella .git
rd /s /q .git 2>nul

:: Inizializza Git
git init

:: Crea .gitignore
echo node_modules/ > .gitignore
echo client/node_modules/ >> .gitignore
echo server/node_modules/ >> .gitignore
echo .env >> .gitignore
echo *.log >> .gitignore

:: Aggiungi, commit e push
git add .
git commit -m "Initial commit: Crypto Credits App"
git remote add origin https://github.com/massimofornara/crypto-credits-app.git
git push -u origin main
