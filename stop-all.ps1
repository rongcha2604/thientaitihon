# 🛑 Stop All Services - Backend + Frontend
# Script để dừng tất cả services

Write-Host "🛑 Stopping all services..." -ForegroundColor Yellow
Write-Host ""

# Stop Backend (port 3001)
Write-Host "🔧 Stopping Backend (port 3001)..." -ForegroundColor Cyan
$backendProcess = Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
if ($backendProcess) {
    foreach ($pid in $backendProcess) {
        Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
        Write-Host "  ✅ Stopped process $pid" -ForegroundColor Green
    }
} else {
    Write-Host "  ℹ️  No process found on port 3001" -ForegroundColor Gray
}

# Stop Frontend (port 5173)
Write-Host "🎨 Stopping Frontend (port 5173)..." -ForegroundColor Cyan
$frontendProcess = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
if ($frontendProcess) {
    foreach ($pid in $frontendProcess) {
        Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
        Write-Host "  ✅ Stopped process $pid" -ForegroundColor Green
    }
} else {
    Write-Host "  ℹ️  No process found on port 5173" -ForegroundColor Gray
}

# Stop all node processes (optional - be careful!)
Write-Host ""
Write-Host "⚠️  Do you want to stop ALL node processes? (y/n)" -ForegroundColor Yellow
$response = Read-Host
if ($response -eq 'y' -or $response -eq 'Y') {
    $nodeProcesses = Get-Process -Name node -ErrorAction SilentlyContinue
    if ($nodeProcesses) {
        $nodeProcesses | Stop-Process -Force
        Write-Host "  ✅ Stopped all node processes" -ForegroundColor Green
    } else {
        Write-Host "  ℹ️  No node processes found" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "✅ All services stopped!" -ForegroundColor Green

