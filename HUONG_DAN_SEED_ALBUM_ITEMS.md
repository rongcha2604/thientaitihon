# Hướng Dẫn Chi Tiết: Insert Album Items vào Database

## 📋 Mục đích
Insert 91 album items (characters, accessories, frames, stickers) vào bảng `album_items` trong database.

---

## 🎯 Bước 1: Mở pgAdmin và kết nối database

1. **Mở pgAdmin 4**
2. **Mở rộng Server:**
   - Click vào "Servers (1)" → "PostgreSQL 18"
3. **Mở rộng Database:**
   - Click vào "Databases (2)" → "luyen_tap_tieu_hoc"
4. **Mở Query Tool:**
   - Click **phải** vào database `luyen_tap_tieu_hoc`
   - Chọn **"Query Tool"** (hoặc Tools → Query Tool)

---

## 🎯 Bước 2: Mở file seed script

### Cách 1: Mở file trong pgAdmin (Khuyến nghị)

1. Trong Query Tool, click menu **"File"** → **"Open"**
2. Điều hướng đến thư mục:
   ```
   D:\HocTapLTHT\ThienTaiDatViet\backend\prisma\
   ```
3. Chọn file: **`seed-album-items.sql`**
4. Click **"Open"**
5. File SQL sẽ hiển thị trong Query Editor

### Cách 2: Copy từ file

1. Mở file bằng text editor:
   ```
   backend\prisma\seed-album-items.sql
   ```
2. **Select All** (Ctrl+A) → **Copy** (Ctrl+C)
3. Vào pgAdmin Query Tool → **Paste** (Ctrl+V)

---

## 🎯 Bước 3: Kiểm tra nội dung script

Script sẽ có dạng như sau:

```sql
-- SQL Insert Script - Import Album Items
-- Chạy script này trong PostgreSQL để import vật phẩm

INSERT INTO album_items (
  name, category, image, price, description, unlock_type, 
  unlock_condition, downloadable, image_file, download_file, is_active
) VALUES (
  'Trạng Tí', 'character', '🧒', 20, 'Nhân vật Trạng Tí thông minh', 'coins',
  NULL, FALSE, NULL, NULL, true
) ON CONFLICT DO NOTHING;

INSERT INTO album_items (
  name, category, image, price, description, unlock_type, 
  unlock_condition, downloadable, image_file, download_file, is_active
) VALUES (
  'Thằng Bờm', 'character', '👦', 20, 'Nhân vật Thằng Bờm vui vẻ', 'coins',
  NULL, FALSE, NULL, NULL, true
) ON CONFLICT DO NOTHING;

-- ... (tiếp tục với các items khác)
```

**Lưu ý:**
- Script có khoảng **81 INSERT statements** (91 items)
- Mỗi INSERT có `ON CONFLICT DO NOTHING` → An toàn, không bị lỗi nếu chạy lại
- `image_file` ban đầu là `NULL` → Sẽ update sau bằng script `update-album-images.sql`

---

## 🎯 Bước 4: Chạy script

### Cách 1: Execute toàn bộ script (Khuyến nghị)

1. **Đảm bảo toàn bộ script được chọn:**
   - Click vào Query Editor
   - **Select All** (Ctrl+A) - để chắc chắn chọn hết

2. **Execute script:**
   - Click nút **"Execute"** (▶️) trên toolbar
   - Hoặc nhấn phím **F5**
   - Hoặc menu: **Query** → **Execute**

3. **Đợi script chạy:**
   - Script sẽ chạy tất cả 81 INSERT statements
   - Thời gian: ~1-3 giây (tùy máy)

4. **Kiểm tra kết quả:**
   - Xem tab **"Messages"** ở dưới
   - Nếu thành công, sẽ thấy:
     ```
     INSERT 0 1
     INSERT 0 1
     ... (81 dòng)
     Query returned successfully in XXX ms.
     ```

### Cách 2: Execute từng phần (Nếu script quá dài)

1. **Chọn một phần script** (ví dụ: 10 INSERT đầu tiên)
2. **Execute** (F5)
3. **Lặp lại** cho các phần còn lại

---

## 🎯 Bước 5: Verify kết quả

Sau khi chạy xong, kiểm tra xem data đã được insert chưa:

### Query 1: Đếm tổng số items

```sql
SELECT COUNT(*) as total_items FROM album_items;
```

**Kết quả mong đợi:** `total_items = 91` (hoặc 81 nếu script có 81 INSERT)

### Query 2: Đếm theo category

```sql
SELECT 
    category,
    COUNT(*) as total
FROM album_items
GROUP BY category
ORDER BY category;
```

**Kết quả mong đợi:**
```
category    | total
------------|------
character   | 30
accessory   | 20
frame       | 20
sticker     | 21
```

### Query 3: Xem một vài items mẫu

```sql
SELECT 
    name,
    category,
    price,
    image_file
FROM album_items
ORDER BY category, name
LIMIT 10;
```

**Kết quả mong đợi:** Hiển thị 10 items đầu tiên, `image_file` sẽ là `NULL` (chưa update)

---

## ✅ Hoàn thành Bước 1

Nếu các query trên trả về đúng kết quả → **Bước 1 hoàn thành!**

**Bước tiếp theo:** Chạy script `update-album-images.sql` để update `image_file` cho tất cả items.

---

## 🚨 Xử lý lỗi (nếu có)

### Lỗi 1: "relation album_items does not exist"
**Nguyên nhân:** Bảng chưa được tạo  
**Giải pháp:** Chạy migration trước:
```bash
cd backend
npx prisma migrate dev
```

### Lỗi 2: "duplicate key value violates unique constraint"
**Nguyên nhân:** Data đã tồn tại  
**Giải pháp:** Không sao, script có `ON CONFLICT DO NOTHING` → Bỏ qua items đã có

### Lỗi 3: "syntax error"
**Nguyên nhân:** Script bị lỗi format  
**Giải pháp:** 
- Kiểm tra lại file `seed-album-items.sql`
- Đảm bảo encoding là UTF-8
- Kiểm tra dấu ngoặc đơn, dấu phẩy

### Lỗi 4: "connection timeout"
**Nguyên nhân:** Database không kết nối được  
**Giải pháp:**
- Kiểm tra PostgreSQL service đang chạy
- Kiểm tra connection string trong pgAdmin
- Thử reconnect database

---

## 📝 Checklist

- [ ] Mở pgAdmin và kết nối database `luyen_tap_tieu_hoc`
- [ ] Mở Query Tool
- [ ] Mở file `seed-album-items.sql`
- [ ] Copy toàn bộ nội dung vào Query Tool
- [ ] Execute script (F5)
- [ ] Kiểm tra Messages tab → Thấy "INSERT 0 1" (81 lần)
- [ ] Chạy query verify → `COUNT(*) = 91` (hoặc 81)
- [ ] Kiểm tra theo category → Đúng số lượng mỗi category

---

## 🎯 Bước tiếp theo

Sau khi hoàn thành Bước 1, chạy script `update-album-images.sql` để update `image_file` cho tất cả items.

