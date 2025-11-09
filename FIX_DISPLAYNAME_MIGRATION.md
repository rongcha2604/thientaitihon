# 🔧 FIX LỖI DISPLAY_NAME - Migration Thiếu

## 🚨 VẤN ĐỀ:

**Lỗi:** Database chưa có column `display_name`

**Nguyên nhân:**
- Migration `20251105111609_init` không có `display_name` column
- Schema đã có `displayName` nhưng database chưa có
- Backend code đã dùng `displayName` → Lỗi khi tạo/update user

---

## ✅ GIẢI PHÁP:

### Bước 1: Stop Backend (Tạm thời)

**Trong terminal backend:**
- Nhấn `Ctrl + C` để stop backend
- Hoặc đóng terminal backend

**Hoặc kill process:**
```powershell
Get-Process -Name node | Where-Object {$_.Path -like "*nodejs*"} | Stop-Process -Force
```

---

### Bước 2: Tạo Migration Mới

**Mở PowerShell trong folder backend:**
```powershell
cd d:\HocTapLTHT\ThienTaiDatViet\backend
```

**Tạo migration mới:**
```powershell
npm run prisma:migrate dev --name add_display_name
```

**Khi được hỏi migration name, gõ:**
```
add_display_name
```

**Kết quả mong đợi:**
- Prisma sẽ detect thay đổi trong schema (thêm `displayName`)
- Tạo migration file mới: `prisma/migrations/YYYYMMDDHHMMSS_add_display_name/migration.sql`
- Migration SQL sẽ có: `ALTER TABLE "users" ADD COLUMN "display_name" TEXT;`

---

### Bước 3: Verify Migration

**Check migration file được tạo:**
```powershell
Get-Content "prisma\migrations\*\add_display_name\migration.sql"
```

**Verify migration đã chạy:**
```powershell
npm run prisma:migrate status
```

**Kết quả mong đợi:**
```
Database schema is up to date!
All migrations have been applied.
```

---

### Bước 4: Generate Prisma Client

**Generate Prisma client:**
```powershell
npm run prisma:generate
```

**Kết quả mong đợi:**
```
✔ Generated Prisma Client
```

---

### Bước 5: Start Backend Lại

**Start backend:**
```powershell
npm run dev
```

**Verify backend chạy:**
- Terminal hiển thị: `🚀 Server running on http://localhost:3001`
- Mở browser: `http://localhost:3001/health` → `{"status":"ok"}`

---

### Bước 6: Test displayName

**1. Test Register với displayName:**
- Mở frontend: `http://localhost:5174`
- Hard refresh: `Ctrl + Shift + R`
- Đăng ký với displayName: `Bé A`
- Verify không còn lỗi

**2. Test Update displayName:**
- Login vào hệ thống
- Vào Hồ sơ page
- Click "Tùy chỉnh" → Update displayName: `Bé B`
- Verify không còn lỗi

---

## 🐛 TROUBLESHOOTING

### Lỗi 1: Migration timeout (P1002)

**Triệu chứng:**
```
Error: P1002 - Database timeout when acquire advisory lock
```

**Giải pháp:**
- Backend đang chạy → Stop backend trước
- Hoặc đợi 30 giây rồi thử lại

---

### Lỗi 2: Prisma generate EPERM

**Triệu chứng:**
```
Error: EPERM - File đang được sử dụng
```

**Giải pháp:**
- Backend đang chạy → Stop backend trước
- Hoặc đợi 30 giây rồi thử lại

---

### Lỗi 3: Column already exists

**Triệu chứng:**
```
Error: Column 'display_name' already exists
```

**Giải pháp:**
- Migration đã chạy rồi → Skip migration
- Chỉ cần generate Prisma client: `npm run prisma:generate`
- Start backend lại

---

## 📋 CHECKLIST:

- [ ] Stop backend (Ctrl+C trong terminal backend)
- [ ] Tạo migration: `npm run prisma:migrate dev --name add_display_name`
- [ ] Verify migration file được tạo
- [ ] Verify migration đã chạy: `npm run prisma:migrate status`
- [ ] Generate Prisma client: `npm run prisma:generate`
- [ ] Start backend lại: `npm run dev`
- [ ] Verify backend chạy: `http://localhost:3001/health`
- [ ] Test register với displayName
- [ ] Test update displayName

---

**🎯 Mục tiêu:** Database có column `display_name`, backend có thể tạo/update user với displayName thành công!

