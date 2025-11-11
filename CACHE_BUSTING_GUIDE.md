# 🚀 Cache Busting Guide - Giải Pháp Triệt Để

## ✅ Đã Implement

### 1. **HTML Meta Tags** (index.html)
- ✅ Thêm `Cache-Control: no-cache` để browser không cache HTML
- ✅ HTML luôn được fetch mới từ server

### 2. **Service Worker với Auto Versioning**
- ✅ Version tự động được inject khi build (timestamp-based)
- ✅ Network-first strategy: Luôn fetch từ network trước, fallback to cache
- ✅ Tự động xóa cache cũ khi version mới activate
- ✅ KHÔNG cache HTML, chỉ cache assets (JS, CSS, images)

### 3. **Vite Build Configuration**
- ✅ Hash-based filenames: `assets/[name].[hash].js`
- ✅ Mỗi lần build tạo hash mới → Browser tự động load file mới
- ✅ Vite plugin tự động inject version vào service worker

### 4. **Service Worker Auto Update**
- ✅ Tự động check update mỗi khi page load
- ✅ Tự động reload khi có version mới
- ✅ Check update mỗi giờ

## 🔧 Cách Hoạt Động

### Khi Build:
1. Vite plugin inject version (timestamp) vào `service-worker.js`
2. Vite build tạo files với hash: `main.abc123.js`, `style.def456.css`
3. HTML được generate với links đến files mới

### Khi User Load Page:
1. Browser fetch HTML (không cache vì meta tags)
2. HTML load JS/CSS với hash mới → Browser tự động fetch files mới
3. Service Worker check version → Nếu khác → Xóa cache cũ → Load version mới

### Khi Deploy Mới:
1. Build tạo version mới → Service worker version mới
2. User load page → Service worker detect version khác
3. Tự động xóa cache cũ → Load version mới → Auto reload

## 📋 Server Configuration (Nếu Cần)

### Nginx:
```nginx
# HTML: Không cache
location ~* \.html$ {
    add_header Cache-Control "no-cache, no-store, must-revalidate";
    add_header Pragma "no-cache";
    add_header Expires "0";
}

# Service Worker: Không cache
location ~* service-worker\.js$ {
    add_header Cache-Control "no-cache, no-store, must-revalidate";
    add_header Pragma "no-cache";
    add_header Expires "0";
}

# Assets với hash: Cache lâu dài (vì hash đã đảm bảo version mới)
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
    add_header Cache-Control "public, max-age=31536000, immutable";
}
```

### Apache (.htaccess):
```apache
# HTML: Không cache
<FilesMatch "\.html$">
    Header set Cache-Control "no-cache, no-store, must-revalidate"
    Header set Pragma "no-cache"
    Header set Expires "0"
</FilesMatch>

# Service Worker: Không cache
<FilesMatch "service-worker\.js$">
    Header set Cache-Control "no-cache, no-store, must-revalidate"
    Header set Pragma "no-cache"
    Header set Expires "0"
</FilesMatch>

# Assets với hash: Cache lâu dài
<FilesMatch "\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
</FilesMatch>
```

### Vercel/Netlify:
- Tự động handle cache headers cho static files
- Chỉ cần đảm bảo HTML và service-worker.js không cache

## 🧪 Test Cache Busting

### Test Local:
```bash
# Build
npm run build

# Preview
npm run preview

# Mở browser DevTools → Network tab
# Check:
# 1. HTML không có cache (Status: 200, không có "from cache")
# 2. JS/CSS files có hash trong tên
# 3. Service worker version được inject
```

### Test Production:
1. Deploy version 1
2. User load page → Cache được tạo
3. Deploy version 2 (build mới)
4. User load page → Tự động load version mới (không cần hard refresh)

## ⚠️ Lưu Ý

1. **Service Worker Version**: Tự động update mỗi lần build (timestamp)
2. **File Hashes**: Vite tự động tạo hash mới khi code thay đổi
3. **HTML**: Luôn fetch mới (không cache)
4. **Assets**: Cache lâu dài vì có hash (immutable)

## 🔍 Debug

### Kiểm tra Service Worker Version:
```javascript
// Trong browser console
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(reg => {
    console.log('Service Worker:', reg.active?.scriptURL);
  });
});
```

### Kiểm tra Cache:
```javascript
// Trong browser console
caches.keys().then(keys => {
  console.log('Caches:', keys);
});
```

### Clear Cache Manually (nếu cần):
```javascript
// Trong browser console
caches.keys().then(keys => {
  keys.forEach(key => caches.delete(key));
});
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(reg => reg.unregister());
});
```

## ✅ Kết Quả

- ✅ **HTML**: Luôn mới nhất (không cache)
- ✅ **JS/CSS**: Hash-based → Tự động load version mới
- ✅ **Service Worker**: Auto versioning → Tự động update
- ✅ **Browser Cache**: Tự động invalidate khi version mới
- ✅ **User Experience**: Không cần hard refresh, tự động update

