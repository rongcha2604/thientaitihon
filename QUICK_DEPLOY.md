# 🚀 Quick Deploy Guide - Vercel

## Deploy lần đầu (1 lần duy nhất)

### Cách 1: Qua GitHub (Khuyến nghị - Auto-deploy)

```bash
# 1. Push code lên GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main

# 2. Vào Vercel.com → Import project từ GitHub → Deploy
# Done! Website sẽ tự động deploy
```

### Cách 2: Qua Vercel CLI

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel --prod
```

## 🔄 Cập Nhật Bộ Đề (Mỗi lần update)

### Workflow đơn giản:

```bash
# 1. Sửa data files trong public/data/
# Ví dụ: public/data/lop1/math.easy.json

# 2. Commit và push
git add public/data/
git commit -m "Update: Cập nhật bộ đề Toán lớp 1"
git push

# 3. Vercel tự động deploy! (đợi 1-2 phút)
# Done! Website đã được cập nhật
```

## ✅ Kiểm tra

1. Vào Vercel Dashboard → Xem deployment mới nhất
2. Visit website → Test bộ đề mới

## 💡 Tips

- **Preview:** Mỗi commit tạo preview URL → Test trước khi merge
- **Cache:** Data files cache 1 giờ (config trong `vercel.json`)
- **Validate:** Chạy `npm run validate-data` để kiểm tra JSON trước khi push

---

**Tóm tắt:** Update data → Commit → Push → Auto deploy! 🎉

