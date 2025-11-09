# 🚀 HƯỚNG DẪN NHANH - Fix Đăng Nhập Từ Điện Thoại

## ❌ VẤN ĐỀ:
Điện thoại không đăng nhập được vì frontend đang dùng `localhost:3001` (mobile không truy cập được).

## ✅ GIẢI PHÁP:

### Bước 1: Tìm IP Máy Tính

**Windows:**
```powershell
ipconfig
```
Tìm dòng **IPv4 Address** (ví dụ: `192.168.1.100`)

**Hoặc dùng lệnh nhanh:**
```powershell
ipconfig | findstr /i "IPv4"
```

---

### Bước 2: Cập Nhật File `.env`

Mở file `.env` trong thư mục gốc (cùng cấp với `package.json`):

```env
# Thay [YOUR_IP] bằng IP máy tính của bạn
VITE_API_BASE_URL=http://[YOUR_IP]:3001
```

**Ví dụ:**
```env
# Nếu IP máy tính là 192.168.1.100
VITE_API_BASE_URL=http://192.168.1.100:3001
```

---

### Bước 3: Restart Frontend

**QUAN TRỌNG:** Sau khi cập nhật file `.env`, bạn **PHẢI restart frontend**:

```bash
# Dừng frontend (Ctrl+C)
# Sau đó chạy lại:
npm run dev
```

---

### Bước 4: Truy Cập Từ Điện Thoại

**Đảm Bảo:**
- ✅ Điện thoại và máy tính **cùng mạng Wi-Fi** (LAN)
- ✅ Backend đang chạy
- ✅ Frontend đang chạy
- ✅ File `.env` đã được cập nhật với IP đúng

**Truy Cập:**
- **Frontend URL:** `http://[YOUR_IP]:5173`
- **Backend URL:** `http://[YOUR_IP]:3001`

**Ví dụ:**
- Nếu IP máy tính là `192.168.1.100`:
  - Frontend: `http://192.168.1.100:5173`
  - Backend: `http://192.168.1.100:3001`

---

## 🧪 KIỂM TRA:

### Test từ máy tính trước:
1. Truy cập: `http://[YOUR_IP]:5173` (thay `localhost` bằng IP)
2. Đăng nhập → Xem có hoạt động không

### Test từ điện thoại:
1. Mở trình duyệt trên điện thoại
2. Truy cập: `http://[YOUR_IP]:5173`
3. Đăng nhập với:
   - Admin: `admin@example.com` / `admin123`
   - Student: `student@example.com` / `student123`

---

## ⚠️ NẾU VẪN KHÔNG ĐƯỢC:

1. **Kiểm tra IP có đúng không:**
   - Chạy lại `ipconfig` → Tìm IPv4 Address
   - Đảm bảo IP bắt đầu với `192.168.` hoặc `10.`

2. **Kiểm tra firewall:**
   - Windows: Cho phép Node.js qua firewall
   - Hoặc tắt firewall tạm thời để test

3. **Kiểm tra cả 2 cùng mạng Wi-Fi:**
   - Điện thoại và máy tính phải cùng mạng Wi-Fi
   - Không dùng mobile data

4. **Kiểm tra backend có chạy không:**
   - Truy cập: `http://[YOUR_IP]:3001/health`
   - Phải trả về: `{ "status": "ok" }`

5. **Kiểm tra frontend có chạy không:**
   - Truy cập: `http://[YOUR_IP]:5173`
   - Phải hiển thị trang login

6. **Restart lại cả 2:**
   - Dừng cả frontend và backend
   - Chạy lại cả 2

---

## 📝 QUICK CHECKLIST:

- [ ] Tìm IP máy tính (`ipconfig`)
- [ ] Cập nhật file `.env` với IP đúng
- [ ] Restart frontend (`npm run dev`)
- [ ] Đảm bảo backend đang chạy
- [ ] Đảm bảo cả 2 cùng mạng Wi-Fi
- [ ] Test từ điện thoại: `http://[YOUR_IP]:5173`

---

✅ **Done!** Sau khi làm xong các bước trên, điện thoại sẽ đăng nhập được!

