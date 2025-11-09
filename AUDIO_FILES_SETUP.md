# 🎵 Hướng Dẫn Setup File Audio MP3

## 📁 Cấu Trúc Thư Mục

Bạn cần copy 20 file MP3 vào thư mục `public/audio/`:

### 1. File Chúc Mừng (10 files)
**Thư mục:** `public/audio/`

**Tên file:**
- `correct-01.mp3`
- `correct-02.mp3`
- `correct-03.mp3`
- `correct-04.mp3`
- `correct-05.mp3`
- `correct-06.mp3`
- `correct-07.mp3`
- `correct-08.mp3`
- `correct-09.mp3`
- `correct-10.mp3`

### 2. File Động Viên (10 files)
**Thư mục:** `public/audio/`

**Tên file:**
- `wrong-01.mp3`
- `wrong-02.mp3`
- `wrong-03.mp3`
- `wrong-04.mp3`
- `wrong-05.mp3`
- `wrong-06.mp3`
- `wrong-07.mp3`
- `wrong-08.mp3`
- `wrong-09.mp3`
- `wrong-10.mp3`

## 🎯 Cách Hoạt Động

### Khi Bé Làm Đúng:
- ✅ Random chọn 1 trong 10 file chúc mừng
- ✅ Play file mp3 được chọn
- ✅ Nếu file không tồn tại → Fallback về synthetic sound

### Khi Bé Làm Sai:
- ❌ Random chọn 1 trong 10 file động viên
- ❌ Play file mp3 được chọn
- ❌ Nếu file không tồn tại → Fallback về synthetic sound

## 📝 Lưu Ý

### 1. Naming Convention:
- ✅ **ĐÚNG:** `correct-01.mp3` (zero-padded)
- ❌ **SAI:** `correct-1.mp3` (không có zero-padding)
- ✅ **ĐÚNG:** `wrong-01.mp3` (zero-padded)
- ❌ **SAI:** `wrong-1.mp3` (không có zero-padding)

### 2. File Location:
- ✅ **ĐÚNG:** `public/audio/correct-01.mp3`
- ❌ **SAI:** `src/audio/correct-01.mp3`
- ✅ **ĐÚNG:** `public/audio/wrong-01.mp3`
- ❌ **SAI:** `src/audio/wrong-01.mp3`

### 3. Format:
- ✅ File phải là MP3 format
- ✅ File phải có extension `.mp3`

## 🧪 Test

Sau khi copy files:

1. **Test trên browser:**
   - Làm đúng 1 câu → Check play random congratulation MP3
   - Làm sai 1 câu → Check play random encouragement MP3
   - Làm đúng nhiều câu → Check play different files (random)

2. **Test error handling:**
   - Xóa 1 file (ví dụ: `congratulation-05.mp3`)
   - Làm đúng → Check fallback về synthetic sound

3. **Rebuild APK (nếu cần):**
   ```powershell
   .\build-apk.ps1
   ```

## 📊 Cấu Trúc Thư Mục Hoàn Chỉnh

```
public/
├── audio/
│   ├── correct-01.mp3
│   ├── correct-02.mp3
│   ├── correct-03.mp3
│   ├── correct-04.mp3
│   ├── correct-05.mp3
│   ├── correct-06.mp3
│   ├── correct-07.mp3
│   ├── correct-08.mp3
│   ├── correct-09.mp3
│   ├── correct-10.mp3
│   ├── wrong-01.mp3
│   ├── wrong-02.mp3
│   ├── wrong-03.mp3
│   ├── wrong-04.mp3
│   ├── wrong-05.mp3
│   ├── wrong-06.mp3
│   ├── wrong-07.mp3
│   ├── wrong-08.mp3
│   ├── wrong-09.mp3
│   └── wrong-10.mp3
└── ...
```

## ✅ Checklist

- [ ] Tạo thư mục `public/audio/` (nếu chưa có)
- [ ] Copy 10 file chúc mừng vào `public/audio/` với tên `correct-01.mp3` đến `correct-10.mp3`
- [ ] Copy 10 file động viên vào `public/audio/` với tên `wrong-01.mp3` đến `wrong-10.mp3`
- [ ] Đảm bảo naming convention đúng (zero-padded: 01-10)
- [ ] Test trên browser
- [ ] Rebuild APK (nếu cần)

## 🎉 Hoàn Thành!

Sau khi copy tất cả files, hệ thống sẽ tự động:
- Random chọn 1 trong 10 file chúc mừng (`correct-01.mp3` đến `correct-10.mp3`) khi bé làm đúng
- Random chọn 1 trong 10 file động viên (`wrong-01.mp3` đến `wrong-10.mp3`) khi bé làm sai
- Fallback về synthetic sound nếu file không tồn tại

## 📝 Lưu Ý

**Tất cả 20 file phải đặt trong cùng 1 thư mục:** `public/audio/`

**Không cần subfolder:** Tất cả files đặt trực tiếp trong `public/audio/`

