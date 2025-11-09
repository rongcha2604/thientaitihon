# Danh Sách 80 Vật Phẩm Album

## 📋 Tổng Quan

- **Tổng số vật phẩm:** 80
- **Tổng giá:** 1,376 coins
- **Giá trung bình:** 17.2 coins

## 📊 Phân Bổ Theo Category

### 1. Character (Nhân vật) - 20 vật phẩm
- **Giá:** 20-30 coins
- **Tổng giá:** ~480 coins
- **Đặc điểm:** Nhân vật trong truyện, giáo dục
- **Downloadable:** ❌ (chỉ xem trong app)

### 2. Accessory (Trang phục) - 20 vật phẩm
- **Giá:** 14-25 coins
- **Tổng giá:** ~358 coins
- **Đặc điểm:** Phụ kiện, trang phục Việt Nam
- **Downloadable:** ✅ (có thể tải về)

### 3. Frame (Khung cảnh) - 20 vật phẩm
- **Giá:** 10-20 coins
- **Tổng giá:** ~330 coins
- **Đặc điểm:** Khung cảnh Việt Nam
- **Downloadable:** ✅ (có thể tải về)

### 4. Sticker (Đồ chơi) - 20 vật phẩm
- **Giá:** 5-15 coins
- **Tổng giá:** ~208 coins
- **Đặc điểm:** Đồ chơi, sticker vui nhộn
- **Downloadable:** ✅ (có thể tải về)

## 🎯 Hệ Thống Coins

### Coins Tặng Mỗi Thử Thách:
- **Base:** 10 coins (hoàn thành 100% câu đúng)
- **Bonus streak:** +5 coins (5+ câu liên tiếp đúng)
- **Bonus lần đầu:** +5 coins (hoàn thành lần đầu)
- **Bonus hoàn hảo:** +5 coins (không sai câu nào)
- **Tổng tối đa:** 10-25 coins/thử thách

### Tổng Coins Có Thể Kiếm:
- **86 thử thách × 10 coins = 860 coins** (base)
- **Bonus (ước tính 50%):** +430 coins
- **Tổng:** ~1,300 coins (đủ để mua ~75% vật phẩm)

## 📝 Cách Sử Dụng File

### File JSON (`album-items-template.json`)
- Dùng để import vào database
- Format chuẩn, dễ đọc
- Có summary statistics

### File CSV (`album-items-template.csv`)
- Dùng để chỉnh sửa trong Excel/Google Sheets
- Dễ thêm/sửa/xóa
- Có thể export lại JSON

## 🔧 Cách Tạo Vật Phẩm

### Option 1: Admin Interface (Khuyến nghị)
1. Vào Admin Dashboard
2. Chọn "Quản lý Album"
3. Click "Thêm vật phẩm mới"
4. Điền thông tin:
   - Tên vật phẩm
   - Category (character/accessory/frame/sticker)
   - Emoji hoặc upload ảnh
   - Giá coins
   - Mô tả
   - Có thể download không
5. Click "Lưu"

### Option 2: Import từ JSON
1. Chuẩn bị file JSON (theo format template)
2. Vào Admin Dashboard
3. Chọn "Import vật phẩm"
4. Upload file JSON
5. Xác nhận import

### Option 3: Thêm thủ công vào Database
1. Sử dụng Prisma Studio hoặc SQL
2. Insert vào bảng `album_items`
3. Đảm bảo format đúng

## 🎨 Tùy Chỉnh Vật Phẩm

### Thay Đổi Emoji:
- Mở file CSV hoặc JSON
- Tìm field `image`
- Thay emoji mới
- Lưu và import lại

### Thay Đổi Giá:
- Mở file CSV hoặc JSON
- Tìm field `price`
- Điều chỉnh giá (theo category)
- Lưu và import lại

### Thêm Hình Ảnh File:
1. **Tạo ảnh:**
   - Định dạng: PNG (cho Character/Accessory/Sticker) hoặc JPG (cho Frame)
   - Kích thước: 512x512px (Character/Accessory/Sticker) hoặc 1920x1080px (Frame)
   - Nền: Trong suốt (PNG) hoặc có màu (JPG)
   - Xem chi tiết: `ALBUM_IMAGE_GUIDE.md`

2. **Upload ảnh:**
   - Upload vào `public/uploads/album/{category}/`
   - Ví dụ: `public/uploads/album/characters/trang-ti.png`

3. **Cập nhật database:**
   - Field `imageFile`: `/uploads/album/{category}/{filename}.png`
   - Field `image`: Giữ emoji làm fallback

### Thêm File Download:
1. **Chuẩn bị file:**
   - PNG: Ảnh đơn lẻ (512x512px)
   - ZIP: Sticker pack (nhiều sticker + info.json)
   - Xem chi tiết: `ALBUM_IMAGE_GUIDE.md`

2. **Upload file:**
   - Upload vào `public/downloads/album/{category}/`
   - Ví dụ: `public/downloads/album/stickers/sticker-pack-tet.zip`

3. **Cập nhật database:**
   - Field `downloadFile`: `/downloads/album/{category}/{filename}.zip`
   - Field `downloadable`: `true`

## 📊 Thống Kê

### Phân Bổ Giá:
- **Character:** 20-30 coins (trung bình: 24)
- **Accessory:** 14-25 coins (trung bình: 17.9)
- **Frame:** 10-20 coins (trung bình: 16.5)
- **Sticker:** 5-15 coins (trung bình: 10.4)

### Độ Hiếm:
- **Common (Thường):** 5-15 coins (Sticker, Frame rẻ)
- **Rare (Hiếm):** 16-25 coins (Accessory, Character rẻ)
- **Epic (Cực hiếm):** 26-30 coins (Character đắt)

## 🔄 Cập Nhật

Khi thêm/sửa/xóa vật phẩm:
1. Cập nhật file JSON/CSV
2. Import vào database (nếu dùng file)
3. Hoặc cập nhật qua Admin Interface
4. Kiểm tra lại trong AlbumPage

## 💡 Gợi Ý

### Để Tạo 80 Vật Phẩm Nhanh:
1. Dùng file CSV để chỉnh sửa trong Excel
2. Export lại JSON
3. Import vào database
4. Hoặc dùng Admin Interface để thêm từng cái

### Để Tùy Chỉnh:
1. Thay đổi emoji trong file CSV
2. Điều chỉnh giá theo ý muốn
3. Thêm mô tả chi tiết hơn
4. Thêm hình ảnh file nếu cần

### Để Thêm Vật Phẩm Mới:
1. Mở file CSV
2. Thêm dòng mới
3. Điền đầy đủ thông tin
4. Lưu và import lại

