@echo off
chcp 65001 >nul
title Cloud Student Services - سحابية خدمات الطلاب
color 0b

echo ========================================================
echo   نظام خدمات الطلاب السحابية ^| Cloud Student Services
echo ========================================================
echo.

set "PATH=%LOCALAPPDATA%\Programs\nodejs;%PATH%"

where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [خطأ] لم يتم العثور على Node.js في المسار المعتاد.
    pause
    exit /b 1
)

echo [*] جاري تشغيل خادم النظام (Node.js Server)...
echo [*] الرابط المحلي: http://localhost:3000
echo.

:: انتظر ثانيتين ثم افتح المتصفح تلقائياً
start "" cmd /c "timeout /t 2 /nobreak >nul & start http://localhost:3000"

:: تشغيل السيرفر
node server.js

pause
