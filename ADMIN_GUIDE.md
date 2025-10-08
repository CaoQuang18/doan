# 🔐 Hướng dẫn quản lý Admin

## Đăng nhập Admin
- URL: `http://localhost:3000/admin/login`
- Tài khoản mặc định:
  - Username: `admin`
  - Password: `123`

## Quản lý Users & Admins trên trang Admin

### 1. Xem danh sách Users
- Truy cập: **Admin Panel** → **Users**
- Hiển thị tất cả users và admins
- Có thể lọc theo role (User/Admin)
- Xem được password của tất cả users

### 2. Thêm Admin mới
1. Vào trang **Users**
2. Click nút **"Thêm User/Admin"**
3. Điền thông tin:
   - Username
   - Email
   - Password (tối thiểu 6 ký tự)
   - **Role**: Chọn **Admin**
4. Click **"Thêm"**

### 3. Chuyển User thành Admin
1. Vào trang **Users**
2. Tìm user cần chuyển
3. Ở cột **Role**, click vào dropdown
4. Chọn **admin**
5. Hệ thống tự động cập nhật

### 4. Chuyển Admin thành User
- Tương tự như trên, chọn **user** trong dropdown Role

### 5. Xóa User/Admin
1. Vào trang **Users**
2. Click icon **🗑️ (Trash)** ở cột **Thao tác**
3. Xác nhận xóa

## Quản lý trên MongoDB Cloud (Atlas)

### Truy cập Database
1. Đăng nhập: https://cloud.mongodb.com
2. Chọn cluster của bạn
3. Click **"Browse Collections"**
4. Chọn database → collection **"users"**

### Chỉnh sửa Role trực tiếp
1. Tìm user cần chỉnh sửa
2. Click **"Edit Document"**
3. Sửa field `role`:
   - `"user"` → user thông thường
   - `"admin"` → admin
4. Click **"Update"**

### Tạo Admin mới trên MongoDB
1. Click **"Insert Document"**
2. Nhập:
```json
{
  "username": "admin2",
  "email": "admin2@example.com",
  "password": "123456",
  "role": "admin",
  "profilePicture": "",
  "address": "",
  "dateOfBirth": ""
}
```
3. Click **"Insert"**

## Đồng bộ với MongoDB Cloud 🔄

**TẤT CẢ thao tác trên trang admin đều tác động trực tiếp lên MongoDB Cloud:**

### ✅ Thêm User/Admin
- Tạo trên trang admin → **Lưu vào MongoDB Cloud ngay lập tức**
- Có thể kiểm tra trên MongoDB Atlas → Collection "users"

### ✅ Chỉnh sửa Role
- Chuyển user ↔ admin trên trang admin → **Cập nhật MongoDB Cloud ngay lập tức**
- Field `role` trong document sẽ thay đổi

### ✅ Xóa User/Admin
- Xóa trên trang admin → **XÓA VĨNH VIỄN khỏi MongoDB Cloud**
- Document sẽ bị xóa hoàn toàn, không thể khôi phục
- ⚠️ **Cẩn thận**: Không thể undo!

### Kiểm tra trên MongoDB Cloud
1. Đăng nhập https://cloud.mongodb.com
2. Browse Collections → database → collection "users"
3. Mọi thay đổi từ trang admin sẽ hiển thị ngay tại đây

## Lưu ý quan trọng ⚠️
- Password được lưu **plain text** (không mã hóa) để admin có thể xem
- **Không xóa admin cuối cùng** trong hệ thống
- Xóa user/admin là **vĩnh viễn**, không thể khôi phục
- Sau khi thay đổi trên MongoDB Cloud, refresh lại trang admin để thấy cập nhật
- Backend sẽ log chi tiết mọi thao tác thêm/sửa/xóa trong console

## API Endpoints
- `POST /api/auth/register` - Tạo user/admin mới (có thể chỉ định role)
- `PUT /api/users/:id` - Cập nhật thông tin user (bao gồm role)
- `DELETE /api/users/:id` - Xóa user
- `GET /api/users` - Lấy danh sách tất cả users
