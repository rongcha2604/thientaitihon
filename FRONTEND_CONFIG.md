# Frontend Configuration Guide

## Cấu hình Backend API URL

### Tạo file `.env` trong thư mục root (cùng cấp với `package.json`)

```env
# Backend API Base URL
# Development: http://localhost:3001
# Production: http://[PUBLIC_IP]:3001 hoặc https://api.yourdomain.com
VITE_API_BASE_URL=http://localhost:3001
```

### Ví dụ:

**Development (Localhost):**
```env
VITE_API_BASE_URL=http://localhost:3001
```

**Production (Public IP):**
```env
VITE_API_BASE_URL=http://123.45.67.89:3001
```

**Production (Domain):**
```env
VITE_API_BASE_URL=https://api.yourdomain.com
```

### Lưu ý:

1. **Tạo file `.env`:**
   - Copy từ template này
   - Set `VITE_API_BASE_URL` theo địa chỉ backend của bạn
   - File `.env` sẽ tự động được ignore bởi git (không commit)

2. **Restart Frontend:**
   - Sau khi thay đổi `.env`, cần restart frontend server
   - Stop server (Ctrl+C) và chạy lại `npm run dev`

3. **Network Access:**
   - Frontend server đã được config để listen trên `0.0.0.0`
   - Có thể truy cập từ LAN: `http://[YOUR_IP]:5173`
   - Có thể truy cập từ internet: `http://[PUBLIC_IP]:5173` (nếu có port forwarding)

