# 🚀 Setup Backend - Hướng Dẫn Chi Tiết

## Bước 1: Tạo file .env

1. Mở folder `backend/`
2. Copy file `.env.example` thành `.env`
3. Mở file `.env` và sửa:

### Sửa DATABASE_URL:
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/luyen_tap_tieu_hoc?schema=public"
```

**Thay `YOUR_PASSWORD`** bằng password của postgres user (bạn đã đặt khi cài PostgreSQL)

**Ví dụ:**
```env
DATABASE_URL="postgresql://postgres:mypassword123@localhost:5432/luyen_tap_tieu_hoc?schema=public"
```

### Generate JWT Secrets:

**Windows PowerShell:**
```powershell
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32)))
```

**Hoặc dùng online tool:**
- https://generate-secret.vercel.app/32

**Hoặc tự tạo (32+ ký tự):**
```env
JWT_SECRET="my-super-secret-jwt-key-12345678901234567890"
JWT_REFRESH_SECRET="my-super-secret-refresh-key-12345678901234567890"
```

## Bước 2: Install Dependencies

Mở Command Prompt hoặc PowerShell trong folder `backend/`:

```bash
cd backend
npm install
```

## Bước 3: Generate Prisma Client

```bash
npm run prisma:generate
```

## Bước 4: Run Migrations (Tạo tables)

```bash
npm run prisma:migrate
```

Khi được hỏi migration name, gõ: `init`

## Bước 5: Seed Database (Tạo admin user)

```bash
npm run prisma:seed
```

Sẽ tạo:
- Admin: `admin@example.com` / `admin123`
- Student: `student@example.com` / `student123`

## Bước 6: Start Backend

```bash
npm run dev
```

Backend sẽ chạy tại: `http://localhost:3001`

## ✅ Test Backend

Mở browser hoặc dùng curl:
```
http://localhost:3001/health
```

Nếu thấy: `{"status":"ok","timestamp":"..."}` → Backend đã chạy thành công!

---

## 🐛 Troubleshooting

### Database connection error:
- Kiểm tra PostgreSQL đang chạy
- Kiểm tra password trong DATABASE_URL đúng chưa
- Test connection: `psql -U postgres -d luyen_tap_tieu_hoc`

### Prisma errors:
```bash
# Reset và migrate lại
npm run prisma:migrate reset

# Hoặc tạo migration mới
npm run prisma:migrate dev --name init
```

