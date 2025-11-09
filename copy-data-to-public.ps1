# Copy data files to public folder for APK build
# Run: .\copy-data-to-public.ps1

Write-Host "Copying data files to public folder..." -ForegroundColor Green

# Create public/data/questions directory if it doesn't exist
$publicDataPath = "public/data/questions"
if (-not (Test-Path $publicDataPath)) {
    New-Item -ItemType Directory -Path $publicDataPath -Force | Out-Null
    Write-Host "Created directory: $publicDataPath" -ForegroundColor Yellow
}

# Copy data files from src to public
if (Test-Path "src/data/questions") {
    Copy-Item -Path "src/data/questions/*" -Destination $publicDataPath -Recurse -Force
    Write-Host "Data files copied successfully!" -ForegroundColor Green
} else {
    Write-Host "Error: src/data/questions not found!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Complete! Data files are now in public/data/questions/" -ForegroundColor Green
Write-Host "Next step: Update path in ExercisePage.tsx to use /data/questions/ instead of /src/data/questions/" -ForegroundColor Yellow



