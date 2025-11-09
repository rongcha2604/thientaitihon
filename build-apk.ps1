# Build APK Script for Windows PowerShell
# Run: .\build-apk.ps1

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

# Step 3: Copy data files to public folder
Write-Host "Step 3: Copying data files to public folder..." -ForegroundColor Yellow
$publicDataPath = "public/data/questions"
if (-not (Test-Path $publicDataPath)) {
    New-Item -ItemType Directory -Path $publicDataPath -Force | Out-Null
}
if (Test-Path "src/data/questions") {
    Copy-Item -Path "src/data/questions/*" -Destination $publicDataPath -Recurse -Force
    Write-Host "Data files copied successfully!" -ForegroundColor Green
} else {
    Write-Host "Warning: src/data/questions not found!" -ForegroundColor Yellow
}

# Step 3.2: Verify album data files
Write-Host "Step 3.2: Verifying album data files..." -ForegroundColor Yellow
$albumJsonPath = "public/data/album-items.json"
$albumImagesPath = "public/uploads/album"
if (Test-Path $albumJsonPath) {
    Write-Host "Album items JSON found!" -ForegroundColor Green
} else {
    Write-Host "Warning: album-items.json not found! Album may not work in APK." -ForegroundColor Yellow
}
if (Test-Path $albumImagesPath) {
    $imageCount = (Get-ChildItem -Path $albumImagesPath -Recurse -Filter "*.png" -ErrorAction SilentlyContinue).Count
    Write-Host "Found $imageCount album images!" -ForegroundColor Green
} else {
    Write-Host "Warning: Album images folder not found! Album images may not display in APK." -ForegroundColor Yellow
}

# Step 3.5: Ensure audio files are in public folder
Write-Host "Step 3.5: Checking audio files..." -ForegroundColor Yellow
$publicAudioPath = "public/audio"
if (-not (Test-Path $publicAudioPath)) {
    New-Item -ItemType Directory -Path $publicAudioPath -Force | Out-Null
    Write-Host "Created audio directory" -ForegroundColor Yellow
}
if (Test-Path "public/audio") {
    $audioCount = (Get-ChildItem -Path "public/audio" -Filter "*.mp3" -ErrorAction SilentlyContinue).Count
    Write-Host "Found $audioCount audio files in public/audio" -ForegroundColor Green
} else {
    Write-Host "Warning: public/audio not found!" -ForegroundColor Yellow
}

# Step 4: Build production
Write-Host "Step 4: Building production..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error building production!" -ForegroundColor Red
    exit 1
}

# Step 5: Sync with Capacitor
Write-Host "Step 5: Syncing with Capacitor..." -ForegroundColor Yellow
npx cap sync android
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error syncing with Capacitor!" -ForegroundColor Red
    exit 1
}

# Step 6: Ask user which build method to use
Write-Host ""
Write-Host "Step 6: Build APK" -ForegroundColor Yellow
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
Write-Host "Complete!" -ForegroundColor Green
