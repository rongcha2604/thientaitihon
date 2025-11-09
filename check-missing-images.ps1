# Script kiem tra anh con thieu
# Chay: .\check-missing-images.ps1

Write-Host "Dang kiem tra anh con thieu..." -ForegroundColor Cyan
Write-Host ""

# Danh sach day du theo image_prompts.md
$expectedCharacters = @(
    "character-trang-ti.png",
    "character-thang-bom.png",
    "character-chi-hang.png",
    "character-anh-cuoi.png",
    "character-ba-ngoai.png",
    "character-ong-ngoai.png",
    "character-co-giao.png",
    "character-bac-si.png",
    "character-ban-than.png",
    "character-anh-trai.png",
    "character-chi-gai.png",
    "character-em-be.png",
    "character-ban-hoc.png",
    "character-co-ban-hang.png",
    "character-chu-cong-nhan.png",
    "character-bac-nong-dan.png",
    "character-co-y-ta.png",
    "character-chu-canh-sat.png",
    "character-ban-nho.png",
    "character-thay-giao.png",
    "character-con-trau-vang.png",
    "character-rong-con.png",
    "character-ga-trong-lua.png",
    "character-meo-tam-the.png",
    "character-ca-chep-vang.png",
    "character-sao-la.png",
    "character-voi-con.png",
    "character-gau-truc-do.png",
    "character-khi-vang.png",
    "character-chim-lac.png"
)

$expectedAccessories = @(
    "accessory-non-la.png",
    "accessory-quat-mo.png",
    "accessory-khan-ran.png",
    "accessory-ao-dai.png",
    "accessory-non-coi.png",
    "accessory-kinh-mat.png",
    "accessory-tui-xach.png",
    "accessory-vong-co.png",
    "accessory-vong-tay.png",
    "accessory-cap-sach.png",
    "accessory-mu-luoi-trai.png",
    "accessory-khan-quang.png",
    "accessory-giay-dep.png",
    "accessory-o-du.png",
    "accessory-balo.png",
    "accessory-mu-bao-hiem.png",
    "accessory-gang-tay.png",
    "accessory-tat-chan.png",
    "accessory-kinh-deo-mat.png",
    "accessory-dong-ho.png"
)

$expectedFrames = @(
    "frame-khung-cua-so.png",
    "frame-khung-lang-que.png",
    "frame-khung-pho-co.png",
    "frame-khung-bien.png",
    "frame-khung-nui.png",
    "frame-khung-dong-lua.png",
    "frame-khung-cau.png",
    "frame-khung-chua.png",
    "frame-khung-nha.png",
    "frame-khung-truong-hoc.png",
    "frame-khung-cong-vien.png",
    "frame-khung-song.png",
    "frame-khung-rung.png",
    "frame-khung-thanh-pho.png",
    "frame-khung-cho.png",
    "frame-khung-vuon.png",
    "frame-khung-hoang-hon.png",
    "frame-khung-binh-minh.png",
    "frame-khung-trang.png",
    "frame-khung-sao.png"
)

$expectedStickers = @(
    "sticker-den-long.png",
    "sticker-dieu-giay.png",
    "sticker-mat-na.png",
    "sticker-trong.png",
    "sticker-ken.png",
    "sticker-dan.png",
    "sticker-bong-bay.png",
    "sticker-xe-dap.png",
    "sticker-may-bay.png",
    "sticker-tau-thuy.png",
    "sticker-xe-hoi.png",
    "sticker-bup-be.png",
    "sticker-gau-bong.png",
    "sticker-xe-lua.png",
    "sticker-banh-chung.png",
    "sticker-banh-day.png",
    "sticker-hoa-dao.png",
    "sticker-hoa-mai.png",
    "sticker-co-to-quoc.png",
    "sticker-sao-vang.png",
    "sticker-banh-xe.png"
)

