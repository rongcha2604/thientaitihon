# 📚 QUY ƯỚC ĐẶT TÊN FILE JSON - BỘ ĐỀ

## 🎯 TÓM TẮT NHANH

**Đường dẫn file:** `src/data/questions/{book-series}/grade-{grade}/{subject}/week-{week}.json`

**Ví dụ:**
- Lớp 1, Tiếng Việt, Tuần 1, Bộ sách "Kết nối tri thức"
  → `src/data/questions/ket-noi-tri-thuc/grade-1/vietnamese/week-1.json`

## 📋 BẢNG MAPPING

### 1. Bộ Sách → Folder Name

| Bộ Sách (UI) | Folder Name |
|--------------|-------------|
| Kết nối tri thức | `ket-noi-tri-thuc` |
| Chân trời sáng tạo | `chan-troi-sang-tao` |
| Phát triển năng lực | `cung-hoc` |
| Bình đẳng & Dân chủ | `vi-su-binh-dang` |

### 2. Môn Học → Folder Name

| Môn Học (UI) | Folder Name |
|--------------|-------------|
| Toán | `math` |
| Tiếng Việt | `vietnamese` |
| Tiếng Anh | `english` |

### 3. Lớp → Folder Name

| Lớp (UI) | Folder Name |
|----------|-------------|
| 1 | `grade-1` |
| 2 | `grade-2` |
| 3 | `grade-3` |
| 4 | `grade-4` |
| 5 | `grade-5` |

### 4. Tuần → File Name

| Tuần (UI) | File Name |
|-----------|-----------|
| 1 | `week-1.json` |
| 2 | `week-2.json` |
| ... | `week-{số}.json` |
| 35 | `week-35.json` |

## 🎯 QUY TẮC ĐẶT TÊN

1. **Bộ sách:** lowercase, kebab-case (dấu gạch ngang)
2. **Lớp:** `grade-{số}` (luôn có "grade-" prefix)
3. **Môn:** lowercase, tiếng Anh
4. **Tuần:** `week-{số}.json` (luôn có "week-" prefix và `.json` extension)

## ✅ CHECKLIST KHI TẠO FILE

1. ✅ Kiểm tra folder name đúng mapping
2. ✅ Đặt file đúng thư mục
3. ✅ Tên file: `week-{số}.json`
4. ✅ JSON format đúng
5. ✅ Field `week`, `subject`, `grade`, `bookSeries` đúng với đường dẫn

