# 🧪 Hướng Dẫn Test Album Items trong Frontend

## ⚠️ QUAN TRỌNG: Frontend cần Backend chạy!

Frontend gọi API `/album/items` từ backend để lấy dữ liệu. Nếu backend không chạy, frontend sẽ không hiển thị được items.

---

## 🚀 Cách 1: Chạy Backend + Frontend (RECOMMENDED)

### Bước 1: Start Backend

**Option A: Dùng PowerShell Script (Nhanh nhất)**
```powershell
cd backend
.\start-backend.ps1
```

**Option B: Manual**
```powershell
cd backend
npm run dev
```

**Kết quả mong đợi:**
```
🚀 Server running on http://localhost:3001
📊 Environment: development
```

### Bước 2: Start Frontend

**Mở terminal mới:**
```powershell
# Ở root folder
npm run dev
```

**Kết quả mong đợi:**
```
VITE ready in XXX ms
➜  Local:   http://localhost:5173/
```

### Bước 3: Test trong Browser

1. **Mở browser:** `http://localhost:5173`
2. **Đăng nhập** (nếu cần):
   - Email: `student@example.com`
   - Password: `student123`
3. **Vào trang Album:**
   - Click vào icon Album/Collection trong bottom nav
   - Hoặc vào URL: `http://localhost:5173/album`

### Bước 4: Kiểm tra Items hiển thị

**Kỳ vọng:**
- ✅ Thấy 4 tabs: Nhân vật, Trang phục, Khung cảnh, Đồ chơi
- ✅ Mỗi tab hiển thị items tương ứng:
  - **Nhân vật:** 30 items (Trạng Tí, Thằng Bờm, Chị Hằng, ...)
  - **Trang phục:** 20 items (Nón Lá, Quạt Mo, Khăn Rằn, ...)
  - **Khung cảnh:** 20 items (Khung Cửa Sổ, Khung Làng Quê, ...)
  - **Đồ chơi:** 21 items (Đèn Lồng, Diều Giấy, Mặt Nạ, ...)
- ✅ Items hiển thị với emoji (hoặc ảnh nếu đã có `image_file`)
- ✅ Items chưa mua sẽ có icon 🔒 (locked)
- ✅ Items đã mua sẽ hiển thị tên và có thể click

---

## 🔍 Cách 2: Test Backend API trực tiếp (Không cần Frontend)

### Test API endpoint:

**1. Health Check:**
```bash
curl http://localhost:3001/health
```
→ Kết quả: `{"status":"ok","timestamp":"..."}`

**2. Get Album Items (cần đăng nhập):**
```bash
# Lấy token trước (login)
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@example.com","password":"student123"}'

# Copy accessToken từ response, sau đó:
curl http://localhost:3001/api/album/items?category=character \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**3. Hoặc dùng Postman/Browser:**
- Mở: `http://localhost:3001/api/album/items?category=character`
- Headers: `Authorization: Bearer YOUR_TOKEN`

---

## 🐛 Troubleshooting

### Lỗi 1: "Không thể tải dữ liệu album"
**Nguyên nhân:** Backend không chạy hoặc không kết nối được

**Giải pháp:**
1. Kiểm tra backend đang chạy:
   ```bash
   curl http://localhost:3001/health
   ```
2. Kiểm tra console browser (F12) → Xem lỗi network
3. Kiểm tra `API_BASE_URL` trong frontend:
   - Mở DevTools (F12) → Console
   - Xem log: `🔍 API_BASE_URL: http://localhost:3001`

### Lỗi 2: "401 Unauthorized"
**Nguyên nhân:** Chưa đăng nhập hoặc token hết hạn

**Giải pháp:**
1. Đăng nhập lại trong frontend
2. Kiểm tra localStorage có token không:
   ```javascript
   // Trong browser console
   localStorage.getItem('access_token')
   ```

### Lỗi 3: Items hiển thị nhưng không có ảnh
**Nguyên nhân:** `image_file` trong database là `NULL` hoặc ảnh chưa được upload

**Giải pháp:**
1. Kiểm tra database:
   ```sql
   SELECT name, category, image_file 
   FROM album_items 
   WHERE image_file IS NULL;
   ```
2. Nếu có items thiếu `image_file`:
   - Chạy script `update-album-images.sql` trong pgAdmin
   - Hoặc upload ảnh vào `public/uploads/album/`

### Lỗi 4: Items hiển thị nhưng chỉ có emoji, không có ảnh
**Nguyên nhân:** Frontend đang dùng `item.image` (emoji) thay vì `item.imageFile`

**Giải pháp:**
- Kiểm tra code `AlbumPage.tsx` → Xem có dùng `imageFile` không
- Nếu chưa, cần update code để hiển thị ảnh từ `imageFile`

---

## 📊 Checklist Test

- [ ] Backend đang chạy (`http://localhost:3001/health` → OK)
- [ ] Frontend đang chạy (`http://localhost:5173` → OK)
- [ ] Đã đăng nhập trong frontend
- [ ] Vào trang Album thành công
- [ ] Thấy 4 tabs: Nhân vật, Trang phục, Khung cảnh, Đồ chơi
- [ ] Tab "Nhân vật" hiển thị 30 items
- [ ] Tab "Trang phục" hiển thị 20 items
- [ ] Tab "Khung cảnh" hiển thị 20 items
- [ ] Tab "Đồ chơi" hiển thị 21 items
- [ ] Items chưa mua có icon 🔒
- [ ] Items đã mua hiển thị tên và có thể click
- [ ] Console không có lỗi (F12 → Console)

---

## 🎯 Kết quả mong đợi

**Nếu tất cả OK:**
- ✅ Frontend hiển thị đầy đủ 91 album items
- ✅ Items được phân loại đúng theo category
- ✅ UI/UX hoạt động mượt mà
- ✅ Có thể mua items bằng coins (nếu đã implement)

**Nếu có vấn đề:**
- ❌ Kiểm tra backend logs
- ❌ Kiểm tra browser console (F12)
- ❌ Kiểm tra network tab (F12 → Network)
- ❌ Kiểm tra database có data không

---

## 💡 Tips

1. **Mở DevTools (F12)** để xem:
   - Console: Lỗi JavaScript
   - Network: API calls và responses
   - Application: LocalStorage, tokens

2. **Test từng tab một:**
   - Test tab "Nhân vật" trước
   - Sau đó test các tab khác

3. **Kiểm tra API response:**
   - Mở Network tab → Tìm request `/api/album/items`
   - Xem response data có đúng không

