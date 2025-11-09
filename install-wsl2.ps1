# Script cài đặt WSL2 trên Windows
# Chạy PowerShell as Administrator: Right-click PowerShell -> Run as Administrator

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  CÀI ĐẶT WSL2 (Windows Subsystem for Linux 2)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Kiểm tra quyền Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "❌ LỖI: Script này cần chạy với quyền Administrator!" -ForegroundColor Red
    Write-Host "   Vui lòng: Right-click PowerShell -> Run as Administrator" -ForegroundColor Yellow
    Write-Host ""
    pause
    exit 1
}

Write-Host "✅ Đã có quyền Administrator" -ForegroundColor Green
Write-Host ""

# Bước 1: Enable WSL feature
Write-Host "[1/4] Đang enable WSL feature..." -ForegroundColor Yellow
try {
    Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Windows-Subsystem-Linux -NoRestart -ErrorAction Stop
    Write-Host "✅ WSL feature đã được enable" -ForegroundColor Green
} catch {
    Write-Host "⚠️  WSL feature có thể đã được enable trước đó" -ForegroundColor Yellow
}
Write-Host ""

# Bước 2: Enable Virtual Machine Platform
Write-Host "[2/4] Đang enable Virtual Machine Platform..." -ForegroundColor Yellow
try {
    Enable-WindowsOptionalFeature -Online -FeatureName VirtualMachinePlatform -NoRestart -ErrorAction Stop
    Write-Host "✅ Virtual Machine Platform đã được enable" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Virtual Machine Platform có thể đã được enable trước đó" -ForegroundColor Yellow
}
Write-Host ""

# Bước 3: Set WSL2 làm default version
Write-Host "[3/4] Đang set WSL2 làm default version..." -ForegroundColor Yellow
try {
    wsl --set-default-version 2
    Write-Host "✅ WSL2 đã được set làm default version" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Có thể cần restart máy trước khi set default version" -ForegroundColor Yellow
    Write-Host "   Sau khi restart, chạy lệnh: wsl --set-default-version 2" -ForegroundColor Yellow
}
Write-Host ""

# Bước 4: Hướng dẫn cài Linux distribution
Write-Host "[4/4] Hướng dẫn cài Linux distribution..." -ForegroundColor Yellow
Write-Host ""
Write-Host "📦 BƯỚC TIẾP THEO:" -ForegroundColor Cyan
Write-Host "   1. Restart máy tính (nếu được yêu cầu)" -ForegroundColor White
Write-Host "   2. Mở Microsoft Store và tìm 'Ubuntu' hoặc 'Ubuntu 22.04 LTS'" -ForegroundColor White
Write-Host "   3. Click 'Get' hoặc 'Install' để cài Ubuntu" -ForegroundColor White
Write-Host "   4. Sau khi cài xong, mở Ubuntu từ Start Menu" -ForegroundColor White
Write-Host "   5. Setup username và password cho Ubuntu" -ForegroundColor White
Write-Host ""
Write-Host "   HOẶC chạy lệnh sau trong PowerShell (sau khi restart):" -ForegroundColor Yellow
Write-Host "   wsl --install -d Ubuntu" -ForegroundColor Green
Write-Host ""

# Kiểm tra xem có cần restart không
$restartNeeded = $false
$features = Get-WindowsOptionalFeature -Online | Where-Object { $_.FeatureName -eq "Microsoft-Windows-Subsystem-Linux" -or $_.FeatureName -eq "VirtualMachinePlatform" }
foreach ($feature in $features) {
    if ($feature.RestartNeeded) {
        $restartNeeded = $true
        break
    }
}

if ($restartNeeded) {
    Write-Host "⚠️  CẦN RESTART MÁY!" -ForegroundColor Red
    Write-Host "   Sau khi restart, chạy lại script này hoặc:" -ForegroundColor Yellow
    Write-Host "   wsl --set-default-version 2" -ForegroundColor Green
    Write-Host "   wsl --install -d Ubuntu" -ForegroundColor Green
    Write-Host ""
    $restart = Read-Host "Bạn có muốn restart ngay bây giờ không? (Y/N)"
    if ($restart -eq "Y" -or $restart -eq "y") {
        Restart-Computer
    }
} else {
    Write-Host "✅ Các features đã được enable thành công!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📝 Để cài Ubuntu, chạy lệnh:" -ForegroundColor Cyan
    Write-Host "   wsl --install -d Ubuntu" -ForegroundColor Green
    Write-Host ""
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  HOÀN TẤT!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

