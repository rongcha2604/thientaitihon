# Hướng Dẫn Deploy và Cập Nhật Bộ Đề

## 🚀 Deploy lên Vercel

### **Cách 1: Deploy qua GitHub (Khuyến nghị - Auto-deploy)**

1. **Push code lên GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/Dragon-Love-AI/ThienTaiNhi.git
   git push -u origin main
   ```

2. **Connect với Vercel:**
   - Truy cập: https://vercel.com
   - Đăng nhập với GitHub
   - Click "New Project"
   - Import repository từ GitHub
   - Vercel sẽ tự động detect Vite
   - Click "Deploy"

3. **Auto-deploy:**
   - Mỗi lần push code lên GitHub → Vercel tự động deploy
   - Không cần làm gì thêm!

### **Cách 2: Deploy qua Vercel CLI**

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **Production deploy:**
   ```bash
   vercel --prod
   ```

## 📝 Cập Nhật Bộ Đề

### **Option 1: Update và Deploy (Git-based - Khuyến nghị)**

Đây là cách đơn giản nhất và có version control:

1. **Update data files:**
   - Sửa các file JSON trong `public/data/`
   - Ví dụ: `public/data/lop1/math.easy.json`

2. **Commit và push:**
   ```bash
   git add public/data/
   git commit -m "Update: Cập nhật bộ đề Toán lớp 1 - Easy"
   git push
   ```

3. **Auto-deploy:**
   - Vercel tự động detect push → Deploy lại
   - Đợi 1-2 phút → Website đã được cập nhật!

**✅ Ưu điểm:**
- Đơn giản, dễ làm
- Có version control (lịch sử thay đổi)
- Auto-deploy, không cần manual
- Free với Vercel

**⚠️ Nhược điểm:**
- Cần commit mỗi lần update (nhưng rất nhanh)
- Có delay 1-2 phút để deploy

### **Option 2: Manual Deploy qua Vercel Dashboard**

1. **Update data files local**
2. **Commit:**
   ```bash
   git add .
   git commit -m "Update data"
   git push
   ```

3. **Hoặc trigger manual deploy:**
   - Vào Vercel Dashboard
   - Click "Redeploy" → Chọn commit mới nhất

### **Option 3: Vercel CLI Deploy**

```bash
# Update data files
# ... edit files ...

# Deploy lại
vercel --prod
```

## 🛠️ Script Helper (Tùy chọn)

Tạo script để update data dễ dàng hơn:

```bash
# Script để validate và format JSON
npm run validate-data

# Script để generate manifest từ data files
npm run generate-manifest
```

*(Có thể implement sau nếu cần)*

## 📋 Workflow Khuyến Nghị

### **Lần đầu deploy:**
1. Push code lên GitHub
2. Connect với Vercel
3. Deploy → Done!

### **Mỗi lần update bộ đề:**
1. Edit JSON files trong `public/data/`
2. Commit: `git add . && git commit -m "Update data" && git push`
3. Đợi 1-2 phút → Website tự động update!

### **Kiểm tra:**
- Vercel Dashboard → Deployments → Xem status
- Visit website → Kiểm tra data mới đã load chưa

## 🔧 Cấu Hình Vercel

File `vercel.json` đã được tạo với:
- Build command: `npm run build`
- Output: `dist`
- SPA routing: Redirect tất cả về `/index.html`
- Cache headers cho data files

## 💡 Tips

1. **Preview deployments:** Mỗi commit tạo preview URL → Test trước khi merge
2. **Environment variables:** Có thể set trong Vercel Dashboard nếu cần
3. **Custom domain:** Có thể setup custom domain trong Vercel Dashboard
4. **Analytics:** Vercel có analytics tích hợp (premium)

## ⚡ Performance

- **Static files:** Data files được cache với max-age=3600 (1 giờ)
- **CDN:** Vercel dùng CDN global → Load nhanh mọi nơi
- **Build time:** ~1-2 phút cho build

## 🔐 Security

- Data files là public (phù hợp cho quiz app)
- Không cần authentication cho static files
- Nếu cần bảo vệ → Có thể implement authentication sau

---

**Tóm tắt:**
1. Push code lên GitHub → Connect Vercel → Deploy
2. Update data → Commit → Push → Auto deploy (1-2 phút)
3. Done! Website tự động cập nhật! 🎉

