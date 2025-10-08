# 🚀 Quick Start Guide

## Cách chạy dự án nhanh nhất

### Bước 1: Cài đặt dependencies

```bash
npm run install:all
```

Lệnh này sẽ tự động cài:
- ✅ Root dependencies (concurrently)
- ✅ Frontend dependencies (React, Tailwind, etc.)
- ✅ Backend dependencies (Express, Mongoose, etc.)

**Riêng AI Backend cần cài thủ công:**
```bash
cd ai-backend
pip install -r requirements.txt
cd ..
```

---

### Bước 2: Chạy tất cả services

```bash
npm start
```

**Lệnh này sẽ tự động chạy:**
1. ✅ Copy images từ `frontend/src/assets/img` → `frontend/public/assets/img`
2. ✅ Backend (Node.js) - `http://localhost:5000`
3. ✅ AI Backend (Python) - `http://localhost:5001`
4. ✅ Frontend (React) - `http://localhost:3000`

**Browser sẽ tự động mở:** `http://localhost:3000`

---

### Bước 3: Đăng nhập

**Admin:**
- URL: `http://localhost:3000/admin/login`
- Username: `admin`
- Password: `123`

**User:**
- Đăng ký tại: `http://localhost:3000/signup`

---

## 🛠️ Các lệnh khác

### Chạy từng service riêng:

```bash
# Chỉ Frontend
npm run frontend

# Chỉ Backend
npm run backend

# Chỉ AI Backend
npm run ai-backend
```

### Hoặc chạy trong terminal riêng:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - AI Backend:**
```bash
cd ai-backend
python app.py
```

**Terminal 3 - Frontend:**
```bash
cd frontend
npm start
```

---

## 🔧 Troubleshooting

### Lỗi: "npm: command not found"
- Cài Node.js từ: https://nodejs.org

### Lỗi: "python: command not found"
- Cài Python 3.8+ từ: https://python.org

### Lỗi: "Port already in use"
```bash
# Windows - Kill port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Kill port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Kill port 5001
netstat -ano | findstr :5001
taskkill /PID <PID> /F
```

### Lỗi: "Module not found"
```bash
# Cài lại dependencies
npm run install:all

# Hoặc cài từng cái
cd frontend && npm install
cd backend && npm install
cd ai-backend && pip install -r requirements.txt
```

### Lỗi: "MongoDB connection failed"
- Kiểm tra `backend/.env` có `MONGO_URI` đúng không
- Đảm bảo MongoDB Atlas cho phép IP của bạn

### Lỗi: "No houses displayed"
```bash
cd backend
npm run seed:houses
```

---

## 📝 Scripts có sẵn

| Script | Mô tả |
|--------|-------|
| `npm start` | Chạy tất cả services (Frontend + Backend + AI) |
| `npm run frontend` | Chỉ chạy React frontend |
| `npm run backend` | Chỉ chạy Node.js backend |
| `npm run ai-backend` | Chỉ chạy Python AI backend |
| `npm run install:all` | Cài tất cả dependencies |
| `npm run clean` | Xóa tất cả node_modules |

---

## ✅ Checklist

- [ ] Node.js 16+ đã cài
- [ ] Python 3.8+ đã cài
- [ ] Đã chạy `npm run install:all`
- [ ] Đã cài Python dependencies: `cd ai-backend && pip install -r requirements.txt`
- [ ] Đã chạy `npm start`
- [ ] Browser mở `http://localhost:3000`
- [ ] Backend chạy ở `http://localhost:5000`
- [ ] AI Backend chạy ở `http://localhost:5001`

---

**Nếu tất cả đều OK, bạn đã sẵn sàng sử dụng!** 🎉
