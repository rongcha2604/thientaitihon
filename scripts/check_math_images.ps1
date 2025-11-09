# Script để kiểm tra ảnh math questions đã copy chưa
# Chạy: .\scripts\check_math_images.ps1

$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$imagesDir = "public/data/questions/images/math"
$promptsFile = "math-question-image-prompts.md"

Write-Host "`nKiem tra anh Math Questions" -ForegroundColor Cyan
Write-Host ("=" * 60)

# Kiem tra thu muc
if (-not (Test-Path $imagesDir)) {
    Write-Host "[X] Thu muc chua ton tai: $imagesDir" -ForegroundColor Red
    Write-Host "[!] Tao thu muc..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $imagesDir -Force | Out-Null
    Write-Host "[OK] Da tao thu muc" -ForegroundColor Green
} else {
    Write-Host "[OK] Thu muc da ton tai: $imagesDir" -ForegroundColor Green
}

# Doc prompts file de lay danh sach 10 anh dau tien
if (Test-Path $promptsFile) {
    Write-Host "`n[!] Dang doc prompts file..." -ForegroundColor Yellow
    $content = Get-Content $promptsFile -Raw -Encoding UTF8
    
    # Tim tat ca "**Ten file:** `filename.png`"
    $fileMatches = [regex]::Matches($content, '\*\*Ten file:\*\* `([^`]+)`')
    
    Write-Host "[!] Tim thay $($fileMatches.Count) filenames trong prompts file" -ForegroundColor Cyan
    
    # Lay 10 anh dau tien
    $first10Files = $fileMatches | Select-Object -First 10 | ForEach-Object { $_.Groups[1].Value }
    
    Write-Host "`n[!] Danh sach 10 anh dau tien can copy:" -ForegroundColor Yellow
    Write-Host ("-" * 60)
    
    $foundCount = 0
    $missingCount = 0
    
    foreach ($filename in $first10Files) {
        $filePath = Join-Path $imagesDir $filename
        if (Test-Path $filePath) {
            Write-Host "[OK] $filename" -ForegroundColor Green
            $foundCount++
        } else {
            Write-Host "[X] $filename (CHUA CO)" -ForegroundColor Red
            $missingCount++
        }
    }
    
    Write-Host ("-" * 60)
    Write-Host "`n[!] Tong ket:" -ForegroundColor Cyan
    Write-Host "   [OK] Da co: $foundCount / 10 anh" -ForegroundColor Green
    Write-Host "   [X] Chua co: $missingCount / 10 anh" -ForegroundColor $(if ($missingCount -gt 0) { "Red" } else { "Green" })
    
    if ($missingCount -gt 0) {
        Write-Host "`n[!] Huong dan:" -ForegroundColor Yellow
        Write-Host "   1. Copy $missingCount anh con thieu vao thu muc: $imagesDir" -ForegroundColor White
        Write-Host "   2. Dam bao ten file dung voi ten trong prompts file" -ForegroundColor White
        Write-Host "   3. Chay lai script nay de kiem tra" -ForegroundColor White
    } else {
        Write-Host "`n[OK] Tat ca 10 anh da co! Ban co the tiep tuc voi buoc tiep theo:" -ForegroundColor Green
        Write-Host "   1. Chay: python scripts/update_math_question_images.py" -ForegroundColor White
        Write-Host "   2. Chay: .\copy-data-to-public.ps1" -ForegroundColor White
        Write-Host "   3. Chay: .\build-apk.ps1" -ForegroundColor White
    }
} else {
    Write-Host "[X] Khong tim thay file: $promptsFile" -ForegroundColor Red
}

Write-Host "`n" -NoNewline

