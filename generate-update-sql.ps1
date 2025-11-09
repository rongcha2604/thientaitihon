# Script tu dong tao SQL UPDATE script tu danh sach files thuc te
# Chay: .\generate-update-sql.ps1

Write-Host "Dang tao SQL UPDATE script..." -ForegroundColor Cyan

# Mapping ten item trong database -> ten file
$mappings = @{
    # Characters
    "Trạng Tí" = "character-trang-ti.png"
    "Thằng Bờm" = "character-thang-bom.png"
    "Chị Hằng" = "character-chi-hang.png"
    "Anh Cuội" = "character-anh-cuoi.png"
    "Bà Ngoại" = "character-ba-ngoai.png"
    "Ông Ngoại" = "character-ong-ngoai.png"
    "Cô Giáo" = "character-co-giao.png"
    "Bác Sĩ" = "character-bac-si.png"
    "Bạn Thân" = "character-ban-than.png"
    "Anh Trai" = "character-anh-trai.png"
    "Chị Gái" = "character-chi-gai.png"
    "Em Bé" = "character-em-be.png"
    "Bạn Học" = "character-ban-hoc.png"
    "Cô Bán Hàng" = "character-co-ban-hang.png"
    "Chú Công Nhân" = "character-chu-cong-nhan.png"
    "Bác Nông Dân" = "character-bac-nong-dan.png"
    "Cô Y Tá" = "character-co-y-ta.png"
    "Chú Cảnh Sát" = "character-chu-canh-sat.png"
    "Bạn Nhỏ" = "character-ban-nho.png"
    "Thầy Giáo" = "character-thay-giao.png"
    "Con Trâu Vàng" = "character-con-trau-vang.png"
    "Rồng Con" = "character-rong-con.png"
    "Gà Trống Lửa" = "character-ga-trong-lua.png"
    "Mèo Tam Thể" = "character-meo-tam-the.png"
    "Cá Chép Vàng" = "character-ca-chep-vang.png"
    "Sao La" = "character-sao-la.png"
    "Voi Con" = "character-voi-con.png"
    "Gấu Trúc" = "character-gau-truc-do.png"
    "Khỉ Vàng" = "character-khi-vang.png"
    "Chim Lạc" = "character-chim-lac.png"
    
    # Accessories
    "Nón Lá" = "accessory-non-la.png"
    "Quạt Mo" = "accessory-quat-mo.png"
    "Khăn Rằn" = "accessory-khan-ran.png"
    "Áo Dài" = "accessory-ao-dai.png"
    "Nón Cối" = "accessory-non-coi.png"
    "Kính Mát" = "accessory-kinh-mat.png"
    "Túi Xách" = "accessory-tui-xach.png"
    "Vòng Cổ" = "accessory-vong-co.png"
    "Vòng Tay" = "accessory-vong-tay.png"
    "Cặp Sách" = "accessory-cap-sach.png"
    "Mũ Lưỡi Trai" = "accessory-mu-luoi-trai.png"
    "Khăn Quàng" = "accessory-khan-quang.png"
    "Giày Dép" = "accessory-giay-dep.png"
    "Ô Dù" = "accessory-o-du.png"
    "Balo" = "accessory-balo.png"
    "Mũ Bảo Hiểm" = "accessory-mu-bao-hiem.png"
    "Găng Tay" = "accessory-gang-tay.png"
    "Tất Chân" = "accessory-tat-chan.png"
    "Kính Đeo Mắt" = "accessory-kinh-deo-mat.png"
    "Đồng Hồ" = "accessory-dong-ho.png"
    
    # Frames
    "Khung Cửa Sổ" = "frame-khung-cua-so.png"
    "Khung Làng Quê" = "frame-khung-lang-que.png"
    "Khung Phố Cổ" = "frame-khung-pho-co.png"
    "Khung Biển" = "frame-khung-bien.png"
    "Khung Núi" = "frame-khung-nui.png"
    "Khung Đồng Lúa" = "frame-khung-dong-lua.png"
    "Khung Cầu" = "frame-khung-cau.png"
    "Khung Chùa" = "frame-khung-chua.png"
    "Khung Nhà" = "frame-khung-nha.png"
    "Khung Trường Học" = "frame-khung-truong-hoc.png"
    "Khung Công Viên" = "frame-khung-cong-vien.png"
    "Khung Sông" = "frame-khung-song.png"
    "Khung Rừng" = "frame-khung-rung.png"
    "Khung Thành Phố" = "frame-khung-thanh-pho.png"
    "Khung Chợ" = "frame-khung-cho.png"
    "Khung Vườn" = "frame-khung-vuon.png"
    "Khung Hoàng Hôn" = "frame-khung-hoang-hon.png"
    "Khung Bình Minh" = "frame-khung-binh-minh.png"
    "Khung Trăng" = "frame-khung-trang.png"
    "Khung Sao" = "frame-khung-sao.png"
    
    # Stickers
    "Đèn Lồng" = "sticker-den-long.png"
    "Diều Giấy" = "sticker-dieu-giay.png"
    "Mặt Nạ" = "sticker-mat-na.png"
    "Trống" = "sticker-trong.png"
    "Kèn" = "sticker-ken.png"
    "Đàn" = "sticker-dan.png"
    "Bóng Bay" = "sticker-bong-bay.png"
    "Xe Đạp" = "sticker-xe-dap.png"
    "Máy Bay" = "sticker-may-bay.png"
    "Tàu Thủy" = "sticker-tau-thuy.png"
    "Xe Hơi" = "sticker-xe-hoi.png"
    "Búp Bê" = "sticker-bup-be.png"
    "Gấu Bông" = "sticker-gau-bong.png"
    "Xe Lửa" = "sticker-xe-lua.png"
    "Bánh Chưng" = "sticker-banh-chung.png"
    "Bánh Dày" = "sticker-banh-day.png"
    "Hoa Đào" = "sticker-hoa-dao.png"
    "Hoa Mai" = "sticker-hoa-mai.png"
    "Cờ Tổ Quốc" = "sticker-co-to-quoc.png"
    "Sao Vàng" = "sticker-sao-vang.png"
    "Bánh Xe" = "sticker-banh-xe.png"
}

