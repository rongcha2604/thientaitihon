# 🚀 Hướng Dẫn Setup - Web App Luyện Tập Tiểu Học

## 📋 Tổng Quan

Hệ thống bao gồm:
- **Frontend**: React + Vite + TypeScript (Port 5173)
- **Backend**: Node.js + Express + TypeScript (Port 3001)
- **Database**: PostgreSQL

## 🗄️ Database Setup

### 1. Cài PostgreSQL

**Windows:**
- Download: https://www.postgresql.org/download/windows/
- Hoặc dùng Chocolatey: `choco install postgresql`

**macOS:**
```bash
brew install postgresql
brew services start postgresql
```

**Linux:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 2. Tạo Database

```bash
# Kết nối PostgreSQL
psql -U postgres

# Tạo database
CREATE DATABASE luyen_tap_tieu_hoc;

# Tạo user (optional)
CREATE USER luyen_tap_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE luyen_tap_tieu_hoc TO luyen_tap_user;

# Exit
\q
```

## 🔧 Backend Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

Tạo file `.env` trong folder `backend/`:

```bash
cp .env.example .env
```

Cập nhật `.env`:
```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/luyen_tap_tieu_hoc?schema=public"

# JWT (Generate strong secrets)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production-min-32-chars"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-this-in-production-min-32-chars"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Server
PORT=3001
NODE_ENV=development

# CORS
FRONTEND_URL="http://localhost:5173"
```

**Generate JWT Secrets:**
```bash
# Linux/macOS
openssl rand -base64 32

# Hoặc dùng Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 3. Database Migration

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations (tạo tables)
npm run prisma:migrate

# Seed database (tạo admin user)
npm run prisma:seed
```

### 4. Start Backend

```bash
# Development (watch mode)
npm run dev

# Production
npm run build
npm start
```

Backend sẽ chạy tại: `http://localhost:3001`

## 🎨 Frontend Setup

### 1. Install Dependencies

```bash
# Từ root folder
npm install
```

### 2. Configure Environment (Optional)

Tạo file `.env.local` trong root folder:

```env
VITE_API_BASE_URL=http://localhost:3001
```

### 3. Start Frontend

```bash
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:5173`

## 🔐 Default Credentials

Sau khi chạy `npm run prisma:seed`:

**Admin:**
- Email: `admin@example.com`
- Password: `admin123`

**Test Student:**
- Email: `student@example.com`
- Password: `student123`
- Parent PIN: `1234`

⚠️ **Lưu ý:** Đổi password ngay trong production!

## 📊 Database Schema

### Tables:

1. **users** - Thông tin người dùng
2. **user_progress** - Tiến độ học tập
3. **user_analytics** - Hành vi người dùng
4. **user_rewards** - Phần thưởng/album
5. **admin_users** - Tài khoản admin
6. **audit_logs** - Log truy cập admin

Xem chi tiết trong `backend/prisma/schema.prisma`

## 🚀 Production Deployment (VPS)

### 1. Backend Deployment

```bash
# SSH vào VPS
ssh user@your-vps-ip

# Clone repository
git clone <your-repo-url>
cd ThienTaiDatViet/backend

# Install dependencies
npm install --production

# Setup environment
cp .env.example .env
# Edit .env với production values

# Build
npm run build

# Run migrations
npm run prisma:migrate

# Start với PM2 (recommended)
npm install -g pm2
pm2 start dist/server.js --name "luyen-tap-backend"
pm2 save
pm2 startup
```

### 2. Frontend Deployment

```bash
# Build frontend
cd ..
npm run build

# Deploy với nginx hoặc serve static files
# Copy folder dist/ lên VPS
```

### 3. Nginx Configuration

```nginx
# Backend API
server {
    listen 80;
    server_name api.yourdomain.com;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Frontend
server {
    listen 80;
    server_name yourdomain.com;
    
    root /path/to/frontend/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 🧪 Testing

### Backend Health Check

```bash
curl http://localhost:3001/health
```

### Test Authentication

```bash
# Register
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## 📝 Questions Data Structure

Questions được lưu trong `src/data/questions/` theo cấu trúc:

```
data/questions/
├── ket-noi-tri-thuc/
│   ├── grade-1/
│   │   ├── math/
│   │   │   ├── week-1.json
│   │   │   └── ...
│   │   ├── vietnamese/
│   │   └── english/
│   └── ...
```

Xem ví dụ trong `src/data/questions/ket-noi-tri-thuc/grade-1/math/week-1.json`

## 🐛 Troubleshooting

### Backend không kết nối database

1. Kiểm tra PostgreSQL đang chạy:
   ```bash
   # Windows
   services.msc
   
   # macOS/Linux
   brew services list
   # hoặc
   sudo systemctl status postgresql
   ```

2. Kiểm tra DATABASE_URL trong `.env`
3. Test connection:
   ```bash
   psql -U postgres -d luyen_tap_tieu_hoc
   ```

### Frontend không gọi được API

1. Kiểm tra backend đang chạy: `http://localhost:3001/health`
2. Kiểm tra CORS trong backend: `FRONTEND_URL` trong `.env`
3. Kiểm tra `VITE_API_BASE_URL` trong frontend `.env.local`

### Prisma migration errors

```bash
# Reset database (⚠️ Xóa tất cả data)
npm run prisma:migrate reset

# Hoặc tạo migration mới
npm run prisma:migrate dev --name init
```

## 📚 API Documentation

Xem `backend/README.md` để biết chi tiết API endpoints.

## ✅ Checklist Setup

- [ ] PostgreSQL installed và running
- [ ] Database created
- [ ] Backend `.env` configured
- [ ] Backend dependencies installed
- [ ] Prisma migrations run
- [ ] Database seeded (admin user created)
- [ ] Backend running (port 3001)
- [ ] Frontend dependencies installed
- [ ] Frontend running (port 5173)
- [ ] Test login với default credentials
- [ ] Test admin login

## 🎯 Next Steps

1. Thêm questions data vào `src/data/questions/`
2. Tích hợp progress tracking vào HocPage
3. Tích hợp analytics tracking
4. Customize admin dashboard
5. Deploy lên VPS

---

**🎉 Setup hoàn tất! Chúc bạn code vui vẻ!**

