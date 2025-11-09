# PWA Icons

Thư mục này chứa các icons cho Progressive Web App (PWA).

## ✅ Icons Đã Có Sẵn

Hiện tại đã có **placeholder icons** (icons tạm thời):
- ✅ `icon-192x192.png` - Icon 192x192 pixels
- ✅ `icon-512x512.png` - Icon 512x512 pixels

**Icons này là placeholder đơn giản** (text "TT" trên nền amber). Bạn có thể:
- ✅ **Dùng ngay** để test PWA
- 🔄 **Thay thế sau** bằng logo/icon đẹp hơn

## 📖 Hướng Dẫn Chi Tiết

Xem file **`README_TAO_ICON.md`** để biết 3 cách tạo icons:
1. ⚡ Online Tool (nhanh nhất - 2 phút)
2. 🎨 Canva (đẹp nhất - 5 phút)
3. 🐍 Python Script (tự động - 1 phút)

## Yêu Cầu

Để PWA hoạt động đúng, bạn cần có 2 icons:

1. **icon-192x192.png** - Icon 192x192 pixels (PNG format)
2. **icon-512x512.png** - Icon 512x512 pixels (PNG format)

## Cách Tạo Icons

### Option 1: Tạo từ Logo/Image hiện có
1. Mở logo/image của bạn trong Photoshop, GIMP, hoặc tool chỉnh ảnh
2. Resize thành 192x192 và 512x512 pixels
3. Export thành PNG format
4. Lưu vào thư mục này với tên:
   - `icon-192x192.png`
   - `icon-512x512.png`

### Option 2: Dùng Online Tool
- https://realfavicongenerator.net/
- https://www.pwabuilder.com/imageGenerator
- Upload logo của bạn → Generate icons → Download và đặt vào thư mục này

### Option 3: Tạo Placeholder (Tạm thời)
Nếu chưa có logo, bạn có thể tạo placeholder đơn giản:
- Màu nền: #F59E0B (amber)
- Text: "TT" (Thiên Tài) hoặc icon emoji 📚
- Kích thước: 192x192 và 512x512

## Lưu Ý

- Icons phải là PNG format
- Kích thước chính xác: 192x192 và 512x512 pixels
- Nên có nền trong suốt hoặc nền màu theme (#F59E0B)
- Icons sẽ hiển thị trên home screen khi user install PWA

## Kiểm Tra

Sau khi thêm icons, kiểm tra:
1. Mở Chrome DevTools → Application → Manifest
2. Verify icons được load đúng
3. Test install PWA trên mobile/desktop

