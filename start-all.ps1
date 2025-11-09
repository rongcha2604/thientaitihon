# 🚀 Start All Services - Backend + Frontend
# Script để khởi động cả backend và frontend cùng lúc

Write-Host "🚀 Starting Backend and Frontend..." -ForegroundColor Green
Write-Host ""

# Check if backend .env exists
$backendEnv = "backend\.env"
if (-not (Test-Path $backendEnv)) {
    Write-Host "❌ Backend .env file not found at: $backendEnv" -ForegroundColor Red
    Write-Host "Please create backend\.env file first" -ForegroundColor Yellow
    exit 1
}

# Check if frontend .env.local exists (optional)
$frontendEnv = ".env.local"
if (-not (Test-Path $frontendEnv)) {
    Write-Host "⚠️  Frontend .env.local not found. Creating default..." -ForegroundColor Yellow
    @"
VITE_API_BASE_URL=http://localhost:3001
"@ | Out-File -FilePath $frontendEnv -Encoding utf8
    Write-Host "✅ Created .env.local" -ForegroundColor Green
}

Write-Host "📋 Starting services:" -ForegroundColor Cyan
Write-Host "  1. Backend (port 3001)" -ForegroundColor White
Write-Host "  2. Frontend (port 5173)" -ForegroundColor White
Write-Host ""

# Start Backend
Write-Host "🔧 Starting Backend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev" -WindowStyle Normal
Start-Sleep -Seconds 3

# Start Frontend
Write-Host "🎨 Starting Frontend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev" -WindowStyle Normal
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "✅ Services started!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 URLs:" -ForegroundColor Cyan
Write-Host "  Backend:  http://localhost:3001" -ForegroundColor White
Write-Host "  Frontend: http://localhost:5173" -ForegroundColor White
Write-Host ""
Write-Host "🔍 Health Check:" -ForegroundColor Cyan
Write-Host "  Backend:  http://localhost:3001/health" -ForegroundColor White
Write-Host ""
Write-Host "💡 Tip: 2 terminal windows đã được mở riêng cho backend và frontend" -ForegroundColor Yellow
Write-Host "   Để dừng: Đóng các terminal windows đó" -ForegroundColor Yellow
Write-Host ""

# Wait a bit and test backend
Start-Sleep -Seconds 5
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/health" -UseBasicParsing -TimeoutSec 3
    Write-Host "✅ Backend is running!" -ForegroundColor Green
} catch {
    Write-Host "⏳ Backend đang khởi động... (có thể cần thêm 5-10 giây)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎉 Setup hoàn tất! Mở browser tại: http://localhost:5173" -ForegroundColor Green

