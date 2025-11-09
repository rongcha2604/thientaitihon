# Script tao thu muc cho Album Images
# Chay: .\setup-album-folders.ps1

Write-Host "Dang tao thu muc cho Album Images..." -ForegroundColor Cyan

# Tao thu muc uploads/album
$basePath = "public\uploads\album"

# Tao cac thu muc category
$categories = @("characters", "accessories", "frames", "stickers")

foreach ($category in $categories) {
    $folderPath = Join-Path $basePath $category
    if (-not (Test-Path $folderPath)) {
        New-Item -ItemType Directory -Path $folderPath -Force | Out-Null
        Write-Host "Da tao: $folderPath" -ForegroundColor Green
    } else {
        Write-Host "Da ton tai: $folderPath" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Hoan thanh! Cau truc thu muc:" -ForegroundColor Green
Write-Host "public/uploads/album/" -ForegroundColor Cyan
foreach ($category in $categories) {
    Write-Host "  +-- $category/" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "Buoc tiep theo:" -ForegroundColor Yellow
Write-Host "1. Copy anh vao cac thu muc tuong ung" -ForegroundColor White
Write-Host "2. Dam bao ten file dung format: category-name.png" -ForegroundColor White
Write-Host "3. Cap nhat database voi imageFile" -ForegroundColor White
Write-Host "4. Xem huong dan chi tiet: UPLOAD_ALBUM_IMAGES.md" -ForegroundColor White
