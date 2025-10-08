# 🏡 HomeLand - Real Estate Platform

Modern real estate platform with AI-powered chatbot.

---

## 📁 Project Structure

```
real-estate-starter/
├── frontend/          # React frontend application
├── backend/           # Node.js + Express API
├── ai-backend/        # Python + Flask AI chatbot
└── README.md         # This file
```

---

## 🚀 Quick Start

### 1. Install Dependencies

**Install all at once:**
```bash
npm run install:all
```

**Or install individually:**
```bash
# Root (for concurrently)
npm install

# Frontend
cd frontend
npm install

# Backend
cd backend
npm install

# AI Backend
cd ai-backend
pip install -r requirements.txt
```

### 2. Run Services

**Option 1: Run All Services with 1 Command (Recommended):**
```bash
npm start
```
This will automatically start:
- ✅ Backend (port 5000)
- ✅ AI Backend (port 5001)
- ✅ Frontend (port 3000)

**Option 2: Run Individually:**
```bash
# Frontend only
npm run frontend

# Backend only
npm run backend

# AI Backend only
npm run ai-backend
```

**Option 3: Run in Separate Terminals:**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - AI Backend
cd ai-backend
python app.py

# Terminal 3 - Frontend
cd frontend
npm start
```

---

## 📊 Services

| Service | Port | URL | Documentation |
|---------|------|-----|---------------|
| React Frontend | 3000 | http://localhost:3000 | [frontend/README.md](frontend/README.md) |
| Node.js Backend | 5000 | http://localhost:5000 | [backend/README.md](backend/README.md) |
| Python AI Backend | 5001 | http://localhost:5001 | [ai-backend/README.md](ai-backend/README.md) |

---

## 🔑 Default Accounts

### Admin
- **URL:** `http://localhost:3000/admin/login`
- **Username:** `admin`
- **Password:** `123`

### User
- Register at: `http://localhost:3000/signup`

---

## ✨ Features

- 🏠 **Property Listings** - Browse houses, apartments, villas
- 🔍 **Advanced Search** - Filter by type, location, price
- ❤️ **Favorites System** - Save favorite properties
- 🤖 **AI Chatbot** - Intelligent assistant with NLP
- 👤 **User Authentication** - Login, signup, profile
- 👨‍💼 **Admin Dashboard** - Manage users, houses, bookings
- 📱 **Responsive Design** - Mobile-first UI
- 🎨 **Modern Animations** - Smooth transitions

---

## 🛠️ Tech Stack

### Frontend
- React 18.1.0
- Tailwind CSS 3.0.24
- Framer Motion 12.23.19
- Material-UI 7.3.2
- React Router 6.30.1

### Backend
- Node.js + Express
- MongoDB + Mongoose
- bcryptjs
- JWT (optional)

### AI Backend
- Python 3.8+
- Flask
- Sentence Transformers
- scikit-learn
- NumPy

---

## 📚 Documentation

- **[Frontend Documentation](frontend/README.md)** - React app, components, pages
- **[Backend Documentation](backend/README.md)** - API endpoints, models
- **[AI Backend Documentation](ai-backend/README.md)** - Chatbot, NLP, ML

---

## 🔧 Troubleshooting

### Port already in use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill
```

### MongoDB connection error
- Check `backend/.env` has correct `MONGO_URI`
- Ensure MongoDB Atlas allows your IP

### Python module not found
```bash
cd ai-backend
pip install -r requirements.txt
```

---

## 📄 License

MIT License

---

**Built with ❤️ using React, Node.js, MongoDB, and Python**