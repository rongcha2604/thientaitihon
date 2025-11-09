# 🔧 FIX BACKEND CONNECTION - ERR_CONNECTION_REFUSED

**Lỗi:** `ERR_CONNECTION_REFUSED` trên `localhost:3001`
**Nguyên nhân:** Backend chưa chạy hoặc không thể start

---

## 🚨 QUAN TRỌNG: Backend cần chạy để frontend hoạt động

---

## ✅ GIẢI PHÁP: Start Backend thủ công

### Bước 1: Kiểm tra .env file

Backend cần file `.env` trong folder `backend/` với các biến:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
PORT=3001
JWT_SECRET="your-secret-key-here"
JWT_REFRESH_SECRET="your-refresh-secret-key-here"
```

**Nếu chưa có file `.env`:**
1. Tạo file `.env` trong folder `backend/`
2. Copy từ `.env.example` (nếu có) hoặc tạo mới
3. Điền các giá trị cần thiết

---

### Bước 2: Kiểm tra PostgreSQL

Backend cần PostgreSQL đang chạy:

**Windows:**
1. Mở **Services** (Win + R → `services.msc`)
2. Tìm `postgresql-x64-18` (hoặc version bạn đang dùng)
3. Verify status: **Running**
4. Nếu **Stopped** → Click **Start**

**Hoặc kiểm tra bằng command:**
```powershell
Get-Service -Name "*postgresql*"
```

---

### Bước 3: Start Backend

**Cách 1: Dùng PowerShell (Khuyến nghị)**

1. Mở PowerShell trong folder backend:
   ```powershell
   cd d:\HocTapLTHT\ThienTaiDatViet\backend
   ```

2. Start backend:
   ```powershell
   npm run dev
   ```

3. **Verify backend chạy:**
   - Terminal sẽ hiển thị:
     ```
     🚀 Server running on http://localhost:3001
     📊 Environment: development
     ```
   - Hoặc mở browser: `http://localhost:3001/health`
   - Nếu thấy `{"status":"ok"}` → ✅ Backend OK

**Cách 2: Dùng script start-backend.ps1**

1. Mở PowerShell trong folder root:
   ```powershell
   cd d:\HocTapLTHT\ThienTaiDatViet
   ```

2. Chạy script:
   ```powershell
   cd backend
   .\start-backend.ps1
   ```

**Cách 3: Dùng script start-all.ps1 (Start cả Frontend + Backend)**

1. Mở PowerShell trong folder root:
   ```powershell
   cd d:\HocTapLTHT\ThienTaiDatViet
   ```

2. Chạy script:
   ```powershell
   .\start-all.ps1
   ```

---

### Bước 4: Verify Backend chạy

**Mở browser và kiểm tra:**
```
http://localhost:3001/health
```

**Kết quả mong đợi:**
```json
{
  "status": "ok",
  "timestamp": "2025-11-05T..."
}
```

**Nếu thấy lỗi:**
- `ECONNREFUSED` → PostgreSQL chưa chạy
- `Invalid DATABASE_URL` → Check .env file
- `Port 3001 already in use` → Port bị conflict, đổi port hoặc kill process

---

## 🐛 TROUBLESHOOTING

### Lỗi 1: PostgreSQL không chạy

**Triệu chứng:**
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Giải pháp:**
1. Start PostgreSQL service (xem Bước 2)
2. Verify DATABASE_URL trong .env file
3. Test connection:
   ```powershell
   cd backend
   node check-db.js
   ```

---

### Lỗi 2: Thiếu .env file

**Triệu chứng:**
```
Error: DATABASE_URL is not defined
```

**Giải pháp:**
1. Tạo file `.env` trong folder `backend/`
2. Điền các biến cần thiết (DATABASE_URL, PORT, JWT_SECRET, etc.)

---

### Lỗi 3: Port 3001 đã được sử dụng

**Triệu chứng:**
```
Error: listen EADDRINUSE: address already in use :::3001
```

**Giải pháp:**
1. Tìm process đang dùng port 3001:
   ```powershell
   netstat -ano | findstr ":3001"
   ```
2. Kill process:
   ```powershell
   taskkill /PID <PID> /F
   ```
3. Hoặc đổi port trong `.env`:
   ```env
   PORT=3002
   ```
   (Và update frontend `VITE_API_BASE_URL` nếu cần)

---

### Lỗi 4: Database chưa migrate

**Triệu chứng:**
```
Error: Table 'users' doesn't exist
```

**Giải pháp:**
1. Chạy migration:
   ```powershell
   cd backend
   npm run prisma:migrate
   ```
2. Generate Prisma client:
   ```powershell
   npm run prisma:generate
   ```

---

## ✅ SAU KHI BACKEND CHẠY

1. **Refresh frontend** (F5 trong browser)
2. **Thử đăng ký/đăng nhập** lại
3. **Verify không còn lỗi** `ERR_CONNECTION_REFUSED`

---

## 📝 CHECKLIST

- [ ] PostgreSQL đang chạy
- [ ] File `.env` tồn tại trong `backend/`
- [ ] `DATABASE_URL` trong `.env` đúng
- [ ] Backend start thành công (terminal hiển thị "Server running")
- [ ] Health endpoint response: `http://localhost:3001/health` → `{"status":"ok"}`
- [ ] Frontend có thể kết nối backend (không còn `ERR_CONNECTION_REFUSED`)

---

**🎯 Mục tiêu:** Backend chạy thành công, frontend có thể kết nối và test đăng ký/đăng nhập.

