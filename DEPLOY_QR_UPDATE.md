# 🚀 Hướng dẫn Deploy cập nhật QR Zalo lên GitHub

## ✅ Những thay đổi đã thực hiện:
1. ✅ Thêm mã QR Zalo vào màn hình kích hoạt bản quyền (`ActivationScreen.tsx`)
2. ✅ Hỗ trợ cả file JPG và PNG (`zalo-qr.jpg` hoặc `zalo-qr.png`)
3. ✅ Tự động fallback nếu không tìm thấy hình ảnh
4. ✅ Cập nhật script deploy

## 📋 Cách Deploy:

### **Cách 1: Dùng script tự động (Khuyến nghị)**

1. Mở Command Prompt hoặc PowerShell
2. Di chuyển vào thư mục dự án:
   ```bash
   cd "D:\HocTapLTHT\Dự án đã hoàn tất\thientaitihon-main\thientaitihon-main"
   ```
3. Chạy script:
   ```bash
   update-github.bat
   ```
4. Nhập commit message (hoặc Enter để dùng mặc định)
5. Đợi script hoàn thành

### **Cách 2: Deploy thủ công**

```bash
# Di chuyển vào thư mục dự án
cd "D:\HocTapLTHT\Dự án đã hoàn tất\thientaitihon-main\thientaitihon-main"

# Kiểm tra thay đổi
git status

# Thêm tất cả thay đổi
git add .

# Commit
git commit -m "Update: Thêm mã QR Zalo vào màn hình kích hoạt bản quyền"

# Push lên GitHub
git push -u origin main
# Hoặc nếu branch là master:
git push -u origin master
```

## 📝 Lưu ý:

1. **Đảm bảo file QR đã được đặt vào thư mục `public/`:**
   - `public/zalo-qr.jpg` hoặc
   - `public/zalo-qr.png`

2. **Kiểm tra remote GitHub:**
   ```bash
   git remote -v
   ```
   Kết quả mong đợi:
   ```
   origin  https://github.com/rongcha2604/tkbpro.git (fetch)
   origin  https://github.com/rongcha2604/tkbpro.git (push)
   ```

3. **Nếu chưa login GitHub:**
   - Cài đặt GitHub CLI: `gh auth login`
   - Hoặc dùng Personal Access Token

## 🎯 Sau khi deploy:

- ✅ Code sẽ được push lên GitHub
- ✅ Vercel sẽ tự động deploy (nếu đã kết nối)
- ✅ Mã QR Zalo sẽ hiển thị trong màn hình kích hoạt bản quyền

## ❓ Xử lý lỗi:

### Lỗi: "remote origin already exists"
```bash
git remote set-url origin https://github.com/rongcha2604/tkbpro.git
```

### Lỗi: "Permission denied"
- Kiểm tra quyền truy cập repo
- Đảm bảo đã login GitHub

### Lỗi: "Branch not found"
- Kiểm tra branch hiện tại: `git branch`
- Push đúng branch: `git push -u origin <branch-name>`

---

**Chúc bạn deploy thành công! 🎉**

