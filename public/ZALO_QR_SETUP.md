# Hướng dẫn thêm mã QR Zalo

## Vị trí file
Đặt hình ảnh mã QR Zalo của bạn vào thư mục `public` với tên file: **`zalo-qr.jpg`** hoặc **`zalo-qr.png`**

## Đường dẫn đầy đủ
```
thientaitihon-main/public/zalo-qr.jpg
```
hoặc
```
thientaitihon-main/public/zalo-qr.png
```

## Yêu cầu hình ảnh
- **Định dạng**: JPG hoặc PNG (hỗ trợ cả hai)
- **Kích thước**: Tối thiểu 200x200px, khuyến nghị 400x400px hoặc lớn hơn
- **Tên file**: `zalo-qr.jpg` hoặc `zalo-qr.png` (chính xác, phân biệt chữ hoa/thường)
- **Ưu tiên**: Hệ thống sẽ tìm file JPG trước, nếu không có sẽ tìm PNG

## Cách thêm
1. Lấy mã QR Zalo của bạn (từ Zalo app hoặc website)
2. Lưu hình ảnh với tên `zalo-qr.jpg` hoặc `zalo-qr.png`
3. Copy file vào thư mục `public/` của dự án
4. Khởi động lại ứng dụng để xem thay đổi

## Kiểm tra
Sau khi thêm file, mã QR sẽ hiển thị tự động trong màn hình kích hoạt bản quyền.

## Lưu ý
- Nếu hình ảnh không hiển thị, kiểm tra:
  - Tên file có đúng `zalo-qr.jpg` hoặc `zalo-qr.png` không
  - File có nằm trong thư mục `public/` không
  - Đường dẫn trong code: `/zalo-qr.jpg` hoặc `/zalo-qr.png` (bắt đầu bằng `/`)

