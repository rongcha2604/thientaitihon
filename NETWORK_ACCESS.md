# Hướng Dẫn Truy Cập App Từ Bên Ngoài

## 📡 Cấu hình đã setup

App đã được cấu hình để cho phép truy cập từ bên ngoài qua `host: '0.0.0.0'`.

## 🚀 Cách sử dụng

### Option 1: Development Mode (npm run dev)

1. **Chạy dev server:**
   ```bash
   npm run dev
   ```

2. **Truy cập từ máy khác trong cùng mạng WiFi:**
   - Mở trình duyệt trên máy khác
   - Truy cập: `http://192.168.1.38:5173`
   - Hoặc dùng IP khác nếu có nhiều network interface

3. **Truy cập từ máy tính hiện tại:**
   - Local: `http://localhost:5173`
   - Network: `http://192.168.1.38:5173`

### Option 2: Production Build (npm run preview)

1. **Build app:**
   ```bash
   npm run build
   ```

2. **Chạy preview server:**
   ```bash
   npm run preview
   ```

3. **Truy cập từ máy khác:**
   - URL: `http://192.168.1.38:4173`

## 📱 Truy cập từ điện thoại/tablet

### Trên cùng mạng WiFi:
1. Đảm bảo điện thoại/tablet kết nối cùng WiFi với máy tính
2. Mở trình duyệt (Chrome, Safari, etc.)
3. Truy cập: `http://192.168.1.38:5173`
4. Done! 🎉

### Lưu ý:
- IP address có thể thay đổi nếu router reset hoặc DHCP renew
- Nếu không truy cập được, kiểm tra firewall Windows

## 🔥 Firewall Setup

Nếu không truy cập được từ bên ngoài, cần allow port trong Windows Firewall:

### Cách 1: Qua PowerShell (Admin)
```powershell
New-NetFirewallRule -DisplayName "Vite Dev Server" -Direction Inbound -LocalPort 5173 -Protocol TCP -Action Allow
New-NetFirewallRule -DisplayName "Vite Preview" -Direction Inbound -LocalPort 4173 -Protocol TCP -Action Allow
```

### Cách 2: Qua Windows Firewall GUI
1. Mở Windows Defender Firewall
2. Advanced settings
3. Inbound Rules → New Rule
4. Port → TCP → 5173 (hoặc 4173)
5. Allow connection
6. Finish

## 🌐 IP Address của máy bạn

- **LAN IP:** `192.168.1.38`
- **Port dev:** `5173`
- **Port preview:** `4173`

### Xem IP address mới:
```bash
ipconfig | findstr IPv4
```

## ✅ Test kết nối

1. **Từ máy tính khác:** Mở browser → `http://192.168.1.38:5173`
2. **Từ điện thoại:** Mở browser → `http://192.168.1.38:5173`
3. **Từ tablet:** Mở browser → `http://192.168.1.38:5173`

Nếu load được app → Thành công! 🎉

## 🔒 Security Note

⚠️ **Lưu ý:** App hiện tại chỉ phục vụ trong mạng nội bộ (LAN). Để truy cập từ internet, cần:
- Setup port forwarding trên router
- Hoặc deploy lên hosting (Vercel, Netlify, etc.)

---

**Chúc bạn sử dụng vui vẻ!** 🚀✨

