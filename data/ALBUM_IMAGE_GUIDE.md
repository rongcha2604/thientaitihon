# Hướng Dẫn Tạo Ảnh Vật Phẩm Album

## 📸 Định Dạng Ảnh Khuyến Nghị

### 1. **PNG (Khuyến nghị nhất)**
- **Ưu điểm:**
  - Hỗ trợ trong suốt (transparent background)
  - Chất lượng cao, không mất dữ liệu
  - Phù hợp cho vật phẩm có nền trong suốt
- **Nhược điểm:**
  - File size lớn hơn JPG
- **Dùng cho:** Character, Accessory, Sticker (cần nền trong suốt)

### 2. **JPG/JPEG**
- **Ưu điểm:**
  - File size nhỏ, tải nhanh
  - Phù hợp cho ảnh có nhiều màu
- **Nhược điểm:**
  - Không hỗ trợ trong suốt
  - Có thể mất chất lượng khi nén
- **Dùng cho:** Frame (khung cảnh), ảnh nền

### 3. **WebP (Hiện đại)**
- **Ưu điểm:**
  - File size nhỏ nhất
  - Chất lượng cao
  - Hỗ trợ trong suốt
- **Nhược điểm:**
  - Một số trình duyệt cũ không hỗ trợ
- **Dùng cho:** Tất cả loại vật phẩm (nếu browser support)

### 4. **SVG (Vector)**
- **Ưu điểm:**
  - Không mất chất lượng khi zoom
  - File size nhỏ
  - Có thể chỉnh sửa dễ dàng
- **Nhược điểm:**
  - Phức tạp hơn để tạo
- **Dùng cho:** Icon, logo đơn giản

## 📐 Kích Thước Khuyến Nghị

### Character (Nhân vật):
- **Kích thước:** 512x512px hoặc 1024x1024px
- **Tỷ lệ:** 1:1 (vuông)
- **Nền:** Trong suốt (transparent)
- **Định dạng:** PNG
- **File size:** < 500KB

### Accessory (Trang phục):
- **Kích thước:** 512x512px hoặc 1024x1024px
- **Tỷ lệ:** 1:1 (vuông)
- **Nền:** Trong suốt (transparent)
- **Định dạng:** PNG
- **File size:** < 300KB

### Frame (Khung cảnh):
- **Kích thước:** 1920x1080px (Full HD) hoặc 3840x2160px (4K)
- **Tỷ lệ:** 16:9 (ngang)
- **Nền:** Có màu hoặc ảnh nền
- **Định dạng:** JPG hoặc PNG
- **File size:** < 2MB

### Sticker (Đồ chơi):
- **Kích thước:** 512x512px hoặc 1024x1024px
- **Tỷ lệ:** 1:1 (vuông)
- **Nền:** Trong suốt (transparent)
- **Định dạng:** PNG
- **File size:** < 200KB

## 🎨 Yêu Cầu Chất Lượng

### Màu Sắc:
- **Color mode:** RGB (không dùng CMYK)
- **Color depth:** 24-bit (8-bit per channel)
- **Color space:** sRGB

### Độ Phân Giải:
- **DPI/PPI:** 72-150 DPI (cho web)
- **Resolution:** Đủ để hiển thị rõ trên màn hình

### Nén Ảnh:
- **PNG:** Không nén quá nhiều (giữ chất lượng)
- **JPG:** Quality 80-90% (cân bằng size và chất lượng)
- **WebP:** Quality 80-90%

## 📁 Cấu Trúc Thư Mục

```
public/
├── uploads/
│   └── album/
│       ├── characters/      # Ảnh nhân vật
│       ├── accessories/     # Ảnh trang phục
│       ├── frames/          # Ảnh khung cảnh
│       └── stickers/        # Ảnh sticker
└── downloads/
    └── album/
        ├── characters/      # File download nhân vật
        ├── accessories/     # File download trang phục
        ├── frames/          # File download khung cảnh
        └── stickers/        # File download sticker (ZIP pack)
```

## 🛠️ Công Cụ Tạo Ảnh

### 1. **Canva (Khuyến nghị - Dễ dùng)**
- **Link:** https://www.canva.com
- **Ưu điểm:**
  - Dễ sử dụng, không cần kinh nghiệm
  - Nhiều template sẵn
  - Export PNG/JPG dễ dàng
