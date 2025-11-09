# 🚀 Khởi Động Tất Cả Services - Backend + Frontend

## ⚡ Cách 1: Dùng PowerShell Script (RECOMMENDED)

### Windows PowerShell:

1. **Mở PowerShell** trong folder root: `d:\HocTapLTHT\ThienTaiDatViet\`
2. **Chạy script:**

```powershell
.\start-all.ps1
```

### Hoặc double-click file:
- Double-click `start-all.ps1` trong File Explorer

### Kết quả:
- ✅ 2 terminal windows sẽ mở ra:
  - **Backend Terminal:** Chạy `npm run dev` trong folder backend
  - **Frontend Terminal:** Chạy `npm run dev` trong folder root
- ✅ Backend: `http://localhost:3001`
- ✅ Frontend: `http://localhost:5173`

---

## ⚡ Cách 2: Dùng Batch Script

### Windows CMD:

1. **Mở Command Prompt** trong folder root
2. **Chạy:**

```cmd
start-all.bat
```

### Hoặc double-click:
- Double-click `start-all.bat` trong File Explorer

---

## 🛑 Dừng Tất Cả Services

### PowerShell:

```powershell
.\stop-all.ps1
```

### Hoặc đóng thủ công:
- Đóng 2 terminal windows (Backend và Frontend)

---

## 📋 Checklist Trước Khi Chạy:

- [ ] Backend `.env` file đã được tạo (với password PostgreSQL)
- [ ] Backend dependencies đã install (`cd backend && npm install`)
- [ ] Frontend dependencies đã install (`npm install`)
- [ ] PostgreSQL đang chạy (port 5432)
- [ ] Database `luyen_tap_tieu_hoc` đã được tạo
- [ ] Backend migrations đã chạy (`cd backend && npm run prisma:migrate`)
- [ ] Backend seed đã chạy (`cd backend && npm run prisma:seed`)

---

## 🧪 Test Sau Khi Chạy:

1. **Backend Health Check:**
   ```
   http://localhost:3001/health
   ```
   → Nếu thấy `{"status":"ok"}` → ✅ Backend OK

2. **Frontend:**
   ```
   http://localhost:5173
   ```
   → Nếu thấy Login Page → ✅ Frontend OK

3. **Login:**
   - Admin: `admin@example.com` / `admin123`
   - Student: `student@example.com` / `student123`

---

## 🐛 Troubleshooting:

### Backend không chạy:
- Kiểm tra PostgreSQL đang chạy
- Kiểm tra `.env` file trong backend folder
- Kiểm tra port 3001 có bị chiếm không

### Frontend không chạy:
- Kiểm tra dependencies: `npm install`
- Kiểm tra port 5173 có bị chiếm không
- Kiểm tra vite.config.ts

### Port đã được sử dụng:
```powershell
# Tìm process đang dùng port
netstat -ano | findstr :3001
netstat -ano | findstr :5173

# Kill process (thay PID bằng số thực tế)
taskkill /PID <PID> /F
```

---

## 💡 Tips:

- **Giữ 2 terminal windows mở** để xem logs
- **Để dừng:** Đóng terminal windows hoặc Ctrl+C trong mỗi terminal
- **Restart:** Chạy `start-all.ps1` lại

---

**🎉 Chúc bạn code vui vẻ!**

