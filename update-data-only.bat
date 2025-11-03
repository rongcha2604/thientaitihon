@echo off
chcp 65001 >nul
echo ====================================
echo    Cập nhật BỘ ĐỀ lên GitHub
echo ====================================
echo.

REM Kiểm tra xem đã có git chưa
git --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Git chưa được cài đặt!
    pause
    exit /b 1
)

echo [1/3] Đang thêm chỉ data files...
git add public/data/
if errorlevel 1 (
    echo [ERROR] Không thể add data files!
    pause
    exit /b 1
)
echo ✓ Đã thêm data files
echo.

REM Kiểm tra có thay đổi không
git diff --cached --quiet
if errorlevel 1 (
    echo [2/3] Nhập message cho commit:
    echo (Để trống sẽ dùng: "Update: Cập nhật bộ đề")
    set /p commit_msg="> "
    if "%commit_msg%"=="" set commit_msg=Update: Cập nhật bộ đề
    
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
) else (
    echo [INFO] Không có thay đổi trong data files.
    echo.
    goto :end
)

echo [4/4] Đang push lên GitHub...
git push -u origin main
if errorlevel 1 (
    echo.
    echo [ERROR] Push thất bại!
    echo Hãy kiểm tra và thử lại!
    pause
    exit /b 1
)

:end
echo.
echo ====================================
echo    ✓ HOÀN THÀNH!
echo ====================================
echo.
echo Bộ đề đã được cập nhật lên GitHub!
echo Vercel sẽ tự động deploy trong 1-2 phút...
echo.
pause

