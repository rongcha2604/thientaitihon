# ✅ Checklist: Album Hoạt Động Trong APK

## 📋 Kiểm Tra Trước Khi Build APK

### 1. Album Data Files
- [x] ✅ `public/data/album-items.json` tồn tại
- [x] ✅ `public/uploads/album/characters/` có ảnh
- [x] ✅ `public/uploads/album/accessories/` có ảnh
- [x] ✅ `public/uploads/album/frames/` có ảnh
- [x] ✅ `public/uploads/album/stickers/` có ảnh

### 2. Code Implementation
- [x] ✅ `AlbumPage.tsx` load từ `/data/album-items.json` (local file)
- [x] ✅ `AlbumPage.tsx` hiển thị ảnh từ `imageFile` path
- [x] ✅ Coins system dùng `localStorage` (hoạt động offline)
- [x] ✅ Purchase system có fallback demo mode (không cần backend)

### 3. Build Process
- [x] ✅ Vite tự động copy `public/` → `dist/` khi build
- [x] ✅ Capacitor copy `dist/` → APK assets
- [x] ✅ Build script verify album files

## 🎯 Kết Quả

**Album SẼ HOẠT ĐỘNG trong APK vì:**

1. ✅ **Data Files:** 
   - `public/data/album-items.json` → Vite copy vào `dist/` → Capacitor copy vào APK
   - `public/uploads/album/...` → Vite copy vào `dist/` → Capacitor copy vào APK

2. ✅ **Code Logic:**
   - Load từ `/data/album-items.json` (local file trong APK)
   - Hiển thị ảnh từ `/uploads/album/...` (local files trong APK)
   - Coins dùng `localStorage` (hoạt động offline)
   - Purchase có demo mode (không cần backend)

3. ✅ **Path Resolution:**
   - Trong APK: `/data/album-items.json` → `android/app/src/main/assets/public/data/album-items.json`
   - Trong APK: `/uploads/album/...` → `android/app/src/main/assets/public/uploads/album/...`
   - Capacitor tự động serve files từ `assets/public/`

## 🧪 Test Sau Khi Build APK

1. ✅ Mở app → Vào **Album**
2. ✅ Kiểm tra danh sách items hiển thị
3. ✅ Kiểm tra ảnh items hiển thị (không phải emoji)
4. ✅ Kiểm tra coins hiển thị (mặc định 100)
5. ✅ Test mua item (đổi coins)
6. ✅ Kiểm tra coins giảm sau khi mua
7. ✅ Kiểm tra item đã mua hiển thị "Đã sở hữu"

## ⚠️ Lưu Ý

- **Offline Mode:** Album hoạt động 100% offline (không cần internet)
- **Demo Mode:** Coins và purchase hoạt động với localStorage (không cần backend)
- **Images:** Tất cả ảnh được embed trong APK (không cần download)

## 🚀 Build APK

Chạy script build:
```powershell
.\build-apk.ps1
```

Script sẽ tự động:
1. ✅ Copy data files
2. ✅ Verify album files
3. ✅ Build production
4. ✅ Sync với Capacitor
5. ✅ Build APK

APK Location:
```
android/app/build/outputs/apk/debug/app-debug.apk
```



