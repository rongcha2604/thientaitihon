# 🧪 Test Checklist - Hệ Thống Linh Vật

## ✅ Đã Hoàn Thành

- [x] Database schema (migration đã chạy)
- [x] Seed data (10 linh vật đã tạo)
- [x] Backend API (controllers, routes)
- [x] Frontend API client
- [x] AlbumPage integration
- [x] Award stars từ bài học/challenge

## 🧪 Test Steps

### Bước 1: Start Backend & Frontend

**Terminal 1 - Backend:**
```powershell
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
npm run dev
```

**Kiểm tra:**
- Backend: http://localhost:3001/health → `{"status":"ok"}`
- Frontend: http://localhost:5173 → App hiển thị

### Bước 2: Test API Endpoints (Optional)

**Test Public Endpoint (không cần login):**
```powershell
cd backend
node test-spirit-pets-api.js
```

**Expected:**
- ✅ Found 10 spirit pets
- ✅ Health check OK

### Bước 3: Test Frontend - Album Page

1. **Mở browser:** http://localhost:5173
2. **Đăng nhập** (hoặc dùng guest mode)
3. **Vào Album Page** (icon 🧺)
4. **Kiểm tra Header:**
   - ✅ Hiển thị coins (🪙)
   - ✅ Hiển thị stars (⭐) - mới thêm!

5. **Click Tab "Linh vật" (🐉):**
   - ✅ Hiển thị 10 linh vật
   - ✅ Mỗi linh vật có:
     - Emoji/icon placeholder
     - Tên linh vật
     - Cấp độ (⭐ x5)
     - Progress bar (nếu đã unlock)
     - Nút "Mở khóa" hoặc "Nâng cấp"

### Bước 4: Test Unlock Linh Vật

**Prerequisites:** Cần có ít nhất 50 sao

1. **Nếu chưa có sao:**
   - Vào bài học → Hoàn thành tuần → Nhận sao
   - Hoặc làm challenge → Hoàn thành → Nhận sao

2. **Unlock linh vật:**
   - Click tab "Linh vật"
   - Chọn linh vật chưa unlock (có nút "Mở khóa")
   - Click "Mở khóa"
   - ✅ Toast: "Đã mở khóa [Tên linh vật]!"
   - ✅ Stars giảm 50
   - ✅ Linh vật hiển thị cấp 1 (⭐)
   - ✅ Progress bar xuất hiện

### Bước 5: Test Nâng Cấp Linh Vật

**Prerequisites:** Đã unlock linh vật, có đủ sao

1. **Nâng cấp từ cấp 1 → 2:**
   - Cần 100 sao
   - Click "Nâng cấp"
   - ✅ Toast: "Đã nâng cấp [Tên linh vật]!"
   - ✅ Stars giảm 100
   - ✅ Linh vật hiển thị cấp 2 (⭐⭐)
   - ✅ Progress bar cập nhật

2. **Nâng cấp tiếp:**
   - Cấp 2 → 3: 200 sao
   - Cấp 3 → 4: 400 sao
   - Cấp 4 → 5: 800 sao

### Bước 6: Test Award Stars từ Bài Học

1. **Vào bài học:**
   - Chọn tuần, môn học
   - Làm bài tập

2. **Hoàn thành tuần:**
   - Làm đúng 100% → Nhận 5 ⭐
   - Làm đúng 80-99% → Nhận 3 ⭐
   - Làm đúng 60-79% → Nhận 2 ⭐
   - Làm đúng <60% → Nhận 1 ⭐

3. **Kiểm tra:**
   - ✅ Toast: "Nhận được X coins và Y ⭐!"
   - ✅ Stars tăng trong header AlbumPage

### Bước 7: Test Award Stars từ Challenge

1. **Vào Challenge:**
   - Xem daily challenges
   - Hoàn thành challenge

2. **Kiểm tra:**
   - ✅ Nhận stars theo `challenge.reward.stars`
   - ✅ Stars tăng trong header

### Bước 8: Test Progress Bar

1. **Unlock linh vật cấp 1:**
   - ✅ Progress bar hiển thị: "X/100 ⭐"

2. **Tích sao dần:**
   - ✅ Progress bar tăng dần
   - ✅ Khi đủ 100 sao → Nút "Nâng cấp" xuất hiện

3. **Nâng cấp:**
   - ✅ Progress bar reset: "X/200 ⭐" (cho cấp 3)

### Bước 9: Test Error Handling

1. **Không đủ sao:**
   - Click "Mở khóa" khi < 50 sao
   - ✅ Toast: "Not enough stars" hoặc tương tự

2. **Backend offline:**
   - Tắt backend
   - Thử unlock/upgrade
   - ✅ Fallback về localStorage
   - ✅ Toast: "(Demo mode)"

## 🐛 Known Issues / Notes

- **Emoji placeholder:** Hiện dùng emoji 🐉 và 🔒, sẽ thay bằng ảnh thật sau
- **Effect system:** Effect chưa được áp dụng vào gameplay (sẽ làm sau)
- **Active/Equip:** Chưa có UI để equip linh vật (sẽ làm sau)

## ✅ Success Criteria

Hệ thống hoạt động đúng nếu:
- ✅ 10 linh vật hiển thị trong AlbumPage
- ✅ Có thể unlock linh vật bằng 50 sao
- ✅ Có thể nâng cấp linh vật (100/200/400/800 sao)
- ✅ Stars được award từ bài học (1-5 sao)
- ✅ Stars được award từ challenge
- ✅ Progress bar hoạt động đúng
- ✅ Error handling hoạt động (fallback localStorage)

## 🎯 Next Steps (Future)

- [ ] Thêm ảnh cho linh vật (theo cấp độ)
- [ ] Implement effect system (bonus_points, bonus_xp, etc.)
- [ ] UI để equip/unequip linh vật
- [ ] Animation khi unlock/upgrade
- [ ] Detail modal để xem tất cả 5 cấp

