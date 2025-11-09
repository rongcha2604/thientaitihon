# Hướng Dẫn Upload Ảnh Album

## 📋 Checklist Sau Khi Tạo Ảnh

### Bước 1: Kiểm Tra & Xử Lý Ảnh

- [ ] **Kiểm tra kích thước:**
  - Character/Accessory/Sticker: 512x512px
  - Frame: 1920x1080px
  
- [ ] **Kiểm tra định dạng:**
  - Character/Accessory/Sticker: PNG (nền trong suốt)
  - Frame: JPG hoặc PNG
  
- [ ] **Kiểm tra file size:**
  - Character: < 500KB
  - Accessory: < 300KB
  - Frame: < 2MB
  - Sticker: < 200KB
  
- [ ] **Compress ảnh (nếu cần):**
  - Dùng TinyPNG: https://tinypng.com
  - Upload ảnh → Download ảnh đã nén
  - Giữ file gốc để backup

### Bước 2: Đổi Tên File

**Format tên file:** `{category}-{tên-không-dấu}.png`

**Ví dụ:**
- `character-trang-ti.png`
- `accessory-non-la.png`
- `frame-khung-lang-que.png`
- `sticker-den-long.png`

**Lưu ý:**
- Tên file không dấu, viết thường
- Dùng dấu gạch ngang `-` thay vì khoảng trắng
- Đúng extension: `.png` hoặc `.jpg`

### Bước 3: Tạo Cấu Trúc Thư Mục

Tạo các thư mục sau trong `public/`:

```
public/
└── uploads/
    └── album/
        ├── characters/      # Ảnh nhân vật
        ├── accessories/    # Ảnh trang phục
        ├── frames/         # Ảnh khung cảnh
        └── stickers/       # Ảnh sticker
```

**Cách tạo (PowerShell):**
```powershell
# Tạo thư mục
New-Item -ItemType Directory -Path "public\uploads\album\characters" -Force
New-Item -ItemType Directory -Path "public\uploads\album\accessories" -Force
New-Item -ItemType Directory -Path "public\uploads\album\frames" -Force
New-Item -ItemType Directory -Path "public\uploads\album\stickers" -Force
```

### Bước 4: Upload Ảnh

**Copy ảnh vào thư mục đúng:**

- **Characters:** `public/uploads/album/characters/`
- **Accessories:** `public/uploads/album/accessories/`
- **Frames:** `public/uploads/album/frames/`
- **Stickers:** `public/uploads/album/stickers/`

**Ví dụ:**
```
public/uploads/album/characters/character-trang-ti.png
public/uploads/album/accessories/accessory-non-la.png
public/uploads/album/frames/frame-khung-lang-que.png
public/uploads/album/stickers/sticker-den-long.png
```

### Bước 5: Cập Nhật Database

Có 2 cách cập nhật database:

#### Cách 1: Dùng Prisma Studio (Dễ nhất) ⭐

1. **Mở Prisma Studio:**
   ```bash
   cd backend
   npx prisma studio
   ```

2. **Vào bảng `album_items`:**
   - Tìm vật phẩm cần cập nhật
   - Click vào để edit
   - Cập nhật field `imageFile`:
     - Character: `/uploads/album/characters/character-trang-ti.png`
     - Accessory: `/uploads/album/accessories/accessory-non-la.png`
     - Frame: `/uploads/album/frames/frame-khung-lang-que.png`
     - Sticker: `/uploads/album/stickers/sticker-den-long.png`
   - Click "Save"

#### Cách 2: Dùng SQL Script

Tạo file SQL để update hàng loạt:

```sql
-- Update Character images
UPDATE album_items 
SET image_file = '/uploads/album/characters/character-trang-ti.png' 
WHERE name = 'Trạng Tí' AND category = 'character';

UPDATE album_items 
SET image_file = '/uploads/album/characters/character-thang-bom.png' 
WHERE name = 'Thằng Bờm' AND category = 'character';

-- ... (thêm các dòng khác)
```

