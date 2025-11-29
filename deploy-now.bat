@echo off
chcp 65001 >nul
echo ====================================
echo    Deploy lên GitHub
echo    Repo: thientaitihon.git
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

REM Khởi tạo git nếu chưa có
if not exist ".git" (
    echo [INFO] Khởi tạo git repository...
    git init
    git branch -M main
)

REM Cập nhật remote
echo [1/4] Cập nhật remote...
git remote remove origin 2>nul
git remote add origin https://github.com/rongcha2604/thientaitihon.git
echo ✓ Remote đã được cập nhật
echo.

REM Kiểm tra thay đổi
echo [2/4] Kiểm tra thay đổi...
git status --short >nul
if errorlevel 1 (
    echo [INFO] Không có thay đổi nào để commit.
    echo.
    goto :push
)

REM Add tất cả
echo [3/4] Đang thêm tất cả thay đổi...
git add .
echo ✓ Đã thêm tất cả files
echo.

REM Commit
echo [4/4] Đang commit...
git commit -m "Update: Thêm hình ảnh đẹp"
if errorlevel 1 (
    echo [WARNING] Commit thất bại hoặc không có thay đổi mới
    echo.
)
echo.

:push
REM Push
echo [5/5] Đang push lên GitHub...
git push -u origin main --force
if errorlevel 1 (
    echo.
    echo [ERROR] Push thất bại!
    echo Có thể do:
    echo   - Chưa login GitHub
    echo   - Không có quyền push vào repo
    echo   - Network issues
    echo.
    echo Hãy kiểm tra và thử lại!
    pause
    exit /b 1
)

echo.
echo ====================================
echo    ✓ HOÀN THÀNH!
echo ====================================
echo.
echo Code đã được push lên GitHub thành công!
echo Repo: https://github.com/rongcha2604/thientaitihon.git
echo Vercel sẽ tự động deploy trong 1-2 phút...
echo.
pause

