@echo off
chcp 65001 >nul
echo ====================================
echo    Tự động cập nhật lên GitHub
echo ====================================
echo.

REM Kiểm tra xem đã có git chưa
git --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Git chưa được cài đặt!
    echo Vui lòng cài đặt Git từ https://git-scm.com/
    pause
    exit /b 1
)

REM Kiểm tra có thay đổi không
git status --porcelain >nul
if errorlevel 1 (
    echo [INFO] Không có thay đổi nào để commit.
    echo.
    goto :push
)

echo [1/3] Đang thêm tất cả thay đổi...
git add .
if errorlevel 1 (
    echo [ERROR] Không thể add files!
    pause
    exit /b 1
)
echo ✓ Đã thêm tất cả files
echo.

REM Nhận message từ user
echo [2/3] Nhập message cho commit:
echo (Để trống sẽ dùng: "Update: Cập nhật bộ đề và code")
set /p commit_msg="> "
if "%commit_msg%"=="" set commit_msg=Update: Thêm mã QR Zalo vào màn hình kích hoạt bản quyền

echo.
echo [3/3] Đang commit...
git commit -m "%commit_msg%"
if errorlevel 1 (
    echo [ERROR] Không thể commit!
    pause
    exit /b 1
)
echo ✓ Đã commit: %commit_msg%
echo.

:push
echo [4/4] Đang push lên GitHub...
REM Thử push lên main trước
git push -u origin main
if errorlevel 1 (
    REM Nếu main thất bại, thử master
    echo Thử push lên branch master...
    git push -u origin master
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
)

echo.
echo ====================================
echo    ✓ HOÀN THÀNH!
echo ====================================
echo.
echo Code đã được push lên GitHub thành công!
echo Vercel sẽ tự động deploy trong 1-2 phút...
echo.
pause

