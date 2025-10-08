# 🔐 Password Fix Guide

## ❌ Vấn đề

**Lỗi:** "Email hoặc mật khẩu không đúng" khi đăng nhập

**Nguyên nhân:** 
- Passwords trong MongoDB Cloud không được hash (lưu dạng plain text)
- Pre-save hook không chạy khi data được insert trực tiếp vào database
- Khi login, bcrypt.compare() so sánh plain text với plain text → fail

---

## 🔍 Phân tích

### User Model có pre-save hook:
```javascript
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
```

### Nhưng hook chỉ chạy khi:
- ✅ `User.create(data)` - Hook chạy
- ✅ `user.save()` - Hook chạy
- ❌ `User.insertMany(data)` - Hook KHÔNG chạy
- ❌ `User.updateOne()` - Hook KHÔNG chạy
- ❌ Insert trực tiếp vào MongoDB - Hook KHÔNG chạy

---

## ✅ Giải pháp

### Option 1: Fix passwords hiện tại (Recommended)

Script này sẽ hash tất cả passwords plain text trong database:

```bash
cd backend
node fixPasswords.js
```

**Script sẽ:**
1. Kết nối MongoDB
2. Tìm tất cả users
3. Check password đã hash chưa
4. Hash các password plain text
5. Update vào database
6. Test login

---

### Option 2: Reseed tất cả users (Clean slate)

Script này sẽ xóa và tạo lại tất cả users:

```bash
cd backend
node reseedAllUsers.js
```

**Script sẽ:**
1. Xóa TẤT CẢ users (bao gồm admin)
2. Tạo lại users với passwords đã hash
3. Test login

**⚠️ WARNING:** Sẽ mất hết data users hiện tại!

---

## 🧪 Testing

### 1. Chạy fix script
```bash
cd backend
node fixPasswords.js
```

### 2. Kiểm tra output
```
✅ MongoDB connected
📊 Found 4 users

👤 User: user@gmail.com
   Password: 123
   Is hashed: false
   ✅ Fixed! Hashed password: $2a$10$...
   📝 Plain password stored: 123

📊 Summary:
   ✅ Fixed: 4 users
   ⏭️  Skipped: 0 users
   📝 Total: 4 users

🧪 Testing login with: user@gmail.com
   Password: 123
   Match: ✅ SUCCESS

✅ Done!
```

### 3. Test login qua frontend
```
1. Mở http://localhost:3000/login
2. Email: user@gmail.com
3. Password: 123
4. Click "Đăng Nhập"
✅ Phải login thành công
```

---

## 📋 Login Credentials

### Admin
- **Email:** admin@example.com
- **Password:** 123
- **Username:** admin (for admin panel)

### Users
- **Email:** user@gmail.com | **Password:** 123
- **Email:** john@example.com | **Password:** 123
- **Email:** jane@example.com | **Password:** 123

---

## 🔧 Cách hoạt động

### Before (Lỗi)
```
Database: password = "123" (plain text)
Login: 
  - User nhập: "123"
  - bcrypt.compare("123", "123") 
  - ❌ FAIL (vì "123" không phải bcrypt hash)
```

### After (Đúng)
```
Database: password = "$2a$10$..." (hashed)
Login:
  - User nhập: "123"
  - bcrypt.compare("123", "$2a$10$...")
  - ✅ SUCCESS
```

---

## 🐛 Troubleshooting

### Lỗi: "Cannot connect to MongoDB"
```bash
# Check .env file
cat .env | grep MONGO_URI

# Should have:
MONGO_URI=mongodb+srv://...
```

### Lỗi: "User not found"
```bash
# Check database có users không
node -e "
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
mongoose.connect(process.env.MONGO_URI).then(async () => {
  const users = await User.find({});
  console.log('Users:', users.length);
  mongoose.connection.close();
});
"
```

### Password vẫn không đúng sau khi fix
```bash
# Reseed lại tất cả
node reseedAllUsers.js
```

---

## 📝 Prevention

### Để tránh vấn đề này trong tương lai:

1. **Luôn dùng `.create()` hoặc `.save()`**
   ```javascript
   // ✅ ĐÚNG
   await User.create({ username, email, password });
   
   // ✅ ĐÚNG
   const user = new User({ username, email, password });
   await user.save();
   
   // ❌ SAI - Hook không chạy
   await User.insertMany([{ username, email, password }]);
   ```

2. **Check password đã hash chưa**
   ```javascript
   const isHashed = password.startsWith('$2a$') || password.startsWith('$2b$');
   if (!isHashed) {
     console.warn('⚠️ Password not hashed!');
   }
   ```

3. **Test login sau khi seed**
   ```javascript
   const user = await User.findOne({ email: 'test@example.com' });
   const isMatch = await user.comparePassword('123');
   console.log('Login test:', isMatch ? '✅' : '❌');
   ```

---

## 🔐 Security Notes

### plainPassword field
```javascript
plainPassword: { type: String, default: "" }
```

**Mục đích:** Chỉ để admin xem password trong admin panel

**⚠️ Security Risk:**
- Không nên lưu plain password trong production
- Chỉ dùng cho development/testing
- Trong production, nên xóa field này

**Cách xóa plainPassword field:**
```javascript
// Remove from schema
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  // plainPassword: { type: String, default: "" }, // ❌ Remove this
  role: { type: String, enum: ["user", "admin"], default: "user" }
});

// Remove from all users
await User.updateMany({}, { $unset: { plainPassword: "" } });
```

---

## 📊 Scripts Summary

| Script | Purpose | Safe? | Use When |
|--------|---------|-------|----------|
| `fixPasswords.js` | Hash existing passwords | ✅ Yes | Passwords not hashed |
| `reseedAllUsers.js` | Delete & recreate all users | ⚠️ No | Clean slate needed |
| `seed/seedUsers.js` | Seed regular users only | ✅ Yes | Add sample users |
| `seed/seedAdmin.js` | Seed admin only | ✅ Yes | Create admin |

---

## ✅ Checklist

### Before running fix:
- [ ] Backup database (if important data)
- [ ] Check .env has correct MONGO_URI
- [ ] Backend server is stopped
- [ ] Node modules installed (`npm install`)

### After running fix:
- [ ] Check script output for errors
- [ ] Verify "Match: ✅ SUCCESS" in output
- [ ] Test login via frontend
- [ ] Test with all user accounts
- [ ] Check admin login works

---

## 🚀 Quick Fix (TL;DR)

```bash
# 1. Go to backend folder
cd backend

# 2. Run fix script
node fixPasswords.js

# 3. Check output for "✅ SUCCESS"

# 4. Test login
# Email: user@gmail.com
# Password: 123

# Done! 🎉
```

---

**Created:** October 2, 2025  
**Status:** Ready to use  
**Tested:** ✅ Yes
