# 🚀 Hướng Dẫn Sử Dụng Scripts .bat

## 📋 Các file .bat có sẵn:

### 1. **update-github.bat** - Cập nhật tất cả lên GitHub
- **Mục đích:** Commit và push tất cả thay đổi
- **Khi dùng:** Sau khi thay đổi code, UI, data, hoặc bất kỳ file nào
- **Cách dùng:** Double-click file hoặc chạy trong terminal
- **Workflow:**
  1. Add tất cả files
  2. Nhập commit message (hoặc dùng default)
  3. Commit
  4. Push lên GitHub

### 2. **update-data-only.bat** - Chỉ cập nhật bộ đề
- **Mục đích:** Chỉ commit và push data files (public/data/)
- **Khi dùng:** Khi chỉ cập nhật bộ đề, không thay đổi code
- **Cách dùng:** Double-click file
- **Workflow:**
  1. Add chỉ data files
  2. Nhập commit message (hoặc dùng default)
  3. Commit
  4. Push lên GitHub

### 3. **deploy-vercel.bat** - Deploy trực tiếp lên Vercel
- **Mục đích:** Build và deploy lên Vercel (không qua GitHub)
- **Khi dùng:** Khi muốn deploy ngay, không qua Git
- **Cách dùng:** Double-click file
- **Workflow:**
  1. Build project (npm run build)
  2. Deploy lên Vercel (vercel --prod)

## ⚡ Cách sử dụng nhanh:

### Cập nhật bộ đề:
```
1. Sửa files trong public/data/
2. Double-click: update-data-only.bat
3. Nhập message (hoặc Enter để dùng default)
4. Done! → Vercel tự động deploy
```

### Cập nhật code:
```
1. Sửa code
2. Double-click: update-github.bat
3. Nhập message
4. Done! → Vercel tự động deploy
```

### Deploy trực tiếp:
```
1. Double-click: deploy-vercel.bat
2. Done! → App deploy lên Vercel
```

## ⚠️ Lưu ý:

- **Lần đầu:** Cần login GitHub và Vercel
- **Permission:** Đảm bảo có quyền push vào repo
- **Network:** Cần kết nối internet để push/deploy

## 💡 Tips:

- **Preview:** Mỗi commit tạo preview URL trên Vercel → Test trước
- **Auto-deploy:** Nếu connect GitHub với Vercel → Auto deploy mỗi push
- **Validate:** Chạy `npm run validate-data` trước khi push data

---

**Vậy thôi! Đơn giản đúng không?** 😊

