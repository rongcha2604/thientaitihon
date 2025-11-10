# 🎯 HƯỚNG DẪN TIẾP THEO - SAU KHI TẠO ẢNH LINH VẬT

## ✅ ĐÃ HOÀN THÀNH:

1. ✅ **Code đã được cập nhật** - `AlbumPage.tsx` đã có logic hiển thị ảnh PNG
2. ✅ **Helper function** - `getSpiritPetImage()` tự động tạo đường dẫn ảnh
3. ✅ **Fallback** - Nếu ảnh không tìm thấy, sẽ hiển thị emoji 🐉

---

## 📋 CÁC BƯỚC TIẾP THEO:

### BƯỚC 1: TẠO THƯ MỤC (Nếu chưa có)

Tạo thư mục để chứa ảnh:
```
public/icons/spirit-pets/
```

### BƯỚC 2: ĐẶT 50 FILE PNG VÀO THƯ MỤC

Đặt tất cả 50 file PNG vào thư mục `public/icons/spirit-pets/` với tên file đúng format:

**Format:** `[CODE]_level_[LEVEL].png`

**Ví dụ:**
- `BE_NA_level_1.png`
- `BE_NA_level_2.png`
- `MIU_level_1.png`
- `FLARE_level_5.png`
- ... (tổng cộng 50 files)

### BƯỚC 3: KIỂM TRA TÊN FILE

Đảm bảo tên file khớp với code trong `public/data/spirit-pets.json`:

| Code trong JSON | Tên file PNG |
|----------------|--------------|
| `BE_NA` | `BE_NA_level_1.png` → `BE_NA_level_5.png` |
| `MIU` | `MIU_level_1.png` → `MIU_level_5.png` |
| `FLARE` | `FLARE_level_1.png` → `FLARE_level_5.png` |
| `TURU` | `TURU_level_1.png` → `TURU_level_5.png` |
| `PHOEN` | `PHOEN_level_1.png` → `PHOEN_level_5.png` |
| `DEER` | `DEER_level_1.png` → `DEER_level_5.png` |
| `STARFAE` | `STARFAE_level_1.png` → `STARFAE_level_5.png` |
| `TY` | `TY_level_1.png` → `TY_level_5.png` |
| `SHADOW` | `SHADOW_level_1.png` → `SHADOW_level_5.png` |
| `KILAN` | `KILAN_level_1.png` → `KILAN_level_5.png` |

### BƯỚC 4: TEST TRONG APP

1. **Khởi động app:**
   ```bash
   npm run dev
   # hoặc
   yarn dev
   ```

2. **Vào Album Page:**
   - Mở trình duyệt: `http://localhost:3000/album` (hoặc port của bạn)
   - Click tab **"Linh vật"** 🐉

3. **Kiểm tra:**
   - ✅ Ảnh hiển thị đúng cho linh vật đã unlock
   - ✅ Ảnh thay đổi khi nâng cấp
   - ✅ Modal hiển thị ảnh đúng
   - ✅ Tab "Sở hữu" hiển thị ảnh đúng

### BƯỚC 5: XỬ LÝ LỖI (Nếu có)

**Nếu ảnh không hiển thị:**

1. **Kiểm tra đường dẫn:**
   - File có đúng vị trí: `public/icons/spirit-pets/`?
   - Tên file có đúng format: `[CODE]_level_[LEVEL].png`?

2. **Kiểm tra tên file:**
   - Code trong JSON khớp với tên file?
   - Chữ hoa/thường đúng? (phải chính xác: `BE_NA` không phải `be_na`)

3. **Kiểm tra format:**
   - File có phải PNG không?
   - File có bị corrupt không?

4. **Kiểm tra console:**
   - Mở DevTools (F12)
   - Xem tab Console có lỗi 404 không?
   - Xem tab Network có request ảnh fail không?

**Nếu vẫn không hiển thị:**
- Hệ thống sẽ tự động fallback về emoji 🐉
- Kiểm tra lại tên file và đường dẫn

---

## 🎨 CÁC NƠI ẢNH SẼ HIỂN THỊ:

### 1. Tab "Linh vật" (Album Page)
- ✅ Hiển thị ảnh PNG cho linh vật đã unlock
- ✅ Hiển thị 🔒 cho linh vật chưa unlock
- ✅ Hiển thị progress bar và thông tin nâng cấp

### 2. Tab "Sở hữu" (Album Page)
- ✅ Hiển thị ảnh PNG cho linh vật đã sở hữu
- ✅ Click vào linh vật → Mở modal với ảnh PNG

### 3. Modal "Đặt thành ảnh đại diện" (Tab "Sở hữu")
- ✅ Hiển thị ảnh PNG lớn
- ✅ Hiển thị thông tin linh vật
- ✅ Nút "Đặt thành ảnh đại diện" / "Nâng cấp"

### 4. Modal "Xác nhận nâng cấp" (Tab "Linh vật")
- ✅ Hiển thị 2 ảnh: Cấp hiện tại → Cấp mới
- ✅ Hiển thị chi phí và thông tin nâng cấp

---

## 📝 CHECKLIST HOÀN THÀNH:

- [ ] Đã tạo thư mục `public/icons/spirit-pets/`
- [ ] Đã đặt đủ 50 file PNG vào thư mục
- [ ] Tên file đúng format: `[CODE]_level_[LEVEL].png`
- [ ] Code trong JSON khớp với tên file
- [ ] Test trong app: Vào Album → Tab "Linh vật"
- [ ] Test unlock linh vật: Ảnh hiển thị đúng
- [ ] Test nâng cấp: Ảnh thay đổi đúng
- [ ] Test modal: Ảnh hiển thị trong modal
- [ ] Test tab "Sở hữu": Ảnh hiển thị đúng

---

## 🚀 SAU KHI HOÀN THÀNH:

Hệ thống linh vật đã sẵn sàng! Bạn có thể:

1. **Test đầy đủ:**
   - Unlock linh vật mới
   - Nâng cấp linh vật
   - Đặt làm ảnh đại diện
   - Xem trong tab "Sở hữu"

2. **Tùy chỉnh thêm (nếu cần):**
   - Thêm hiệu ứng animation khi unlock/nâng cấp
   - Thêm sound effects
   - Thêm particle effects

3. **Tối ưu:**
   - Optimize ảnh PNG (compress nếu file quá lớn)
   - Lazy load ảnh (nếu có nhiều linh vật)
   - Cache ảnh trong browser

---

## 💡 TIPS:

1. **Nếu ảnh quá lớn:** Dùng tool compress PNG (TinyPNG, ImageOptim)
2. **Nếu muốn thay đổi đường dẫn:** Sửa trong `getSpiritPetImage()` function
3. **Nếu muốn thêm format khác:** Có thể support WebP, SVG, etc.

---

**Chúc bạn thành công! 🎉**

