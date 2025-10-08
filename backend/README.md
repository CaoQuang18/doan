# Real Estate Backend API

## Setup

### 1. Cài đặt dependencies
```bash
cd backend
npm install
```

### 2. Cấu hình môi trường
File `.env` đã có sẵn với:
```
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=supersecretkey
DISABLE_JWT=true
```

### 3. Seed dữ liệu mẫu
```bash
# Tạo admin user (username: admin, password: 123)
npm run seed:admin

# Tạo houses mẫu
npm run seed:houses

# Hoặc chạy tất cả
npm run seed:all
```

### 4. Chạy server
```bash
# Development mode (nodemon)
npm run dev

# Production mode
npm start
```

Server sẽ chạy tại: `http://localhost:5000`

## API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Đăng ký user mới
  - Body: `{ username, email, password }`
  - Response: `{ message, user }`

- `POST /api/auth/login` - Đăng nhập user
  - Body: `{ email, password }`
  - Response: `{ message, user: { id, username, email, role } }`

- `POST /api/auth/admin-login` - Đăng nhập admin
  - Body: `{ username, password }`
  - Response: `{ message, isAdmin: true, user }`

### Users (`/api/users`)
- `GET /api/users` - Lấy danh sách users
- `GET /api/users/:id` - Lấy user theo ID
- `PUT /api/users/:id` - Cập nhật user
- `DELETE /api/users/:id` - Xóa user

### Houses (`/api/houses`)
- `GET /api/houses` - Lấy danh sách houses
- `GET /api/houses/:id` - Lấy house theo ID
- `POST /api/houses` - Tạo house mới
  - Body: `{ type, name, price, description, image, country, address, ... }`
- `PUT /api/houses/:id` - Cập nhật house
- `DELETE /api/houses/:id` - Xóa house
- `POST /api/houses/delete-multiple` - Xóa nhiều houses
  - Body: `{ ids: [id1, id2, ...] }`

### Bookings (`/api/bookings`)
- `GET /api/bookings` - Lấy danh sách bookings (populate user & house)
- `GET /api/bookings/:id` - Lấy booking theo ID
- `POST /api/bookings` - Tạo booking mới
  - Body: `{ user, house, startDate, endDate }`
- `PUT /api/bookings/:id` - Cập nhật booking
- `DELETE /api/bookings/:id` - Xóa booking

### Test
- `GET /` - Health check
- `GET /api/test` - Test API connection

## Models

### User
```javascript
{
  username: String (unique, required),
  email: String (unique, required),
  password: String (required, hashed),
  role: String (enum: ["user", "admin"], default: "user"),
  profilePicture: String,
  timestamps: true
}
```

### House
```javascript
{
  type: String (required), // "House" | "Apartament"
  name: String (required),
  description: String,
  image: String,
  imageLg: String,
  country: String,
  address: String,
  bedrooms: String,
  bathrooms: String,
  surface: String,
  year: String,
  price: Number (required),
  status: String (enum: ["Đang thuê", "Trả phòng"], default: "Trả phòng"),
  agent: {
    image: String,
    name: String,
    phone: String
  },
  owner: ObjectId (ref: "User"),
  timestamps: true
}
```

### Booking
```javascript
{
  user: ObjectId (ref: "User", required),
  house: ObjectId (ref: "House", required),
  startDate: Date (required),
  endDate: Date (required),
  status: String (enum: ["pending", "confirmed", "cancelled"], default: "pending"),
  timestamps: true
}
```

## Lưu ý
- Hiện tại chưa sử dụng JWT authentication (DISABLE_JWT=true)
- Password được hash tự động bằng bcryptjs pre-save hook
- CORS đã được enable cho tất cả origins
- Tất cả API đều trả JSON format