- **Cách dùng:**
  1. Tạo design mới (512x512px)
  2. Vẽ/upload ảnh vật phẩm
  3. Export PNG (với nền trong suốt)
  4. Download về máy

### 2. **Photoshop**
- **Ưu điểm:**
  - Chuyên nghiệp, nhiều tính năng
  - Chỉnh sửa chi tiết
- **Nhược điểm:**
  - Cần kinh nghiệm
  - Trả phí

### 3. **GIMP (Miễn phí)**
- **Link:** https://www.gimp.org
- **Ưu điểm:**
  - Miễn phí, mã nguồn mở
  - Tương tự Photoshop
- **Nhược điểm:**
  - Giao diện phức tạp hơn Canva

### 4. **Figma (Online)**
- **Link:** https://www.figma.com
- **Ưu điểm:**
  - Online, không cần cài đặt
  - Dễ dùng, nhiều tính năng
- **Nhược điểm:**
  - Cần internet

### 5. **Paint.NET (Windows - Miễn phí)**
- **Link:** https://www.getpaint.net
- **Ưu điểm:**
  - Miễn phí, dễ dùng
  - Hỗ trợ PNG với nền trong suốt
- **Nhược điểm:**
  - Chỉ có trên Windows

## 📝 Quy Trình Tạo Ảnh

### Bước 1: Chuẩn Bị
1. Chọn công cụ (Canva khuyến nghị)
2. Tạo canvas mới với kích thước phù hợp:
   - Character/Accessory/Sticker: 512x512px
   - Frame: 1920x1080px

### Bước 2: Tạo Ảnh
1. Vẽ hoặc upload ảnh vật phẩm
2. Chỉnh sửa màu sắc, kích thước
3. Thêm hiệu ứng nếu cần (shadow, glow, etc.)
4. Đảm bảo nền trong suốt (cho Character/Accessory/Sticker)

### Bước 3: Export
1. **PNG (cho Character/Accessory/Sticker):**
   - Export với nền trong suốt
   - Quality: High
   - File name: `{category}-{name}.png`
   - Ví dụ: `character-trang-ti.png`

2. **JPG (cho Frame):**
   - Export với nền màu
   - Quality: 80-90%
   - File name: `{category}-{name}.jpg`
   - Ví dụ: `frame-lang-que.jpg`

