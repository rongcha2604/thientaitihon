# 🔍 DEBUG - Frontend Không Đăng Nhập Được Từ Mobile

## ✅ ĐÃ XÁC NHẬN:
- Backend đang chạy tốt trên `192.168.1.38:3001`
- Backend accessible từ mobile (đã test thành công)
- File `.env` đã có: `VITE_API_BASE_URL=http://192.168.1.38:3001`

## ❌ VẤN ĐỀ:
Frontend vẫn không đăng nhập được từ mobile.

---

## 🔧 CÁC BƯỚC DEBUG:

### Bước 1: Restart Frontend với Clear Cache

**Cách 1: Dùng script (Windows PowerShell):**
```powershell
.\restart-frontend.ps1
```

**Cách 2: Manual:**
```bash
# Dừng frontend (Ctrl+C)
# Xóa cache
Remove-Item -Recurse -Force node_modules\.vite -ErrorAction SilentlyContinue

# Chạy lại
npm run dev
```

---

### Bước 2: Kiểm Tra Console Log Trên Mobile

Sau khi restart frontend, mở trình duyệt trên mobile và kiểm tra Console:

1. **Truy cập:** `http://192.168.1.38:5173`
2. **Mở Developer Tools:**
   - **Chrome Android:** `chrome://inspect` (trên máy tính) → Remote debugging
   - **Safari iOS:** Settings → Safari → Advanced → Web Inspector
3. **Kiểm tra Console log:**
   - Phải thấy: `🔍 API_BASE_URL: http://192.168.1.38:3001`
   - Phải thấy: `🔍 import.meta.env.VITE_API_BASE_URL: http://192.168.1.38:3001`

**❌ Nếu thấy:**
- `🔍 API_BASE_URL: http://localhost:3001` → File .env chưa được load!

**✅ Nếu thấy:**
- `🔍 API_BASE_URL: http://192.168.1.38:3001` → File .env đã được load đúng!

---

### Bước 3: Kiểm Tra Network Tab Trên Mobile

Trong Developer Tools trên mobile, mở **Network tab**:

1. **Thử đăng nhập** với credentials:
   - Email: `admin@example.com`
   - Password: `admin123`

2. **Kiểm tra request login:**
   - **Request URL phải là:** `http://192.168.1.38:3001/api/auth/login`
   - **❌ Nếu là:** `http://localhost:3001/api/auth/login` → File .env chưa được load!

3. **Kiểm tra response:**
   - **Status code:** 200 (OK) → Login thành công
   - **Status code:** 401 (Unauthorized) → Sai email/password
   - **Status code:** 500 (Server Error) → Backend lỗi
   - **CORS error** → CORS config sai

---

### Bước 4: Hard Refresh Browser Trên Mobile

**Chrome/Android:**
- Settings → Privacy → Clear browsing data → Clear cache
- Hoặc dùng Incognito mode

**Safari/iOS:**
- Settings → Safari → Clear History and Website Data
- Hoặc dùng Private mode

---

## 🐛 CÁC LỖI THƯỜNG GẶP:

### Lỗi 1: "API_BASE_URL vẫn là localhost"

**Nguyên nhân:**
- File .env chưa được load
- Vite cache chưa clear
- Frontend chưa restart

**Giải pháp:**
```bash
# Clear cache và restart
Remove-Item -Recurse -Force node_modules\.vite
npm run dev
```

---

### Lỗi 2: "CORS error" trong Network tab

**Nguyên nhân:**
- Backend CORS config chưa cho phép mobile origin
- Backend chưa restart sau khi config CORS

**Giải pháp:**
1. Kiểm tra `backend/src/server.ts`:
   ```typescript
   if (env.NODE_ENV === 'development') {
     callback(null, true); // Allow all origins
     return;
   }
   ```
2. Restart backend:
   ```bash
   cd backend
   npm run dev
   ```

---

### Lỗi 3: "Network Error" hoặc "ERR_NETWORK"

**Nguyên nhân:**
- Điện thoại và máy tính không cùng mạng Wi-Fi
- Firewall block ports
- IP không đúng

**Giải pháp:**
1. Đảm bảo cả 2 cùng mạng Wi-Fi
2. Kiểm tra firewall:
   - Windows: Settings → Firewall → Allow Node.js
3. Kiểm tra IP:
   ```bash
   ipconfig | findstr /i "IPv4"
   ```

---

### Lỗi 4: "401 Unauthorized"

**Nguyên nhân:**
- Sai email/password
- Backend chưa seed data

**Giải pháp:**
1. Kiểm tra credentials:
   - Admin: `admin@example.com` / `admin123`
   - Student: `student@example.com` / `student123`
2. Seed lại database:
   ```bash
   cd backend
   npx prisma db seed
   ```

---

## 📋 CHECKLIST DEBUG:

- [ ] File `.env` tồn tại và đúng: `VITE_API_BASE_URL=http://192.168.1.38:3001`
- [ ] Frontend đã restart (sau khi tạo .env)
- [ ] Vite cache đã clear (`rm -rf node_modules/.vite`)
- [ ] Console log trên mobile hiển thị: `🔍 API_BASE_URL: http://192.168.1.38:3001`
- [ ] Network tab trên mobile hiển thị request đến `http://192.168.1.38:3001`
- [ ] Hard refresh browser trên mobile
- [ ] Backend đã restart sau khi config CORS
- [ ] Cả 2 cùng mạng Wi-Fi
- [ ] Firewall đã cho phép Node.js

---

## 🎯 QUICK FIX:

Nếu vẫn không được, thử **hardcode tạm thời** để test:

**Sửa file `src/lib/api/config.ts`:**
```typescript
export const API_BASE_URL = 'http://192.168.1.38:3001'; // Hardcode tạm thời để test
```

**Restart frontend và test lại:**
- ✅ Nếu được → File .env chưa được load (cần fix Vite config)
- ❌ Nếu không → Vấn đề khác (network, CORS, etc.)

---

## 📞 THÔNG TIN CẦN CUNG CẤP:

Nếu vẫn không được, vui lòng cho tôi biết:

1. **Console log trên mobile:**
   - `🔍 API_BASE_URL: ...` → Giá trị là gì?
   - Có lỗi gì khác không?

2. **Network tab trên mobile:**
   - Request login gọi đến URL nào?
   - Response status code là gì?
   - Response body là gì?

3. **Error message:**
   - Có lỗi gì trong Console?
   - Có lỗi gì trong Network tab?

---

✅ **Hãy thử các bước trên và cho tôi biết kết quả!**

