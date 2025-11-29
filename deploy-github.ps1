# PowerShell script để deploy lên GitHub
# Chạy: .\deploy-github.ps1

$ErrorActionPreference = "Stop"

Write-Host "====================================" -ForegroundColor Cyan
Write-Host "   Tự động cập nhật lên GitHub" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Kiểm tra git
try {
    $gitVersion = git --version
    Write-Host "[INFO] Git version: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Git chưa được cài đặt!" -ForegroundColor Red
    Write-Host "Vui lòng cài đặt Git từ https://git-scm.com/" -ForegroundColor Yellow
    exit 1
}

# Kiểm tra có thay đổi không
$status = git status --porcelain
if ($status) {
    Write-Host "[1/4] Đang thêm tất cả thay đổi..." -ForegroundColor Yellow
    git add .
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] Không thể add files!" -ForegroundColor Red
        exit 1
    }
    Write-Host "✓ Đã thêm tất cả files" -ForegroundColor Green
    Write-Host ""

    # Commit message
    $commitMsg = Read-Host "[2/4] Nhập message cho commit (Enter để dùng mặc định)"
    if ([string]::IsNullOrWhiteSpace($commitMsg)) {
        $commitMsg = "Update: Thêm mã QR Zalo vào màn hình kích hoạt bản quyền"
    }

    Write-Host ""
    Write-Host "[3/4] Đang commit..." -ForegroundColor Yellow
    git commit -m $commitMsg
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] Không thể commit!" -ForegroundColor Red
        exit 1
    }
    Write-Host "✓ Đã commit: $commitMsg" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "[INFO] Không có thay đổi nào để commit." -ForegroundColor Yellow
    Write-Host ""
}

# Push lên GitHub
Write-Host "[4/4] Đang push lên GitHub..." -ForegroundColor Yellow
$branch = git branch --show-current
if ([string]::IsNullOrWhiteSpace($branch)) {
    $branch = "main"
}

git push -u origin $branch
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "[ERROR] Push thất bại!" -ForegroundColor Red
    Write-Host "Có thể do:" -ForegroundColor Yellow
    Write-Host "  - Chưa login GitHub" -ForegroundColor Yellow
    Write-Host "  - Không có quyền push vào repo" -ForegroundColor Yellow
    Write-Host "  - Network issues" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Hãy kiểm tra và thử lại!" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "   ✓ HOÀN THÀNH!" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Code đã được push lên GitHub thành công!" -ForegroundColor Green
Write-Host "Vercel sẽ tự động deploy trong 1-2 phút..." -ForegroundColor Yellow
Write-Host ""