### Bước 4: Tối Ưu
1. **Compress ảnh (nếu cần):**
   - Tool: TinyPNG (https://tinypng.com)
   - Giảm file size mà không mất chất lượng

2. **Kiểm tra:**
   - File size < giới hạn
   - Chất lượng đủ rõ
   - Nền trong suốt (nếu cần)

### Bước 5: Upload
1. Upload vào thư mục phù hợp:
   - `public/uploads/album/characters/`
   - `public/uploads/album/accessories/`
   - `public/uploads/album/frames/`
   - `public/uploads/album/stickers/`

2. Cập nhật database:
   - Field `imageFile`: `/uploads/album/{category}/{filename}.png`
   - Field `image`: Emoji (giữ nguyên để fallback)

## 📦 File Download (Cho Sticker Pack)

### Sticker Pack (ZIP):
- **Định dạng:** ZIP
- **Nội dung:**
  - Nhiều sticker PNG (512x512px)
  - File `info.json` (metadata)
  - File `preview.png` (ảnh preview)
- **File size:** < 5MB
- **Cấu trúc:**
```
sticker-pack-name.zip
├── stickers/
│   ├── sticker-1.png
│   ├── sticker-2.png
│   └── ...
├── info.json
└── preview.png
```

### info.json:
```json
{
  "name": "Sticker Pack Name",
  "version": "1.0.0",
  "author": "Your Name",
  "description": "Mô tả sticker pack",
  "stickers": [
    {
      "name": "Sticker 1",
      "file": "stickers/sticker-1.png"
    }
  ]
}
```

## 🎯 Ví Dụ Cụ Thể

### Ví Dụ 1: Tạo ảnh Character "Trạng Tí"
1. **Mở Canva:** Tạo design 512x512px
2. **Vẽ nhân vật:** Trạng Tí với nón lá
3. **Export PNG:** Với nền trong suốt
4. **File name:** `character-trang-ti.png`
5. **Upload:** `public/uploads/album/characters/character-trang-ti.png`
6. **Database:**
   - `image`: "🧒" (emoji fallback)
   - `imageFile`: "/uploads/album/characters/character-trang-ti.png"

### Ví Dụ 2: Tạo ảnh Frame "Làng Quê"
1. **Mở Canva:** Tạo design 1920x1080px
2. **Vẽ khung cảnh:** Làng quê với đồng lúa
3. **Export JPG:** Quality 85%
4. **File name:** `frame-lang-que.jpg`
5. **Upload:** `public/uploads/album/frames/frame-lang-que.jpg`
6. **Database:**
   - `image`: "🏞️" (emoji fallback)
   - `imageFile`: "/uploads/album/frames/frame-lang-que.jpg"

### Ví Dụ 3: Tạo Sticker Pack
1. **Tạo nhiều sticker:** 10-20 sticker PNG (512x512px)
2. **Tạo preview:** 1 ảnh preview tổng hợp
3. **Tạo info.json:** Metadata
4. **Nén ZIP:** Tất cả vào 1 file ZIP
5. **File name:** `sticker-pack-tet.zip`
6. **Upload:** `public/downloads/album/stickers/sticker-pack-tet.zip`
7. **Database:**
   - `image`: "🏮" (emoji preview)
   - `downloadFile`: "/downloads/album/stickers/sticker-pack-tet.zip"
   - `downloadable`: true

## ✅ Checklist Trước Khi Upload

- [ ] File size < giới hạn (Character: 500KB, Frame: 2MB, Sticker: 200KB)
- [ ] Kích thước đúng (512x512px hoặc 1920x1080px)
- [ ] Định dạng đúng (PNG cho Character/Accessory/Sticker, JPG cho Frame)
- [ ] Nền trong suốt (nếu cần)
- [ ] Chất lượng đủ rõ
- [ ] File name đúng format (`{category}-{name}.{ext}`)
- [ ] Upload vào thư mục đúng
- [ ] Cập nhật database với đường dẫn đúng

## 🔗 Tài Nguyên Hữu Ích

### Tools:
- **Canva:** https://www.canva.com (Tạo ảnh dễ dàng)
- **TinyPNG:** https://tinypng.com (Nén ảnh)
- **Remove.bg:** https://www.remove.bg (Xóa nền tự động)
- **Figma:** https://www.figma.com (Design online)

### Emoji Reference:
- **Emojipedia:** https://emojipedia.org (Tìm emoji phù hợp)
- **Unicode Emoji:** https://unicode.org/emoji/charts/ (Danh sách đầy đủ)

### Free Images:
- **Unsplash:** https://unsplash.com (Ảnh miễn phí)
- **Pexels:** https://www.pexels.com (Ảnh miễn phí)
- **Pixabay:** https://pixabay.com (Ảnh miễn phí)

## 💡 Tips

1. **Dùng emoji làm preview:** Nhanh, không cần upload ảnh ngay
2. **Upload ảnh sau:** Có thể tạo vật phẩm với emoji trước, upload ảnh sau
3. **Batch upload:** Tạo nhiều ảnh cùng lúc, upload hàng loạt
4. **Compress trước khi upload:** Giảm file size, tải nhanh hơn
5. **Backup ảnh gốc:** Giữ file gốc để chỉnh sửa sau

## 🚀 Quick Start

**Cách nhanh nhất để tạo ảnh vật phẩm:**

1. **Dùng emoji (nhanh nhất):**
   - Chọn emoji phù hợp
   - Không cần tạo ảnh
   - Có thể thêm ảnh sau

2. **Dùng Canva (dễ nhất):**
   - Tạo design 512x512px
   - Vẽ hoặc upload ảnh
   - Export PNG với nền trong suốt
   - Upload vào `public/uploads/album/{category}/`

3. **Dùng AI (hiện đại nhất):**
   - DALL-E, Midjourney, Stable Diffusion
   - Tạo ảnh tự động
   - Chỉnh sửa nếu cần
   - Export và upload

