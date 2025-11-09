# Hướng Dẫn Thay Đổi Thông Tin Tài Khoản Admin và Student

## Có 2 cách để thay đổi thông tin tài khoản:

---

## 📋 CÁCH 1: Thay đổi qua Seed (Nhanh - Development)

### Bước 1: Tạo/Update file `.env` trong thư mục `backend/`

Thêm các biến môi trường sau vào file `.env`:

```env
# Default Admin Account
DEFAULT_ADMIN_EMAIL=admin@example.com
DEFAULT_ADMIN_PASSWORD=admin123
DEFAULT_ADMIN_FULL_NAME=Admin User
DEFAULT_ADMIN_ROLE=super_admin

# Default Student Account
DEFAULT_STUDENT_EMAIL=student@example.com
DEFAULT_STUDENT_PASSWORD=student123
DEFAULT_STUDENT_FULL_NAME=Test Student
DEFAULT_STUDENT_GRADE=2
DEFAULT_STUDENT_PARENT_PIN=1234
```

### Bước 2: Chạy lại seed

```bash
cd backend
npx prisma db seed
```

**Lưu ý:**
- Seed sẽ **update** (không tạo mới) nếu email đã tồn tại
- Nếu email khác, sẽ tạo user mới
- Password sẽ được hash tự động

---

## 🔧 CÁCH 2: Thay đổi qua API (Production-ready)

### Update User (Student/Parent)

**Endpoint:** `PUT /api/admin/users/:id`

**Headers:**
```
Authorization: Bearer <admin_access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "newemail@example.com",        // Optional
  "fullName": "New Full Name",            // Optional
  "grade": 3,                              // Optional (1-5)
  "role": "student",                       // Optional: student, parent, admin
  "parentPin": "5678",                     // Optional (4 digits)
  "password": "newpassword123"             // Optional (min 6 characters)
}
```

**Example:**
```bash
curl -X PUT http://localhost:3001/api/admin/users/[USER_ID] \
  -H "Authorization: Bearer [ADMIN_TOKEN]" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newstudent@example.com",
    "password": "newpassword123",
    "fullName": "New Student Name"
  }'
```

### Update Admin User

**Endpoint:** `PUT /api/admin/admins/:id`

**Headers:**
```
Authorization: Bearer <admin_access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "newadmin@example.com",         // Optional
  "fullName": "New Admin Name",            // Optional
  "role": "super_admin",                    // Optional: admin, super_admin
  "password": "newadminpassword123"        // Optional (min 6 characters)
}
```

**Example:**
```bash
curl -X PUT http://localhost:3001/api/admin/admins/[ADMIN_ID] \
  -H "Authorization: Bearer [ADMIN_TOKEN]" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newadmin@example.com",
    "password": "newadminpassword123"
  }'
```

---

## 🔍 Cách lấy User ID và Admin ID

### Lấy danh sách Users:
```bash
GET /api/admin/users
```

### Lấy chi tiết User:
```bash
GET /api/admin/users/:id
```

Response sẽ có `id` của user để sử dụng trong update.

---

## 📝 Ví dụ cụ thể

### Ví dụ 1: Thay đổi password của student

1. **Tìm User ID:**
   ```bash
   GET /api/admin/users?search=student@example.com
   ```

2. **Update password:**
   ```bash
   PUT /api/admin/users/[USER_ID]
   {
     "password": "newpassword123"
   }
   ```

### Ví dụ 2: Thay đổi email và password của admin

1. **Tìm Admin ID:**
   - Login vào admin dashboard
   - Hoặc query database trực tiếp

2. **Update admin:**
   ```bash
   PUT /api/admin/admins/[ADMIN_ID]
   {
     "email": "newadmin@example.com",
     "password": "newadminpassword123"
   }
   ```

---

## ⚠️ Lưu ý

1. **Security:**
   - API endpoints yêu cầu authentication (Bearer token)
   - Chỉ admin mới có thể update users
   - Password sẽ được hash tự động trước khi lưu

2. **Validation:**
   - Email phải đúng format
   - Password tối thiểu 6 ký tự
   - Grade phải từ 1-5
   - Parent PIN phải đúng 4 số

3. **Seed vs API:**
   - **Seed:** Nhanh, dễ dàng, phù hợp development
   - **API:** Production-ready, an toàn, có audit logging

---

## 🎯 Khuyến nghị

- **Development:** Dùng CÁCH 1 (Seed) - Nhanh và đơn giản
- **Production:** Dùng CÁCH 2 (API) - An toàn và có audit logging

