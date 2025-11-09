# Build APK Script for Windows PowerShell
# Run: .\build-apk-en.ps1

$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "Starting Android APK build..." -ForegroundColor Green

# Step 1: Install dependencies
Write-Host "Step 1: Installing dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error installing dependencies!" -ForegroundColor Red
    exit 1
}

# Step 2: Check if android folder doesn't exist
if (-not (Test-Path "android")) {
    Write-Host "Step 2: Adding Android platform..." -ForegroundColor Yellow
    npx cap add android
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error adding Android platform!" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "Android platform already exists" -ForegroundColor Green
}

# Step 3: Build production
Write-Host "Step 3: Building production..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error building production!" -ForegroundColor Red
    exit 1
}

# Step 4: Sync with Capacitor
Write-Host "Step 4: Syncing with Capacitor..." -ForegroundColor Yellow
npx cap sync android
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error syncing with Capacitor!" -ForegroundColor Red
    exit 1
}

# Step 5: Ask user which build method to use
Write-Host ""
Write-Host "Step 5: Build APK" -ForegroundColor Yellow
Write-Host "Choose build method:" -ForegroundColor Cyan
Write-Host "1. Open Android Studio (recommended)" -ForegroundColor White
Write-Host "2. Build using command line (Gradle)" -ForegroundColor White
$choice = Read-Host "Enter choice (1 or 2)"

if ($choice -eq "1") {
    Write-Host "Opening Android Studio..." -ForegroundColor Green
    npx cap open android
    Write-Host ""
    Write-Host "Android Studio opened!" -ForegroundColor Green
    Write-Host "In Android Studio:" -ForegroundColor Cyan
    Write-Host "   1. Wait for Gradle sync to complete" -ForegroundColor White
    Write-Host "   2. Build -> Build Bundle(s) / APK(s) -> Build APK(s)" -ForegroundColor White
    Write-Host "   3. APK will be at: android/app/build/outputs/apk/debug/app-debug.apk" -ForegroundColor White
} elseif ($choice -eq "2") {
    Write-Host "Building APK using Gradle..." -ForegroundColor Green
    Set-Location android
    ./gradlew assembleDebug
    if ($LASTEXITCODE -eq 0) {
        Set-Location ..
        $apkPath = "android/app/build/outputs/apk/debug/app-debug.apk"
        if (Test-Path $apkPath) {
            Write-Host ""
            Write-Host "APK build successful!" -ForegroundColor Green
            Write-Host "APK location: $apkPath" -ForegroundColor Cyan
            Write-Host ""
            Write-Host "To install on phone:" -ForegroundColor Yellow
            Write-Host "   1. Copy APK file to phone" -ForegroundColor White
            Write-Host "   2. Enable 'Install from Unknown Sources' in Settings" -ForegroundColor White
            Write-Host "   3. Tap APK file to install" -ForegroundColor White
        } else {
            Write-Host "APK file not found!" -ForegroundColor Red
        }
    } else {
        Set-Location ..
        Write-Host "Error building APK!" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "Invalid choice!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Complete! 🎉" -ForegroundColor Green




