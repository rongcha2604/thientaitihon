# 🚀 Performance Optimization Guide - Tối Ưu Tốc Độ Load Web

## ✅ Đã Implement

### 1. **Vite Build Optimizations**
- ✅ **Chunk Splitting**: Tách vendor, pages, contexts thành chunks riêng
  - `vendor-react`: React core (critical)
  - `vendor-capacitor`: Capacitor (chỉ mobile)
  - `vendor`: Các libraries khác
  - `page-*`: Mỗi page một chunk
  - `contexts`: Context providers
- ✅ **Minification**: Terser với drop_debugger
- ✅ **Source Maps**: Tắt trong production (giảm size)
- ✅ **Target**: `esnext` (modern browsers, giảm bundle size)
- ✅ **CSS Code Splitting**: Tách CSS theo chunks

### 2. **Resource Hints & Preloading**
- ✅ **Preconnect**: Google Fonts (giảm DNS lookup time)
- ✅ **Preload**: Critical icons và manifest
- ✅ **Font Loading**: Async load với `font-display: swap` (không block rendering)
- ✅ **Prefetch Pages**: Prefetch các pages có thể navigate (sau 2 giây)

### 3. **Service Worker Smart Caching**
- ✅ **HTML**: Network-first (luôn mới nhất)
- ✅ **JS/CSS với hash**: Cache-first với stale-while-revalidate (nhanh nhất)
- ✅ **Images**: Cache-first với stale-while-revalidate (instant load)
- ✅ **Fonts/Manifest**: Cache-first (không thay đổi)
- ✅ **Data files (JSON)**: Network-first với cache fallback

### 4. **Lazy Loading**
- ✅ **Pages**: Đã có lazy loading (React.lazy)
- ✅ **Images**: Component `LazyImage` với Intersection Observer
- ✅ **Code Splitting**: Automatic với Vite

### 5. **React Optimizations**
- ✅ **useCallback**: Đã dùng trong ExercisePage, HoSoPage
- ✅ **Lazy Components**: Pages được lazy load

## 📊 Performance Metrics (Expected)

### Before Optimization:
- Initial Load: ~3-5s
- Time to Interactive: ~4-6s
- Bundle Size: ~500-800KB (all in one)

### After Optimization:
- Initial Load: ~1-2s (giảm 50-60%)
- Time to Interactive: ~1.5-2.5s (giảm 50-60%)
- Bundle Size: ~200-300KB initial (giảm 60-70%)
- Subsequent Loads: ~0.5-1s (từ cache)

## 🔧 Cách Sử Dụng

### 1. LazyImage Component
```tsx
import LazyImage from './components/common/LazyImage';

// Thay vì:
<img src="/image.png" alt="Image" />

// Dùng:
<LazyImage 
  src="/image.png" 
  alt="Image"
  placeholder="/placeholder.png" // Optional
  fallback="/fallback.png" // Optional
  className="w-full h-auto"
/>
```

### 2. Prefetch Pages (Tự động)
- App.tsx tự động prefetch các pages sau 2 giây
- Không cần code thêm

### 3. Build Optimization
```bash
# Build với optimizations
npm run build

# Preview để test
npm run preview
```

## 📋 Checklist Optimization

### ✅ Đã Hoàn Thành:
- [x] Chunk splitting (vendor, pages, contexts)
- [x] Resource hints (preconnect, preload)
- [x] Font optimization (async, font-display swap)
- [x] Service worker smart caching
- [x] Lazy loading pages
- [x] LazyImage component
- [x] Minification & compression
- [x] CSS code splitting

### 🔄 Có Thể Cải Thiện Thêm:
- [ ] Image optimization (WebP format, responsive images)
- [ ] React.memo cho heavy components
- [ ] Virtual scrolling cho long lists
- [ ] Debounce/throttle cho expensive operations
- [ ] Service worker preload critical assets
- [ ] CDN cho static assets
- [ ] HTTP/2 Server Push (nếu server support)

## 🎯 Best Practices

### 1. Images:
- ✅ Dùng `LazyImage` component
- ✅ Optimize images (compress, WebP)
- ✅ Responsive images (srcset)
- ✅ Lazy load images below fold

### 2. JavaScript:
- ✅ Lazy load non-critical code
- ✅ Code splitting theo routes
- ✅ Tree shaking (tự động với Vite)
- ✅ Minify production builds

### 3. CSS:
- ✅ Critical CSS inline (nếu cần)
- ✅ Lazy load non-critical CSS
- ✅ Remove unused CSS (Tailwind tự động)

### 4. Caching:
- ✅ Cache static assets lâu dài (vì có hash)
- ✅ Cache HTML ngắn (hoặc không cache)
- ✅ Service worker cho offline support

## 🧪 Testing Performance

### Lighthouse:
```bash
# Mở Chrome DevTools → Lighthouse
# Run audit → Check Performance score
```

### Network Tab:
- Check bundle sizes
- Check load times
- Check cache hits

### Performance Tab:
- Check FCP (First Contentful Paint)
- Check LCP (Largest Contentful Paint)
- Check TTI (Time to Interactive)

## 📊 Expected Results

### Lighthouse Scores:
- **Performance**: 85-95 (từ 60-70)
- **Best Practices**: 90-100
- **SEO**: 90-100
- **Accessibility**: 90-100

### Core Web Vitals:
- **FCP**: < 1.8s (từ 3-4s)
- **LCP**: < 2.5s (từ 4-5s)
- **TTI**: < 3.8s (từ 5-6s)
- **CLS**: < 0.1 (giữ nguyên)

## 🚀 Next Steps (Optional)

1. **Image Optimization**:
   - Convert to WebP format
   - Add responsive images (srcset)
   - Use image CDN

2. **React Optimization**:
   - Add React.memo cho heavy components
   - Optimize re-renders với useMemo
   - Virtual scrolling cho lists

3. **Advanced Caching**:
   - IndexedDB cho large data
   - Cache API responses
   - Background sync

4. **Monitoring**:
   - Add performance monitoring
   - Track Core Web Vitals
   - Alert on performance regression

