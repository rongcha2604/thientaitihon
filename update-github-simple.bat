@echo off
chcp 65001 >nul
echo ====================================
echo    Tu dong cap nhat len GitHub
echo ====================================
echo.

cd /d "%~dp0"

git --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Git chua duoc cai dat!
    pause
    exit /b 1
)

echo [1/3] Dang them tat ca thay doi...
git add .
echo.

echo [2/3] Dang commit...
git commit -m "Update: Them hinh anh dep"
if errorlevel 1 (
    echo [INFO] Khong co thay doi de commit hoac da commit roi.
    echo.
)
echo.

echo [3/3] Dang push len GitHub...
git push -u origin main
if errorlevel 1 (
    echo Thu push len branch master...
    git push -u origin master
    if errorlevel 1 (
        echo.
        echo [ERROR] Push that bai!
        pause
        exit /b 1
    )
)

echo.
echo ====================================
echo    HOAN THANH!
echo ====================================
echo.
pause

