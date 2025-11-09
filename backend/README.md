# Backend API - Web App Luyện Tập Tiểu Học

Backend API cho ứng dụng luyện tập tiểu học với Node.js + Express + TypeScript + Prisma + PostgreSQL.

## 🚀 Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Setup Database

Tạo PostgreSQL database:

```bash
# Tạo database
createdb luyen_tap_tieu_hoc

# Hoặc dùng psql
psql -U postgres
CREATE DATABASE luyen_tap_tieu_hoc;
```

### 3. Configure Environment

Copy `.env.example` thành `.env` và điền thông tin:

```bash
cp .env.example .env
```

Cập nhật `DATABASE_URL` trong `.env`:
```
DATABASE_URL="postgresql://user:password@localhost:5432/luyen_tap_tieu_hoc?schema=public"
```

### 4. Run Migrations

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed database (optional)
npm run prisma:seed
```

### 5. Start Server

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

Server sẽ chạy tại `http://localhost:3001`

## 📚 API Endpoints

### Authentication

- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - Đăng xuất
- `GET /api/auth/me` - Lấy thông tin user hiện tại

### Progress

- `GET /api/progress` - Lấy tiến độ học tập
- `POST /api/progress` - Lưu tiến độ
- `GET /api/progress/week/:week` - Tiến độ theo tuần

### Analytics

- `POST /api/analytics/track` - Track hành vi người dùng

### Admin

- `POST /api/admin/login` - Admin login
- `GET /api/admin/users` - Danh sách users
- `GET /api/admin/users/:id` - Chi tiết user
- `GET /api/admin/analytics` - Analytics dashboard
- `GET /api/admin/progress` - Tổng hợp tiến độ
- `GET /api/admin/audit-logs` - Audit logs

## 🔐 Default Credentials (Development)

**Admin:**
- Email: `admin@example.com`
- Password: `admin123`

**Test Student:**
- Email: `student@example.com`
- Password: `student123`
- Parent PIN: `1234`

⚠️ **Lưu ý:** Đổi password ngay trong production!

## 🗄️ Database Schema

Xem `prisma/schema.prisma` để biết chi tiết schema.

## 📝 Development

```bash
# Watch mode
npm run dev

# Prisma Studio (Database GUI)
npm run prisma:studio

# Generate Prisma Client
npm run prisma:generate

# Create migration
npm run prisma:migrate

# Reset database (⚠️ Deletes all data)
npx prisma migrate reset
```

## 🚀 Production Deployment

1. Set `NODE_ENV=production`
2. Update `DATABASE_URL` với production database
3. Generate strong `JWT_SECRET` và `JWT_REFRESH_SECRET`
4. Build: `npm run build`
5. Start: `npm start`

## 📦 Tech Stack

- Node.js + Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- bcrypt (Password hashing)
- Zod (Validation)

