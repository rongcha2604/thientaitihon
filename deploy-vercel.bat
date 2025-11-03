@echo off
chcp 65001 >nul
echo ====================================
echo    Deploy lên Vercel
echo ====================================
echo.

REM Kiểm tra Vercel CLI
vercel --version >nul 2>&1
if errorlevel 1 (
    echo [INFO] Vercel CLI chưa được cài đặt.
    echo.
    echo Bạn có muốn cài đặt Vercel CLI không? (Y/N)
    set /p install="> "
    if /i "%install%"=="Y" (
        echo.
        echo Đang cài đặt Vercel CLI...
        npm install -g vercel
        if errorlevel 1 (
            echo [ERROR] Không thể cài đặt Vercel CLI!
            pause
            exit /b 1
        )
        echo ✓ Đã cài đặt Vercel CLI
        echo.
    ) else (
        echo Đã hủy.
        pause
        exit /b 0
    )
)

echo [1/2] Đang build project...
call npm run build
if errorlevel 1 (
    echo [ERROR] Build thất bại!
    pause
    exit /b 1
)
echo ✓ Build thành công
echo.

echo [2/2] Đang deploy lên Vercel...
vercel --prod
if errorlevel 1 (
    echo.
    echo [ERROR] Deploy thất bại!
    echo Có thể do:
    echo   - Chưa login: vercel login
    echo   - Chưa setup project
    echo.
    pause
    exit /b 1
)

echo.
echo ====================================
echo    ✓ HOÀN THÀNH!
echo ====================================
echo.
echo App đã được deploy lên Vercel!
echo.
pause

