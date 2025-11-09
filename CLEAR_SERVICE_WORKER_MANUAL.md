# 🔧 Xóa Service Worker Thủ Công (Khi Không Click Được Unregister)

## 🚨 Vấn Đề

Service worker đã bị deleted nhưng vẫn còn trong cache, khiến nút "Unregister" không click được.

## ✅ Cách Sửa (Thủ Công)

### Bước 1: Xóa Cache Storage

1. **Chrome DevTools** → **Application tab**
2. **Cache Storage** (sidebar bên trái)
3. Click vào từng cache (ví dụ: `static-v1`, `dynamic-v1`, `thien-tai-dat-viet-v1`)
4. Click nút **"Delete"** (hoặc right-click → Delete)
5. Xóa tất cả caches

### Bước 2: Clear Site Data

1. **Application tab** → **Storage** (sidebar bên trái)
2. Scroll xuống dưới cùng
3. Click nút **"Clear site data"** (màu đỏ, ở trên cùng)
4. Xác nhận clear

### Bước 3: Xóa Local Storage (Nếu Cần)

1. **Application tab** → **Local Storage** → `http://localhost:5173`
2. Right-click → **Clear**
3. Hoặc xóa từng key một

### Bước 4: Hard Refresh

1. **Ctrl + Shift + R** (hard refresh)
2. Hoặc **Ctrl + F5**

### Bước 5: Kiểm Tra Lại

1. **Application tab** → **Service Workers**
2. Service worker #813 sẽ biến mất
3. Refresh trang → App sẽ chạy bình thường

---

## 🎯 Quick Fix (Nhanh Nhất)

**Option 1: Clear All Site Data**
1. DevTools → **Application** → **Storage**
2. Click **"Clear site data"** (button đỏ ở trên cùng)
3. Hard refresh: **Ctrl + Shift + R**

**Option 2: Incognito Mode**
1. Mở Chrome Incognito (Ctrl + Shift + N)
2. Vào `http://localhost:5173`
3. App sẽ chạy không có service worker cũ

---

## 📝 Lưu Ý

- Service worker đã được disable trong code (`src/main.tsx`)
- Sau khi clear, service worker sẽ không tự động register lại
- App sẽ chạy bình thường (chỉ không có offline support tạm thời)

