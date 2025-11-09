# 📚 QUY ƯỚC ĐẶT TÊN FILE JSON - BỘ ĐỀ

## 🎯 Cấu Trúc Thư Mục

```
src/data/questions/
├── {book-series}/
│   ├── grade-{grade}/
│   │   ├── {subject}/
│   │   │   ├── week-{week}.json
│   │   │   ├── week-{week}.json
│   │   │   └── ...
```

## 📋 Quy Ước Đặt Tên

### 1. Bộ Sách (Book Series)

**Tên thư mục:** lowercase, kebab-case (dấu gạch ngang)

| Bộ Sách (Tiếng Việt) | Tên Thư Mục (Folder) |
|----------------------|---------------------|
| Kết nối tri thức | `ket-noi-tri-thuc` |
| Chân trời sáng tạo | `chan-troi-sang-tao` |
| Phát triển năng lực | `cung-hoc` |
| Bình đẳng & Dân chủ | `vi-su-binh-dang` |

### 2. Lớp (Grade)

**Tên thư mục:** `grade-{số lớp}`

- Ví dụ: `grade-1`, `grade-2`, `grade-3`, `grade-4`, `grade-5`

### 3. Môn Học (Subject)

**Tên thư mục:** lowercase, tiếng Anh

| Môn Học (Tiếng Việt) | Tên Thư Mục (Folder) |
|---------------------|---------------------|
| Toán | `math` |
| Tiếng Việt | `vietnamese` |
| Tiếng Anh | `english` |

### 4. Tuần (Week)

**Tên file:** `week-{số tuần}.json`

- Ví dụ: `week-1.json`, `week-2.json`, `week-3.json`, ..., `week-35.json`
- Số tuần: 1-35 (35 tuần = 1 năm học)

## 📂 Ví Dụ Đường Dẫn Đầy Đủ

```
src/data/questions/
├── ket-noi-tri-thuc/          ← Bộ sách "Kết nối tri thức"
│   ├── grade-1/                ← Lớp 1
│   │   ├── math/               ← Môn Toán
│   │   │   ├── week-1.json
│   │   │   ├── week-2.json
│   │   │   └── ...
│   │   ├── vietnamese/         ← Môn Tiếng Việt
│   │   │   ├── week-1.json
│   │   │   ├── week-2.json
│   │   │   └── ...
│   │   └── english/            ← Môn Tiếng Anh
│   │       ├── week-1.json
│   │       └── ...
│   ├── grade-2/
│   │   └── ...
│   └── ...
├── chan-troi-sang-tao/         ← Bộ sách "Chân trời sáng tạo"
│   └── ...
├── cung-hoc/                   ← Bộ sách "Phát triển năng lực"
│   └── ...
└── vi-su-binh-dang/            ← Bộ sách "Bình đẳng & Dân chủ"
    └── ...
```

## 📄 Cấu Trúc File JSON

### Format Chuẩn:

```json
{
  "week": 1,
  "subject": "vietnamese",
  "grade": 1,
  "bookSeries": "ket-noi-tri-thuc",
  "lessons": [
    {
      "id": "lesson-1",
      "title": "Tên bài học",
      "duration": 5,
      "questions": [
        {
          "id": "q1",
          "type": "multiple-choice",
          "question": "Câu hỏi?",
          "options": [
            "Đáp án A",
            "Đáp án B",
            "Đáp án C",
            "Đáp án D"
          ],
          "correctAnswer": 0,
          "explanation": "Giải thích đáp án",
          "imageUrl": null
        }
      ]
    }
  ]
}
```

### Field Descriptions:

- **week**: Số tuần (1-35)
- **subject**: Môn học (`math`, `vietnamese`, `english`)
- **grade**: Lớp (1-5)
- **bookSeries**: Bộ sách (`ket-noi-tri-thuc`, `chan-troi-sang-tao`, `cung-hoc`, `vi-su-binh-dang`)
- **lessons**: Array các bài học
  - **id**: ID bài học (unique)
  - **title**: Tên bài học
  - **duration**: Thời gian (phút)
  - **questions**: Array câu hỏi
    - **id**: ID câu hỏi (unique)
    - **type**: Loại câu hỏi (`multiple-choice`, `true-false`, `fill-blank`, etc.)
    - **question**: Nội dung câu hỏi
    - **options**: Array đáp án (4 options cho multiple-choice)
    - **correctAnswer**: Index đáp án đúng (0-3)
    - **explanation**: Giải thích đáp án
    - **imageUrl**: URL hình ảnh (null nếu không có)

## 🎯 Ví Dụ File JSON

### Ví dụ: Tiếng Việt, Lớp 1, Tuần 1, Bộ sách "Kết nối tri thức"

**File path:** `src/data/questions/ket-noi-tri-thuc/grade-1/vietnamese/week-1.json`

```json
{
  "week": 1,
  "subject": "vietnamese",
  "grade": 1,
  "bookSeries": "ket-noi-tri-thuc",
  "lessons": [
    {
      "id": "lesson-1",
      "title": "Học chữ a",
      "duration": 5,
      "questions": [
        {
          "id": "q1",
          "type": "multiple-choice",
          "question": "Chữ nào sau đây là chữ 'a'?",
          "options": [
            "a",
            "b",
            "c",
            "d"
          ],
          "correctAnswer": 0,
          "explanation": "Chữ 'a' là chữ cái đầu tiên trong bảng chữ cái",
          "imageUrl": null
        }
      ]
    }
  ]
}
```

## ✅ Checklist Khi Tạo File Mới

- [ ] Đặt tên file đúng: `week-{số tuần}.json`
- [ ] Đặt đúng thư mục: `{book-series}/grade-{grade}/{subject}/`
- [ ] JSON format đúng (valid JSON)
- [ ] Field `week`, `subject`, `grade`, `bookSeries` đúng
- [ ] `correctAnswer` là index (0-3), không phải giá trị
- [ ] `explanation` có nội dung rõ ràng
- [ ] `imageUrl` là `null` hoặc URL hợp lệ

## 🔍 Kiểm Tra File

Để kiểm tra file JSON có đúng format không:

```bash
# Kiểm tra JSON syntax
node -e "JSON.parse(require('fs').readFileSync('src/data/questions/ket-noi-tri-thuc/grade-1/vietnamese/week-1.json', 'utf8'))"
```

## 📝 Notes

- **File encoding:** UTF-8
- **Indentation:** 2 spaces
- **Line endings:** LF (Unix) hoặc CRLF (Windows) đều được
- **Image URLs:** Nếu có hình ảnh, đặt trong `public/images/` và dùng đường dẫn `/images/...`
