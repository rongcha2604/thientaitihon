# 🚀 Cách Start Frontend

## ✅ Frontend Setup đã hoàn tất!

### 📋 Checklist:
- [x] Axios đã được cài đặt
- [x] File `.env.local` đã được tạo
- [x] Vite config đã được sửa (port 5173)
- [x] Dependencies đã được cài đặt

## 🚀 Start Frontend:

### Mở Terminal mới trong folder root:

1. Mở **File Explorer** → `d:\HocTapLTHT\ThienTaiDatViet\`
2. **Shift + Right-click** vào folder → **"Open PowerShell window here"**
3. Chạy:

```powershell
npm run dev
```

### Bạn sẽ thấy:

```
  VITE v6.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Test Frontend:

1. **Mở browser:** `http://localhost:5173`
2. **Bạn sẽ thấy:** Login Page
3. **Login với:**
   - Admin: `admin@example.com` / `admin123`
   - Student: `student@example.com` / `student123`

### Sau khi login:

- ✅ **App chính:** Học, Ôn tập, Album, Hồ sơ
- ✅ **Admin button:** Nếu login admin → Click nút Admin ở góc trên
- ✅ **Admin Dashboard:** Login admin → Xem analytics, users list

## 🐛 Troubleshooting:

### Frontend không chạy:
```powershell
# Reinstall dependencies
npm install

# Start lại
npm run dev
```

### Port 5173 đã được sử dụng:
```powershell
# Tìm process đang dùng port
netstat -ano | findstr :5173

# Kill process (thay PID bằng số thực tế)
taskkill /PID <PID> /F
```

### Lỗi "Cannot find module":
```powershell
# Reinstall
npm install
```

---

**💡 Tip:** Giữ terminal mở để frontend chạy liên tục!

