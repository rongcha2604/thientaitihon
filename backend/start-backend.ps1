# Start Backend Server
Write-Host "🚀 Starting Backend Server..." -ForegroundColor Green
Write-Host ""

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Host "❌ .env file not found!" -ForegroundColor Red
    Write-Host "Please create .env file first" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ .env file found" -ForegroundColor Green
Write-Host ""

# Start server
Write-Host "Starting server on port 3001..." -ForegroundColor Cyan
npm run dev

