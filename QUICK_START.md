# 🚀 Quick Start - Bắt Đầu Ngay!

## ⚡ Bước 1: Setup Database (PostgreSQL)

### Windows:
1. Download PostgreSQL: https://www.postgresql.org/download/windows/
2. Install PostgreSQL (nhớ password postgres user!)
3. Mở pgAdmin hoặc Command Prompt

### macOS:
```bash
brew install postgresql
brew services start postgresql
```

### Linux:
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### Tạo Database:
```bash
# Kết nối PostgreSQL
psql -U postgres

# Tạo database
CREATE DATABASE luyen_tap_tieu_hoc;

# Exit
\q
```

## ⚡ Bước 2: Setup Backend

```bash
# 1. Vào folder backend
cd backend

# 2. Install dependencies
npm install

# 3. Tạo file .env
cp .env.example .env

# 4. Sửa .env - Update DATABASE_URL:
# DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/luyen_tap_tieu_hoc?schema=public"
# 
# Generate JWT secrets (copy 2 dòng này):
# JWT_SECRET="your-super-secret-jwt-key-change-this-in-production-min-32-chars"
# JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-this-in-production-min-32-chars"

# 5. Generate Prisma Client
npm run prisma:generate

# 6. Run migrations (tạo tables)
npm run prisma:migrate

# 7. Seed database (tạo admin user)
npm run prisma:seed

# 8. Start backend
npm run dev
```

✅ Backend sẽ chạy tại: `http://localhost:3001`

## ⚡ Bước 3: Setup Frontend

```bash
# 1. Về root folder
cd ..

# 2. Install dependencies (để cài axios)
npm install

# 3. (Optional) Tạo file .env.local nếu muốn custom API URL
# echo "VITE_API_BASE_URL=http://localhost:3001" > .env.local

# 4. Start frontend
npm run dev
```

✅ Frontend sẽ chạy tại: `http://localhost:5173`

## 🧪 Bước 4: Test

### Test Backend:
```bash
# Health check
curl http://localhost:3001/health

# Should return: {"status":"ok","timestamp":"..."}
```

### Test Login:
1. Mở browser: `http://localhost:5173`
2. Bạn sẽ thấy Login Page
3. Login với:
   - **Admin**: `admin@example.com` / `admin123`
   - **Student**: `student@example.com` / `student123`

### Test Admin Dashboard:
1. Login với admin account
2. Click nút **🔧 Admin** ở góc trên bên phải
3. Login admin: `admin@example.com` / `admin123`
4. Xem dashboard với analytics và users list

## ✅ Checklist

- [ ] PostgreSQL installed
- [ ] Database `luyen_tap_tieu_hoc` created
- [ ] Backend `.env` configured
- [ ] Backend dependencies installed (`npm install`)
- [ ] Prisma Client generated (`npm run prisma:generate`)
- [ ] Database migrated (`npm run prisma:migrate`)
- [ ] Database seeded (`npm run prisma:seed`)
- [ ] Backend running (`npm run dev` → port 3001)
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Frontend running (`npm run dev` → port 5173)
- [ ] Test login thành công
- [ ] Test admin dashboard thành công

## 🐛 Troubleshooting

### Backend không kết nối database:
```bash
# Test connection
psql -U postgres -d luyen_tap_tieu_hoc

# Nếu OK → Kiểm tra DATABASE_URL trong .env
# Nếu ERROR → Tạo database:
# CREATE DATABASE luyen_tap_tieu_hoc;
```

### Frontend không gọi được API:
1. Kiểm tra backend đang chạy: `http://localhost:3001/health`
2. Kiểm tra CORS: `FRONTEND_URL` trong backend `.env`
3. Kiểm tra browser console (F12) → Network tab

### Prisma errors:
```bash
# Reset và migrate lại
npm run prisma:migrate reset

# Hoặc tạo migration mới
npm run prisma:migrate dev --name init
```

## 🎯 Sau Khi Setup Xong

1. ✅ Test login/register
2. ✅ Test admin dashboard
3. ✅ Thêm questions data vào `src/data/questions/`
4. ✅ Tích hợp progress tracking vào HocPage
5. ✅ Tích hợp analytics tracking

---

**🎉 Chúc bạn setup thành công!**

