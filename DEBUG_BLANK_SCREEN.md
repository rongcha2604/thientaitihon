# 🔍 Debug Màn Hình Trắng - Checklist

## ✅ Đã Thực Hiện

1. ✅ **Tạm thời disable Service Worker** - Đã comment trong `src/main.tsx`
2. ✅ **Tạm thời disable InstallPrompt** - Đã comment trong `App.tsx`

## 🔍 Bước Tiếp Theo - Kiểm Tra Console

**QUAN TRỌNG:** Mở Chrome DevTools (F12) và kiểm tra:

### 1. Console Tab
- Có lỗi màu đỏ không?
- Copy toàn bộ lỗi và gửi cho tôi

### 2. Network Tab
- Refresh trang (F5)
- Kiểm tra:
  - `main.tsx` → Status phải là 200
  - `index.css` → Status phải là 200
  - Có file nào bị 404 không?

### 3. Application Tab
- **Service Workers** → Unregister tất cả
- **Cache Storage** → Xóa tất cả
- **Local Storage** → Clear all (nếu cần)

## 🚀 Thử Ngay

1. **Hard Refresh:** Ctrl + Shift + R
2. **Clear Cache:** Ctrl + Shift + Delete → Clear "Cached images and files"
3. **Restart Dev Server:**
   ```bash
   # Dừng server (Ctrl + C trong terminal)
   npm run dev
   ```

## 📝 Gửi Thông Tin

Nếu vẫn trắng, gửi cho tôi:
1. **Console errors** (screenshot hoặc copy text)
2. **Network tab** - File nào bị 404?
3. **Elements tab** - Có `<div id="root">` không? Có content bên trong không?

