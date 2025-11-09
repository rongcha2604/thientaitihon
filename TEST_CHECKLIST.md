# ✅ TEST CHECKLIST - ThienTaiDatViet

**Ngày test:** 2025-11-05
**Backend:** ✅ Running (http://localhost:3001)
**Frontend:** ✅ Running (http://localhost:5173)

---

## 🔄 PHASE 3: INTEGRATION TESTING (FE ↔ BE ↔ DB)

### Test 1: Register Flow (Đăng ký)
**Manual Test Steps:**
1. [ ] Mở browser: http://localhost:5173
2. [ ] Click "Đăng ký" button
3. [ ] Fill form:
   - Email: `test@example.com`
   - Password: `test123`
   - Confirm Password: `test123`
   - Full Name: `Nguyễn Văn A`
   - Display Name: `Bé A`
   - Grade: `2`
   - Parent PIN: `1234` (optional)
4. [ ] Click "Đăng Ký" button
5. [ ] Verify:
   - [ ] Success message hoặc redirect to main page
   - [ ] User logged in automatically
   - [ ] Display name hiển thị trong header: "Cùng Bé A về làng chơi nhé!"
   - [ ] User data saved in database

**API Test:**
- [ ] POST /api/auth/register
- [ ] Status: 201 Created
- [ ] Response: `{ user, accessToken, refreshToken }`
- [ ] Verify user.created trong database
- [ ] Verify tokens valid

**Expected Result:** ✅ User registered successfully, auto-login, displayName hiển thị

---

### Test 2: Login Flow (Đăng nhập)
**Manual Test Steps:**
1. [ ] Logout (nếu đã login)
2. [ ] Fill login form:
   - Email: `test@example.com`
   - Password: `test123`
3. [ ] Click "Đăng Nhập" button
4. [ ] Verify:
   - [ ] Redirect to main page
   - [ ] User logged in
   - [ ] Display name hiển thị trong header
   - [ ] Tokens stored in localStorage

**API Test:**
- [ ] POST /api/auth/login
- [ ] Status: 200 OK
- [ ] Response: `{ user, accessToken, refreshToken }`
- [ ] Verify user.displayName trong response

**Expected Result:** ✅ User logged in successfully, displayName hiển thị

---

### Test 3: GetMe Flow (Lấy thông tin user)
**Manual Test Steps:**
1. [ ] Login vào hệ thống
2. [ ] Navigate to Hồ sơ page
3. [ ] Verify:
   - [ ] Display name hiển thị (nếu có)
   - [ ] Fallback: "Bạn nhỏ" (nếu không có displayName)
   - [ ] Grade hiển thị (nếu có)

**API Test:**
- [ ] GET /api/auth/me
- [ ] Status: 200 OK
- [ ] Response: `{ user: { id, email, fullName, displayName, grade, ... } }`
- [ ] Verify displayName trong response

**Expected Result:** ✅ User data returned correctly, displayName included

---

### Test 4: UpdateProfile Flow (Cập nhật tên hiển thị)
**Manual Test Steps:**
1. [ ] Login vào hệ thống
2. [ ] Navigate to Hồ sơ page
3. [ ] Click "Tùy chỉnh" button
4. [ ] Update display name: `Bé B`
5. [ ] Click "💾 Lưu" button
6. [ ] Verify:
   - [ ] Display name updated: "Bé B"
   - [ ] Success message hoặc UI update
   - [ ] Header updated: "Cùng Bé B về làng chơi nhé!"
   - [ ] Data saved in database

**API Test:**
- [ ] PATCH /api/auth/profile
- [ ] Body: `{ displayName: "Bé B" }`
- [ ] Status: 200 OK
- [ ] Response: `{ user: { displayName: "Bé B", ... } }`
- [ ] Verify user.displayName updated trong database

**Expected Result:** ✅ Display name updated successfully, sync across all layers

---

### Test 5: Data Consistency (Đồng bộ dữ liệu)
**Manual Test Steps:**
1. [ ] Register user với displayName: `Bé C`
2. [ ] Verify:
   - [ ] Frontend: displayName = "Bé C"
   - [ ] Backend response: displayName = "Bé C"
   - [ ] Database: displayName = "Bé C"
3. [ ] Update displayName: `Bé D`
4. [ ] Verify:
   - [ ] Frontend: displayName = "Bé D"
   - [ ] Backend response: displayName = "Bé D"
   - [ ] Database: displayName = "Bé D"

**Expected Result:** ✅ Data consistency: FE = BE = DB

---

## 📊 PHASE 5: DATA TESTING

### Test 6: Frontend Validation
**Manual Test Steps:**
1. [ ] Test password match validation:
   - [ ] Password: `test123`
   - [ ] Confirm Password: `test456`
   - [ ] Verify: Error message "Mật khẩu xác nhận không khớp"
2. [ ] Test password length validation:
   - [ ] Password: `test1`
   - [ ] Verify: Error message "Mật khẩu phải có ít nhất 6 ký tự"
3. [ ] Test PIN format validation:
   - [ ] Parent PIN: `123`
   - [ ] Verify: Error message "Mã PIN phụ huynh phải có 4 số"
4. [ ] Test display name length validation:
   - [ ] Display Name: 51+ characters
   - [ ] Verify: Error message hoặc maxLength enforced

**Expected Result:** ✅ All validations work correctly

---

### Test 7: Backend Validation
**API Test:**
1. [ ] Test invalid email:
   - [ ] POST /api/auth/register
   - [ ] Body: `{ email: "invalid-email", ... }`
   - [ ] Verify: Status 400, Error "Validation error"
2. [ ] Test password too short:
   - [ ] Body: `{ password: "123", ... }`
   - [ ] Verify: Status 400, Error "Validation error"
3. [ ] Test displayName too long:
   - [ ] Body: `{ displayName: "A".repeat(51), ... }`
   - [ ] Verify: Status 400, Error "Validation error"
4. [ ] Test grade out of range:
   - [ ] Body: `{ grade: 6, ... }`
   - [ ] Verify: Status 400, Error "Validation error"

**Expected Result:** ✅ All backend validations work correctly

---

### Test 8: Error Handling
**Manual Test Steps:**
1. [ ] Test network error:
   - [ ] Stop backend
   - [ ] Try register
   - [ ] Verify: Error message hiển thị (tiếng Việt)
2. [ ] Test duplicate email:
   - [ ] Register với email đã tồn tại
   - [ ] Verify: Error message "Email này đã được đăng ký"
3. [ ] Test invalid credentials:
   - [ ] Login với email/password sai
   - [ ] Verify: Error message "Đăng nhập thất bại"

**Expected Result:** ✅ Error handling works correctly, user-friendly messages

---

### Test 9: Edge Cases
**Manual Test Steps:**
1. [ ] Test empty displayName:
   - [ ] Register với displayName = ""
   - [ ] Verify: Fallback to "Bạn nhỏ" hoặc "bạn nhỏ"
2. [ ] Test null displayName:
   - [ ] Register không có displayName
   - [ ] Verify: Fallback to "Bạn nhỏ" hoặc "bạn nhỏ"
3. [ ] Test special characters:
   - [ ] Display Name: `Bé @#$%^&*()`
   - [ ] Verify: Accepted hoặc sanitized
4. [ ] Test long strings:
   - [ ] Full Name: 200+ characters
   - [ ] Verify: Accepted hoặc truncated

**Expected Result:** ✅ Edge cases handled gracefully

---

## 🎯 TEST SUMMARY

### ✅ Passed Tests:
- [x] Code Quality (compile, linter)
- [x] UI/UX Components
- [x] Backend Health Check

### ⏸️ Pending Tests (Cần test thủ công):
- [ ] Register Flow
- [ ] Login Flow
- [ ] GetMe Flow
- [ ] UpdateProfile Flow
- [ ] Data Consistency
- [ ] Frontend Validation
- [ ] Backend Validation
- [ ] Error Handling
- [ ] Edge Cases

### ❌ Missing Features:
- Skeleton Screens
- Error Boundaries
- Optimistic Updates
- Page Transitions

---

## 📝 TEST INSTRUCTIONS

### Cách Test:
1. **Mở browser:** http://localhost:5173
2. **Test Register:**
   - Click "Đăng ký"
   - Fill form với test data
   - Verify success
3. **Test Login:**
   - Logout
   - Login với credentials vừa tạo
   - Verify success
4. **Test DisplayName:**
   - Navigate to Hồ sơ
   - Click "Tùy chỉnh"
   - Update displayName
   - Verify sync across pages
5. **Test Error Handling:**
   - Test invalid data
   - Test network errors
   - Verify error messages

---

## 🐛 Troubleshooting

### Backend không chạy:
```powershell
cd backend
npm run dev
```

### Frontend không chạy:
```powershell
npm run dev
```

### Database connection error:
- Kiểm tra PostgreSQL đang chạy
- Kiểm tra .env file trong backend
- Kiểm tra DATABASE_URL

---

**🎯 Mục tiêu:** Test toàn diện để đảm bảo hệ thống hoạt động 100% trước khi bàn giao.

