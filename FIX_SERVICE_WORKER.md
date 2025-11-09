# 🔧 Sửa Service Worker Redundant

## 🚨 Vấn Đề

Service Worker #33 đang ở trạng thái "redundant" - đây có thể là nguyên nhân màn hình trắng!

## ✅ Cách Sửa

### Bước 1: Unregister Service Worker

1. **Trong Chrome DevTools (Application tab):**
   - Tìm service worker #33
   - Click nút **"Unregister"** (hoặc **"Unregister"** button)
   - Xác nhận unregister

### Bước 2: Xóa Cache Storage

1. **Application tab** → **Cache Storage**
2. Xóa tất cả caches (click vào từng cache → Delete)

### Bước 3: Clear Site Data

1. **Application tab** → **Storage**
2. Click **"Clear site data"** (button ở trên cùng)
3. Xác nhận clear

### Bước 4: Hard Refresh

1. **Ctrl + Shift + R** (hard refresh)
2. Hoặc **Ctrl + F5**

### Bước 5: Kiểm Tra Console

1. **Console tab** trong DevTools
2. Xem có lỗi màu đỏ không
3. Copy lỗi và gửi cho tôi

---

## 🔄 Nếu Vẫn Không Được

Service Worker đã được disable trong code (`src/main.tsx`), nhưng service worker cũ vẫn đang chạy từ cache.

**Giải pháp:**
1. Unregister service worker #33
2. Clear cache
3. Hard refresh
4. Service worker sẽ không tự động register lại (vì đã disable trong code)

---

## 📝 Lưu Ý

- Service Worker đã được tạm thời disable trong `src/main.tsx`
- Sau khi unregister, service worker sẽ không tự động register lại
- PWA vẫn hoạt động bình thường (chỉ không có offline support tạm thời)

