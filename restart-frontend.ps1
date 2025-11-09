# Script để restart frontend với clear cache
Write-Host "🔄 Đang dừng frontend..." -ForegroundColor Yellow

# Tìm và kill process đang chạy trên port 5173
$port = 5173
$processes = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
foreach ($pid in $processes) {
    Write-Host "⚠️  Đang kill process trên port $port (PID: $pid)..." -ForegroundColor Yellow
    Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
}

Write-Host "🧹 Đang xóa Vite cache..." -ForegroundColor Yellow
# Xóa Vite cache
if (Test-Path "node_modules\.vite") {
    Remove-Item -Recurse -Force "node_modules\.vite" -ErrorAction SilentlyContinue
    Write-Host "✅ Đã xóa Vite cache" -ForegroundColor Green
} else {
    Write-Host "ℹ️  Không có Vite cache để xóa" -ForegroundColor Gray
}

Write-Host "📝 Kiểm tra file .env..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Host "✅ File .env tồn tại" -ForegroundColor Green
    Write-Host "📄 Nội dung file .env:" -ForegroundColor Cyan
    Get-Content ".env"
} else {
    Write-Host "❌ File .env không tồn tại!" -ForegroundColor Red
    Write-Host "💡 Tạo file .env với nội dung:" -ForegroundColor Yellow
    Write-Host "VITE_API_BASE_URL=http://192.168.1.38:3001" -ForegroundColor Cyan
}

Write-Host "🚀 Đang khởi động frontend..." -ForegroundColor Yellow
Write-Host "⏳ Đợi 5 giây để frontend start..." -ForegroundColor Gray
Start-Sleep -Seconds 2

# Start frontend
npm run dev

