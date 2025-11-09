# Quick Start - Tạo Vật Phẩm Album

## 🚀 3 Cách Tạo Vật Phẩm

### Cách 1: Dùng Emoji (Nhanh nhất - 5 phút)
**Không cần tạo ảnh, chỉ cần emoji!**

1. Mở file `data/album-items-template.csv`
2. Chọn emoji phù hợp (từ cột `image`)
3. Điền tên, giá, mô tả
4. Lưu file
5. Chạy: `python scripts/import_album_items.py`
6. Import vào database

**✅ Ưu điểm:** Nhanh, không cần design
**❌ Nhược điểm:** Chỉ có emoji, không có ảnh đẹp

---

### Cách 2: Dùng Canva (Dễ nhất - 15 phút/vật phẩm)
**Tạo ảnh đẹp mà không cần kinh nghiệm!**

1. **Mở Canva:** https://www.canva.com
2. **Tạo design mới:**
   - Character/Accessory/Sticker: 512x512px
   - Frame: 1920x1080px
3. **Vẽ hoặc upload ảnh vật phẩm**
4. **Export PNG:**
   - Với nền trong suốt (cho Character/Accessory/Sticker)
   - Hoặc JPG (cho Frame)
5. **Upload ảnh:**
   - Vào `public/uploads/album/{category}/`
   - Upload file ảnh
6. **Cập nhật database:**
   - Field `imageFile`: `/uploads/album/{category}/{filename}.png`
   - Field `image`: Giữ emoji làm fallback

**✅ Ưu điểm:** Ảnh đẹp, dễ tạo
**❌ Nhược điểm:** Cần thời gian tạo ảnh

---

### Cách 3: Dùng Admin Interface (Linh hoạt nhất)
**Tạo trực tiếp trong app!**

1. Vào Admin Dashboard
2. Chọn "Quản lý Album"
3. Click "Thêm vật phẩm mới"
4. Điền thông tin:
   - Tên vật phẩm
   - Category
   - Emoji hoặc upload ảnh
   - Giá coins
   - Mô tả
   - Có thể download không
5. Click "Lưu"

**✅ Ưu điểm:** Linh hoạt, có thể chỉnh sửa sau
**❌ Nhược điểm:** Cần Admin Interface (sẽ tạo sau)

---

## 📋 Checklist Nhanh

### Tạo Vật Phẩm Với Emoji:
- [ ] Mở file CSV
- [ ] Chọn emoji
- [ ] Điền tên, giá, mô tả
- [ ] Lưu file
- [ ] Import vào database

### Tạo Vật Phẩm Với Ảnh:
- [ ] Tạo ảnh (Canva, Photoshop, etc.)
- [ ] Export PNG/JPG
- [ ] Upload vào `public/uploads/album/{category}/`
- [ ] Cập nhật database với `imageFile`
- [ ] Kiểm tra hiển thị trong app

### Tạo File Download:
- [ ] Chuẩn bị file (PNG hoặc ZIP)
- [ ] Upload vào `public/downloads/album/{category}/`
- [ ] Cập nhật database với `downloadFile`
- [ ] Set `downloadable: true`
- [ ] Test download trong app

---

## 🎯 Định Dạng Ảnh Tóm Tắt

| Loại | Định dạng | Kích thước | Nền | File size |
|------|-----------|------------|-----|-----------|
| Character | PNG | 512x512px | Trong suốt | < 500KB |
| Accessory | PNG | 512x512px | Trong suốt | < 300KB |
| Frame | JPG | 1920x1080px | Có màu | < 2MB |
| Sticker | PNG | 512x512px | Trong suốt | < 200KB |

**Xem chi tiết:** `ALBUM_IMAGE_GUIDE.md`

---

## 💡 Tips

1. **Bắt đầu với emoji:** Tạo nhanh 80 vật phẩm với emoji, thêm ảnh sau
2. **Batch tạo ảnh:** Tạo nhiều ảnh cùng lúc, upload hàng loạt
3. **Dùng template:** Tạo template trong Canva, copy và chỉnh sửa
4. **Compress ảnh:** Dùng TinyPNG để giảm file size
5. **Backup:** Giữ file gốc để chỉnh sửa sau

---

## 🔗 Tài Liệu Liên Quan

- **Danh sách 80 vật phẩm:** `album-items-template.json` hoặc `album-items-template.csv`
- **Hướng dẫn chi tiết:** `ALBUM_ITEMS_README.md`
- **Hướng dẫn tạo ảnh:** `ALBUM_IMAGE_GUIDE.md`
- **Script import:** `scripts/import_album_items.py`

