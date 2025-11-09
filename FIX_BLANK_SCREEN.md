# 🔧 Hướng Dẫn Sửa Màn Hình Trắng (Blank Screen)

## 🚨 Nguyên Nhân Có Thể

Màn hình trắng thường do:
1. **Service Worker cache cũ** - Cache cũ gây conflict
2. **Lỗi JavaScript** - Component không render được
3. **CSS không load** - Tailwind CSS chưa compile
4. **Lỗi import** - Component import sai

## ✅ Cách Sửa (Thử Từng Bước)

### Bước 1: Clear Cache & Service Worker (QUAN TRỌNG NHẤT)

**Chrome DevTools:**
1. Mở Chrome → F12 (DevTools)
2. **Application tab** → **Storage** → Click **"Clear site data"**
3. **Application tab** → **Service Workers** → Click **"Unregister"** (nếu có)
4. **Application tab** → **Cache Storage** → Click **"Delete"** (xóa tất cả caches)
5. **Refresh trang** (Ctrl + F5 hoặc Ctrl + Shift + R)

**Hoặc:**
- Hard refresh: **Ctrl + Shift + R** (Windows) hoặc **Cmd + Shift + R** (Mac)
- Clear cache: **Ctrl + Shift + Delete** → Chọn "Cached images and files"

### Bước 2: Kiểm Tra Console Errors

1. Mở Chrome DevTools (F12)
2. **Console tab** → Xem có lỗi màu đỏ không
3. Copy lỗi và gửi cho tôi

**Lỗi thường gặp:**
- `Failed to load module` → Import sai
- `Cannot read property` → Component undefined
- `SyntaxError` → Lỗi cú pháp

### Bước 3: Kiểm Tra Network Tab

1. DevTools → **Network tab**
2. Refresh trang (F5)
3. Kiểm tra:
   - `main.tsx` có load được không? (Status 200)
   - `index.css` có load được không?
   - Có file nào bị 404 không?

### Bước 4: Restart Dev Server

**Dừng server hiện tại:**
- Trong terminal: **Ctrl + C**

**Chạy lại:**
```bash
npm run dev
```

### Bước 5: Kiểm Tra Service Worker

1. DevTools → **Application** → **Service Workers**
2. Nếu có service worker đang chạy:
   - Click **"Unregister"**
   - Refresh trang
   - Service worker sẽ tự động register lại

### Bước 6: Disable Service Worker Tạm Thời (Nếu Cần)

Nếu vẫn không được, tạm thời disable service worker:

**File: `src/main.tsx`**
```typescript
// Tạm thời comment service worker registration
// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker
//       .register('/service-worker.js')
//       .then((registration) => {
//         console.log('[Service Worker] Registered:', registration);
//       })
//       .catch((error) => {
//         console.log('[Service Worker] Registration failed:', error);
//       });
//   });
// }
```

Sau đó refresh trang và test lại.

---

## 🔍 Debug Checklist

- [ ] Đã clear cache và service worker?
- [ ] Console có lỗi gì không?
- [ ] Network tab có file nào 404 không?
- [ ] Dev server đang chạy không?
- [ ] Đã thử hard refresh (Ctrl + Shift + R)?

---

## 💡 Quick Fix

**Nhanh nhất:**
1. **Ctrl + Shift + Delete** → Clear cache
2. **Ctrl + Shift + R** → Hard refresh
3. Nếu vẫn không được → Restart dev server

---

## 📝 Gửi Thông Tin Cho Tôi

Nếu vẫn không được, gửi cho tôi:
1. **Console errors** (screenshot hoặc copy text)
2. **Network tab** - File nào bị 404?
3. **Service Worker status** (Application → Service Workers)