# Tao SQL script
$sql = "-- SQL Script: Cap nhat imageFile cho tat ca Album Items`n"
$sql += "-- Tu dong tao tu danh sach files thuc te`n"
$sql += "-- Chay script nay trong PostgreSQL de cap nhat duong dan anh`n`n"

# Phan loai theo category
$categories = @{
    "character" = @()
    "accessory" = @()
    "frame" = @()
    "sticker" = @()
}

foreach ($item in $mappings.GetEnumerator()) {
    $name = $item.Key
    $file = $item.Value
    
    # Xac dinh category tu ten file
    if ($file -match "^character-") {
        $categories["character"] += @{ Name = $name; File = $file }
    }
    elseif ($file -match "^accessory-") {
        $categories["accessory"] += @{ Name = $name; File = $file }
    }
    elseif ($file -match "^frame-") {
        $categories["frame"] += @{ Name = $name; File = $file }
    }
    elseif ($file -match "^sticker-") {
        $categories["sticker"] += @{ Name = $name; File = $file }
    }
}

# Generate SQL cho tung category
foreach ($cat in $categories.GetEnumerator()) {
    $categoryName = $cat.Key
    $items = $cat.Value
    
    $sql += "-- " + (Get-Culture).TextInfo.ToTitleCase($categoryName) + "s ($($items.Count) items)`n"
    
    foreach ($item in $items) {
        $name = $item.Name
        $file = $item.File
        $categoryFolder = if ($categoryName -eq "character") { "characters" } 
                         elseif ($categoryName -eq "accessory") { "accessories" }
                         elseif ($categoryName -eq "frame") { "frames" }
                         elseif ($categoryName -eq "sticker") { "stickers" }
        
        # Escape single quotes trong ten
        $nameEscaped = $name -replace "'", "''"
        
        $sql += "UPDATE album_items SET image_file = '/uploads/album/$categoryFolder/$file' WHERE name = '$nameEscaped' AND category = '$categoryName';`n"
    }
    
    $sql += "`n"
}

# Them query kiem tra ket qua
$sql += "-- Xac nhan ket qua`n"
$sql += "SELECT `n"
$sql += "    category,`n"
$sql += "    COUNT(*) as total_items,`n"
$sql += "    COUNT(image_file) as items_with_image,`n"
$sql += "    COUNT(*) - COUNT(image_file) as items_without_image`n"
$sql += "FROM album_items`n"
$sql += "GROUP BY category`n"
$sql += "ORDER BY category;`n"

# Ghi vao file
$outputFile = "update-album-images.sql"
$sql | Out-File -FilePath $outputFile -Encoding UTF8

Write-Host "`nDa tao SQL script: $outputFile" -ForegroundColor Green
Write-Host "Tong so UPDATE statements: $($mappings.Count)" -ForegroundColor Cyan
Write-Host "`nCach chay:" -ForegroundColor Yellow
Write-Host "1. Mo PostgreSQL (psql hoac pgAdmin)" -ForegroundColor White
Write-Host "2. Ket noi den database" -ForegroundColor White
Write-Host "3. Chay: \i update-album-images.sql" -ForegroundColor White
Write-Host "   hoac copy/paste noi dung file vao query editor" -ForegroundColor White

