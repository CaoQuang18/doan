# 🔐 Password Fix - Quick Guide

## ❌ Vấn đề
Login báo "Email hoặc mật khẩu không đúng" vì passwords trong MongoDB không được hash.

## ✅ Giải pháp nhanh

### Cách 1: Fix passwords hiện tại (Recommended)
```bash
cd backend
node fixPasswords.js
```

### Cách 2: Reseed tất cả users
```bash
cd backend
node reseedAllUsers.js
```
⚠️ **Warning:** Sẽ xóa tất cả users hiện tại!

## 🧪 Test

### Login credentials sau khi fix:
- **Email:** user@gmail.com
- **Password:** 123

### Admin:
- **Email:** admin@example.com  
- **Password:** 123

## 📚 Chi tiết

Xem **PASSWORD_FIX_GUIDE.md** để biết thêm chi tiết.

---

**Quick fix:** `node fixPasswords.js` → Done! ✅
