@echo off
chcp 65001 >nul
echo ====================================
echo    Xóa deploy scripts khỏi GitHub
echo ====================================
echo.

REM Chuyển vào thư mục script
cd /d "%~dp0"

REM Kiểm tra git
git --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Git chưa được cài đặt!
    pause
    exit /b 1
)

echo [1/4] Đang xóa các file script khỏi git tracking...
git rm --cached deploy-now.bat 2>nul
git rm --cached quick-deploy.ps1 2>nul
git rm --cached deploy-github.ps1 2>nul
git rm --cached DEPLOY_QR_UPDATE.md 2>nul
echo ✓ Đã xóa khỏi git tracking (file vẫn còn trên máy)
echo.

echo [2/4] Đang thêm .gitignore...
git add .gitignore
echo ✓ Đã thêm .gitignore
echo.

echo [3/4] Đang commit...
git commit -m "Update: Thêm hình ảnh đẹp - Xóa deploy scripts khỏi repo"
if errorlevel 1 (
    echo [WARNING] Commit thất bại hoặc không có thay đổi mới
    echo.
)
echo.

echo [4/4] Đang push lên GitHub...
git push -u origin main
if errorlevel 1 (
    git push -u origin master
    if errorlevel 1 (
        echo.
        echo [ERROR] Push thất bại!
        pause
        exit /b 1
    )
)

echo.
echo ====================================
echo    ✓ HOÀN THÀNH!
echo ====================================
echo.
echo Đã xóa các file deploy scripts khỏi GitHub!
echo File vẫn còn trên máy tính của bạn.
echo.
pause

