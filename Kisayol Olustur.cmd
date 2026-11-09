@echo off
rem ==================================================================
rem  Masaustune ve Baslat menusune "YKS Planlayici" kisayolu ekler.
rem  Kisayol, bu klasordeki "YKS Planlayici.cmd" dosyasini kucultulmus
rem  pencerede calistirir ve uygulama ikonunu kullanir.
rem ==================================================================
setlocal
set "YKS_DIR=%~dp0"

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$dir = $env:YKS_DIR;" ^
  "$name = 'YKS Planlay' + [char]0x131 + 'c' + [char]0x131;" ^
  "$sh = New-Object -ComObject WScript.Shell;" ^
  "foreach ($folder in @($sh.SpecialFolders('Desktop'), $sh.SpecialFolders('Programs'))) {" ^
  "  if (-not $folder) { continue }" ^
  "  $lnk = $sh.CreateShortcut((Join-Path $folder ($name + '.lnk')));" ^
  "  $lnk.TargetPath = (Join-Path $dir 'YKS Planlayici.cmd');" ^
  "  $lnk.WorkingDirectory = $dir;" ^
  "  $lnk.IconLocation = (Join-Path $dir 'app\icon.ico') + ',0';" ^
  "  $lnk.WindowStyle = 7;" ^
  "  $lnk.Description = 'YKS calisma planlayicisi (cevrimdisi)';" ^
  "  $lnk.Save();" ^
  "  Write-Host ('Kisayol olusturuldu: ' + $lnk.FullName)" ^
  "}"

if errorlevel 1 (
  echo.
  echo Kisayol olusturulamadi. "YKS Planlayici.cmd" dosyasina cift tiklayarak da uygulamayi acabilirsiniz.
) else (
  echo.
  echo Tamam! Artik masaustundeki "YKS Planlayici" simgesine cift tiklayarak uygulamayi acabilirsiniz.
)
echo.
pause
