# 🔧 CHẠY MIGRATION CHO DISPLAY_NAME

## 🚨 VẤN ĐỀ:

**Database chưa có column `display_name`** → Backend lỗi khi tạo/update user với displayName.

---

## ✅ GIẢI PHÁP NHANH (2 CÁCH):

### CÁCH 1: Dùng SQL trực tiếp (NHANH NHẤT - 30 giây)

**Bước 1: Stop Backend**
- Trong terminal backend, nhấn `Ctrl + C`

**Bước 2: Chạy SQL trực tiếp**
```powershell
cd backend
psql -U postgres -d luyen_tap_tieu_hoc -c "ALTER TABLE users ADD COLUMN IF NOT EXISTS display_name TEXT;"
```

**Bước 3: Start Backend lại**
```powershell
npm run dev
```

**Xong!** ✅

---

### CÁCH 2: Dùng Prisma Migration (CHUẨN - 2 phút)

**Bước 1: Stop Backend**
- Trong terminal backend, nhấn `Ctrl + C`
- Hoặc đóng terminal backend

**Bước 2: Tạo và chạy migration**
```powershell
cd backend
npm run prisma:migrate dev --name add_display_name
```

**Khi được hỏi migration name, gõ:**
```
add_display_name
```

**Bước 3: Generate Prisma Client**
```powershell
npm run prisma:generate
```

**Bước 4: Start Backend lại**
```powershell
npm run dev
```

**Xong!** ✅

---

## 📋 VERIFY:

**1. Check column tồn tại:**
```sql
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'users' AND column_name = 'display_name';
```

**2. Test Backend:**
- Mở: `http://localhost:3001/health` → `{"status":"ok"}`

**3. Test Frontend:**
- Hard refresh: `Ctrl + Shift + R`
- Đăng ký với displayName: `Bé A`
- Verify không còn lỗi

---

## 🐛 NẾU VẪN LỖI:

**1. Backend chưa stop:**
- Check terminal backend → Nhấn `Ctrl + C`
- Hoặc kill process:
  ```powershell
  Get-Process -Name node | Where-Object {$_.Path -like "*nodejs*"} | Stop-Process -Force
  ```

**2. Migration timeout:**
- Đợi 30 giây rồi thử lại
- Hoặc dùng CÁCH 1 (SQL trực tiếp)

**3. Column đã tồn tại:**
- Skip migration
- Chỉ cần: `npm run prisma:generate`
- Start backend lại

---

**🎯 Mục tiêu:** Database có column `display_name`, backend có thể tạo/update user với displayName thành công!

