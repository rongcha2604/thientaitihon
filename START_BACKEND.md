# 🚀 Cách Start Backend Server

## ⚠️ Backend đang không chạy!

Bạn cần mở terminal riêng để start backend server.

## 📋 Hướng dẫn:

### Bước 1: Mở Terminal mới

1. Mở **File Explorer** → `d:\HocTapLTHT\ThienTaiDatViet\backend\`
2. **Shift + Right-click** vào folder `backend` → **"Open PowerShell window here"**

### Bước 2: Start Backend

Trong terminal mới, gõ:

```powershell
npm run dev
```

### Bước 3: Kiểm tra

Bạn sẽ thấy:
```
🚀 Server running on http://localhost:3001
📊 Environment: development
🔗 Frontend URL: http://localhost:5173
```

### Bước 4: Test

Mở browser: `http://localhost:3001/health`

Nếu thấy: `{"status":"ok","timestamp":"..."}` → ✅ Backend đã chạy!

## 🔍 Nếu có lỗi:

### Lỗi "Cannot find module":
```powershell
npm install
```

### Lỗi Database connection:
- Kiểm tra PostgreSQL đang chạy: Services → postgresql-x64-18
- Kiểm tra password trong `.env`: `306127`
- Kiểm tra database đã tạo: `luyen_tap_tieu_hoc`

### Lỗi Port 3001 đã được sử dụng:
```powershell
# Tìm process đang dùng port 3001
netstat -ano | findstr :3001

# Kill process (thay PID bằng số thực tế)
taskkill /PID <PID> /F
```

---

**💡 Tip:** Để backend chạy liên tục, giữ terminal đó mở. Đừng đóng terminal!