**Lưu ý:**
- Đường dẫn bắt đầu bằng `/uploads/album/...` (không có `public/`)
- Giữ nguyên field `image` (emoji) để làm fallback
- Chỉ cập nhật field `imageFile`

### Bước 6: Kiểm Tra

- [ ] **Kiểm tra file tồn tại:**
  - Mở browser: `http://localhost:5173/uploads/album/characters/character-trang-ti.png`
  - Nếu thấy ảnh = OK
  
- [ ] **Kiểm tra trong app:**
  - Mở app → Vào Album
  - Xem vật phẩm có hiển thị ảnh không
  - Nếu không thấy → Kiểm tra lại đường dẫn trong database

## 🚀 Script Tự Động (Tùy chọn)

Nếu có nhiều ảnh, có thể tạo script để update database tự động:

```typescript
// scripts/update-album-images.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const imageMappings = [
  { name: 'Trạng Tí', category: 'character', file: 'character-trang-ti.png' },
  { name: 'Thằng Bờm', category: 'character', file: 'character-thang-bom.png' },
  // ... thêm các mapping khác
];

async function updateImages() {
  for (const mapping of imageMappings) {
    await prisma.albumItem.updateMany({
      where: {
        name: mapping.name,
        category: mapping.category,
      },
      data: {
        imageFile: `/uploads/album/${mapping.category}s/${mapping.file}`,
      },
    });
  }
  console.log('✅ Đã cập nhật tất cả ảnh!');
}

updateImages();
```

## 📝 Mapping Tên File

Dựa vào `image_prompts.md`, mapping tên file như sau:

### Characters (20 items):
- Trạng Tí → `character-trang-ti.png`
- Thằng Bờm → `character-thang-bom.png`
- Chị Hằng → `character-chi-hang.png`
- Anh Cuội → `character-anh-cuoi.png`
- ... (xem file `image_prompts.md` để biết đầy đủ)

### Accessories (20 items):
- Nón Lá → `accessory-non-la.png`
- Quạt Mo → `accessory-quat-mo.png`
- ... (xem file `image_prompts.md`)

### Frames (20 items):
- Khung Cửa Sổ → `frame-khung-cua-so.png`
- Khung Làng Quê → `frame-khung-lang-que.png`
- ... (xem file `image_prompts.md`)

### Stickers (20 items):
- Đèn Lồng → `sticker-den-long.png`
- Diều Giấy → `sticker-dieu-giay.png`
- ... (xem file `image_prompts.md`)

## ⚠️ Lưu Ý Quan Trọng

1. **Đường dẫn trong database:**
   - ✅ Đúng: `/uploads/album/characters/character-trang-ti.png`
   - ❌ Sai: `public/uploads/album/characters/character-trang-ti.png`
   - ❌ Sai: `uploads/album/characters/character-trang-ti.png`

2. **Tên thư mục:**
   - ✅ Đúng: `characters`, `accessories`, `frames`, `stickers` (số nhiều)
   - ❌ Sai: `character`, `accessory`, `frame`, `sticker` (số ít)

3. **Giữ emoji:**
   - Field `image` (emoji) giữ nguyên để làm fallback
   - Chỉ cập nhật field `imageFile`

4. **File size:**
   - Nén ảnh trước khi upload (dùng TinyPNG)
   - Đảm bảo file size < giới hạn

## ✅ Checklist Hoàn Thành

- [ ] Đã kiểm tra và xử lý tất cả ảnh
- [ ] Đã đổi tên file đúng format
- [ ] Đã tạo cấu trúc thư mục
- [ ] Đã upload ảnh vào đúng thư mục
- [ ] Đã cập nhật database với `imageFile`
- [ ] Đã kiểm tra hiển thị trong app
- [ ] Tất cả 80 vật phẩm đã có ảnh

## 🎉 Xong!

Sau khi hoàn thành, tất cả 80 vật phẩm sẽ hiển thị ảnh Pixar 3D đẹp mắt trong app!