# Lay danh sach file hien co
$actualCharacters = Get-ChildItem -Path "public\uploads\album\characters" -Filter "*.png" | Select-Object -ExpandProperty Name
$actualAccessories = Get-ChildItem -Path "public\uploads\album\accessories" -Filter "*.png" | Select-Object -ExpandProperty Name
$actualFrames = Get-ChildItem -Path "public\uploads\album\frames" -Filter "*.png" | Select-Object -ExpandProperty Name
$actualStickers = Get-ChildItem -Path "public\uploads\album\stickers" -Filter "*.png" | Select-Object -ExpandProperty Name

# Tim file con thieu
$missingCharacters = $expectedCharacters | Where-Object { $actualCharacters -notcontains $_ }
$missingAccessories = $expectedAccessories | Where-Object { $actualAccessories -notcontains $_ }
$missingFrames = $expectedFrames | Where-Object { $actualFrames -notcontains $_ }
$missingStickers = $expectedStickers | Where-Object { $actualStickers -notcontains $_ }

# Hien thi ket qua
Write-Host "=== KET QUA KIEM TRA ===" -ForegroundColor Yellow
Write-Host ""

Write-Host "CHARACTERS:" -ForegroundColor Cyan
Write-Host "  Can co: $($expectedCharacters.Count) files" -ForegroundColor White
Write-Host "  Da co: $($actualCharacters.Count) files" -ForegroundColor White
if ($missingCharacters.Count -eq 0) {
    Write-Host "  Trang thai: DAY DU!" -ForegroundColor Green
} else {
    Write-Host "  Trang thai: THIEU $($missingCharacters.Count) files" -ForegroundColor Red
    Write-Host "  Danh sach thieu:" -ForegroundColor Red
    foreach ($file in $missingCharacters) {
        Write-Host "    - $file" -ForegroundColor Red
    }
}
Write-Host ""

Write-Host "ACCESSORIES:" -ForegroundColor Cyan
Write-Host "  Can co: $($expectedAccessories.Count) files" -ForegroundColor White
Write-Host "  Da co: $($actualAccessories.Count) files" -ForegroundColor White
if ($missingAccessories.Count -eq 0) {
    Write-Host "  Trang thai: DAY DU!" -ForegroundColor Green
} else {
    Write-Host "  Trang thai: THIEU $($missingAccessories.Count) files" -ForegroundColor Red
    Write-Host "  Danh sach thieu:" -ForegroundColor Red
    foreach ($file in $missingAccessories) {
        Write-Host "    - $file" -ForegroundColor Red
    }
}
Write-Host ""

Write-Host "FRAMES:" -ForegroundColor Cyan
Write-Host "  Can co: $($expectedFrames.Count) files" -ForegroundColor White
Write-Host "  Da co: $($actualFrames.Count) files" -ForegroundColor White
if ($missingFrames.Count -eq 0) {
    Write-Host "  Trang thai: DAY DU!" -ForegroundColor Green
} else {
    Write-Host "  Trang thai: THIEU $($missingFrames.Count) files" -ForegroundColor Red
    Write-Host "  Danh sach thieu:" -ForegroundColor Red
    foreach ($file in $missingFrames) {
        Write-Host "    - $file" -ForegroundColor Red
    }
}
Write-Host ""

Write-Host "STICKERS:" -ForegroundColor Cyan
Write-Host "  Can co: $($expectedStickers.Count) files" -ForegroundColor White
Write-Host "  Da co: $($actualStickers.Count) files" -ForegroundColor White
if ($missingStickers.Count -eq 0) {
    Write-Host "  Trang thai: DAY DU!" -ForegroundColor Green
} else {
    Write-Host "  Trang thai: THIEU $($missingStickers.Count) files" -ForegroundColor Red
    Write-Host "  Danh sach thieu:" -ForegroundColor Red
    foreach ($file in $missingStickers) {
        Write-Host "    - $file" -ForegroundColor Red
    }
}
Write-Host ""

# Tong ket
$totalMissing = $missingCharacters.Count + $missingAccessories.Count + $missingFrames.Count + $missingStickers.Count
if ($totalMissing -eq 0) {
    Write-Host "=== TONG KET: TAT CA ANH DA DAY DU! ===" -ForegroundColor Green
} else {
    Write-Host "=== TONG KET: CON THIEU $totalMissing ANH ===" -ForegroundColor Red
}

