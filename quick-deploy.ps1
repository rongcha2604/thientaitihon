# Quick Deploy Script
$ErrorActionPreference = "Stop"

# Xác định thư mục dự án
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectDir = $scriptPath

Write-Host "====================================" -ForegroundColor Cyan
Write-Host "   Deploy lên GitHub" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "Thư mục dự án: $projectDir" -ForegroundColor Yellow
Write-Host ""

# Chuyển vào thư mục dự án
Set-Location $projectDir

# Kiểm tra git
if (-not (Test-Path ".git")) {
    Write-Host "[INFO] Khởi tạo git repository..." -ForegroundColor Yellow
    git init
    git branch -M main
}

# Cập nhật remote
Write-Host "[1/4] Cập nhật remote..." -ForegroundColor Yellow
git remote remove origin -ErrorAction SilentlyContinue
git remote add origin https://github.com/rongcha2604/thientaitihon.git
Write-Host "✓ Remote đã được cập nhật" -ForegroundColor Green
Write-Host ""

# Kiểm tra thay đổi
Write-Host "[2/4] Kiểm tra thay đổi..." -ForegroundColor Yellow
$status = git status --short
if ($status) {
    Write-Host "Các file thay đổi:" -ForegroundColor Cyan
    git status --short
    Write-Host ""
    
    # Add tất cả
    Write-Host "[3/4] Đang thêm tất cả thay đổi..." -ForegroundColor Yellow
    git add .
    Write-Host "✓ Đã thêm tất cả files" -ForegroundColor Green
    Write-Host ""
    
    # Commit
    $commitMsg = "Update: Thêm hình ảnh đẹp"
    Write-Host "[4/4] Đang commit..." -ForegroundColor Yellow
    git commit -m $commitMsg
    Write-Host "✓ Đã commit: $commitMsg" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "[INFO] Không có thay đổi nào để commit" -ForegroundColor Yellow
    Write-Host ""
}

# Push
Write-Host "[5/5] Đang push lên GitHub..." -ForegroundColor Yellow
git push -u origin main --force
if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "====================================" -ForegroundColor Cyan
    Write-Host "   ✓ HOÀN THÀNH!" -ForegroundColor Green
    Write-Host "====================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Code đã được push lên GitHub thành công!" -ForegroundColor Green
    Write-Host "Repo: https://github.com/rongcha2604/thientaitihon.git" -ForegroundColor Cyan
    Write-Host "Vercel sẽ tự động deploy trong 1-2 phút..." -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "[ERROR] Push thất bại!" -ForegroundColor Red
    Write-Host "Có thể do:" -ForegroundColor Yellow
    Write-Host "  - Chưa login GitHub" -ForegroundColor Yellow
    Write-Host "  - Không có quyền push vào repo" -ForegroundColor Yellow
    Write-Host "  - Network issues" -ForegroundColor Yellow
}

Write-Host ""

