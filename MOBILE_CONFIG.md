# 📱 Hướng Dẫn Cấu Hình Cho Điện Thoại

## 🎯 Mục Đích
Để truy cập ứng dụng từ điện thoại (mobile), bạn cần cấu hình API URL để trỏ đến IP máy tính thay vì `localhost`.

---

## 🔧 Bước 1: Tìm IP Máy Tính

### Windows:
```powershell
ipconfig
```
Tìm dòng **IPv4 Address** (ví dụ: `192.168.1.100`)

### macOS/Linux:
```bash
ifconfig
# hoặc
ip addr
```
Tìm IP trong mạng LAN (thường bắt đầu với `192.168.x.x` hoặc `10.x.x.x`)

---

## 🔧 Bước 2: Cấu Hình Frontend

### Tạo file `.env` trong thư mục gốc (cùng cấp với `package.json`):

```env
# Thay [YOUR_IP] bằng IP máy tính của bạn
VITE_API_BASE_URL=http://[YOUR_IP]:3001
```

### Ví dụ:
```env
# Nếu IP máy tính là 192.168.1.100
VITE_API_BASE_URL=http://192.168.1.100:3001
```

---

## 🔧 Bước 3: Khởi Động Lại Frontend

Sau khi tạo/cập nhật file `.env`, bạn cần **khởi động lại frontend**:

```bash
# Dừng frontend (Ctrl+C)
# Sau đó chạy lại:
npm run dev
```

---

## 🔧 Bước 4: Truy Cập Từ Điện Thoại

### Đảm Bảo:
1. ✅ Điện thoại và máy tính **cùng mạng Wi-Fi** (LAN)
2. ✅ Backend đang chạy trên `0.0.0.0:3001` (đã config rồi)
3. ✅ Frontend đang chạy trên `0.0.0.0:5173` (đã config rồi)
4. ✅ File `.env` đã được tạo với IP đúng

### Truy Cập:
- **Frontend URL:** `http://[YOUR_IP]:5173`
- **Backend URL:** `http://[YOUR_IP]:3001`

### Ví dụ:
- Nếu IP máy tính là `192.168.1.100`:
  - Frontend: `http://192.168.1.100:5173`
  - Backend: `http://192.168.1.100:3001`

---

## ⚠️ Lưu Ý Quan Trọng

### 1. Firewall:
Nếu không truy cập được, có thể do firewall:
- **Windows:** Cho phép Node.js qua firewall
- **macOS:** System Preferences → Security → Firewall

### 2. CORS:
- ✅ Backend đã config CORS để cho phép tất cả origins trong development
- ✅ Mobile có thể truy cập được

### 3. Production:
- ⚠️ Trong production, cần config CORS strict hơn
- ⚠️ Không nên cho phép tất cả origins trong production

---

## 🧪 Kiểm Tra

### Test từ điện thoại:
1. Mở trình duyệt trên điện thoại
2. Truy cập: `http://[YOUR_IP]:5173`
3. Đăng nhập với:
   - Admin: `admin@example.com` / `admin123`
   - Student: `student@example.com` / `student123`

### Nếu vẫn không được:
1. ✅ Kiểm tra IP có đúng không
2. ✅ Kiểm tra backend có chạy không: `http://[YOUR_IP]:3001/health`
3. ✅ Kiểm tra frontend có chạy không: `http://[YOUR_IP]:5173`
4. ✅ Kiểm tra firewall
5. ✅ Kiểm tra cả 2 cùng mạng Wi-Fi

---

## 📝 Quick Reference

**File `.env` trong thư mục gốc:**
```env
VITE_API_BASE_URL=http://192.168.1.100:3001
```

**Restart frontend sau khi config:**
```bash
npm run dev
```

**URL truy cập từ mobile:**
- Frontend: `http://192.168.1.100:5173`
- Backend: `http://192.168.1.100:3001`

---

✅ **Done!** Bây giờ bạn có thể truy cập từ điện thoại rồi!

