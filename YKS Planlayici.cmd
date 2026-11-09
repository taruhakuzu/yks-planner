@echo off
rem ==================================================================
rem  YKS Planlayici - baslatici
rem  Uygulamayi bilgisayardaki Edge / Chrome / Brave tarayicisinin
rem  "uygulama penceresi" modunda acar. Internet baglantisi kullanmaz.
rem  Veriler: %LOCALAPPDATA%\YKSPlanlayici klasorunde saklanir.
rem ==================================================================
setlocal

set "PAGE=%~dp0app\index.html"
set "URL=file:///%PAGE:\=/%"
set "PROFILE_DIR=%LOCALAPPDATA%\YKSPlanlayici\Tarayici"
set "BROWSER="

if not exist "%PAGE%" (
  echo app\index.html bulunamadi. Klasor yapisini bozmadan tekrar deneyin.
  pause
  exit /b 1
)

rem --- 1) Microsoft Edge (her Windows 10/11'de bulunur) ---
for %%P in (
  "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"
  "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe"
  "%LOCALAPPDATA%\Microsoft\Edge\Application\msedge.exe"
) do if not defined BROWSER if exist "%%~P" set "BROWSER=%%~P"
if not defined BROWSER for /d %%D in ("%ProgramFiles(x86)%\Microsoft\EdgeCore\*") do if exist "%%~D\msedge.exe" set "BROWSER=%%~D\msedge.exe"

rem --- 2) Chrome / Brave ---
for %%P in (
  "%ProgramFiles%\Google\Chrome\Application\chrome.exe"
  "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"
  "%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"
  "%LOCALAPPDATA%\BraveSoftware\Brave-Browser\Application\brave.exe"
  "%ProgramFiles%\BraveSoftware\Brave-Browser\Application\brave.exe"
) do if not defined BROWSER if exist "%%~P" set "BROWSER=%%~P"


rem --- 3) Windows kayit defteri (App Paths) ---
if not defined BROWSER for %%E in (msedge.exe chrome.exe brave.exe) do (
  if not defined BROWSER for /f "tokens=2,*" %%A in ('reg query "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\%%E" /ve 2^>nul ^| find "REG_SZ"') do if exist "%%~B" set "BROWSER=%%~B"
  if not defined BROWSER for /f "tokens=2,*" %%A in ('reg query "HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\%%E" /ve 2^>nul ^| find "REG_SZ"') do if exist "%%~B" set "BROWSER=%%~B"
)

rem --- Tani modu: "YKS Planlayici.cmd" --test ---
if /i not "%~1"=="--test" goto after_test
echo Tarayici : %BROWSER%
echo Adres    : %URL%
echo Profil   : %PROFILE_DIR%
exit /b 0
:after_test

if defined BROWSER goto launch

rem --- Chromium tabanli tarayici yoksa varsayilan tarayicida ac ---
start "" "%PAGE%"
exit /b 0

:launch
start "" "%BROWSER%" --app="%URL%" --user-data-dir="%PROFILE_DIR%" --no-first-run --no-default-browser-check --disable-sync --disable-features=Translate --window-size=1440,900
exit /b 0
