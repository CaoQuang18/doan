# 🖼️ Complete Image Fix - Triệt để

## ✅ Đã fix

### 1. Backend CORS
**File:** `backend/server.js`
```javascript
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### 2. Backend Static Files
**File:** `backend/server.js`
```javascript
const path = require('path');
const assetsPath = path.join(__dirname, '../frontend/src/assets');
console.log('📁 Serving static files from:', assetsPath);

app.use('/assets', (req, res, next) => {
  console.log('🖼️ Asset request:', req.url);
  next();
});

app.use('/assets', express.static(assetsPath));
```

### 3. Frontend Image Helper
**File:** `frontend/src/utils/imageHelper.js`
- Converts `/assets/img/houses/house1.png` → `http://localhost:5000/assets/img/houses/house1.png`

### 4. HouseContext
**File:** `frontend/src/components/HouseContext.js`
- Auto-processes all houses with `processHousesImages()`

### 5. PropertyDetails
**File:** `frontend/src/pages/PropertyDetails.js`
- Uses `getImageUrl()` for image gallery

---

## 🔍 Debug Checklist

### Step 1: Check Backend
```bash
cd backend
npm run dev
```

**Expected output:**
```
📁 Serving static files from: C:\Users\...\frontend\src\assets
Server running on port 5000
```

### Step 2: Test Image URL Directly
Open browser:
```
http://localhost:5000/assets/img/houses/house1.png
```

**Expected:** See the house image
**If 404:** Path is wrong

### Step 3: Test API Response
Open browser:
```
http://localhost:5000/api/houses
```

**Check response:**
```json
[
  {
    "image": "/assets/img/houses/house1.png",
    "imageLg": "/assets/img/houses/house1lg.png"
  }
]
```

### Step 4: Check Frontend Console
Open F12 → Console

**Expected logs:**
```
🔄 Fetching houses from API...
✅ Received data: (18) [{…}, {…}, ...]
📊 Number of houses: 18
🖼️ Houses with images: (18) [{…}, {…}, ...]
```

**Check image URLs in houses:**
```javascript
// Should be full URLs like:
image: "http://localhost:5000/assets/img/houses/house1.png"
```

### Step 5: Check Network Tab
F12 → Network → Filter: Img

**Expected:**
- Requests to: `http://localhost:5000/assets/img/houses/house1.png`
- Status: **200 OK**
- Type: **png**

**If 404:**
- Backend not serving files correctly
- Check backend console for asset requests

---

## 🐛 Troubleshooting

### Problem 1: Images still show placeholder

**Cause:** Backend not serving static files

**Solution:**
1. Check backend console for asset requests
2. Verify path: `backend/../frontend/src/assets` exists
3. Restart backend

### Problem 2: CORS error

**Cause:** CORS not configured properly

**Solution:**
Already fixed in `backend/server.js`
Restart backend to apply changes

### Problem 3: 404 on image requests

**Cause:** Path mismatch

**Debug:**
```javascript
// In backend/server.js, add:
app.use('/assets', (req, res, next) => {
  console.log('🖼️ Requested:', req.url);
  console.log('📁 Serving from:', assetsPath);
  console.log('🔍 Full path:', path.join(assetsPath, req.url));
  next();
});
```

### Problem 4: Images work on some pages but not others

**Cause:** Some components not using imageHelper

**Solution:**
Check all components that display images:
- ✅ House.js - Uses `image` from processed houses
- ✅ PropertyDetails.js - Uses `getImageUrl()`
- ✅ ImageGallery.js - Receives processed URLs

---

## 🚀 Final Test

### 1. Restart Everything
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

### 2. Open Browser
```
http://localhost:3000
```

### 3. Check Homepage
- Should see house cards with images
- Not placeholders

### 4. Click on a House
- Should see image gallery
- Multiple images should work

### 5. Check Console
- No 404 errors
- No CORS errors
- All images loaded

---

## 📝 Summary

**Root Cause:**
Backend trả về đường dẫn tương đối (`/assets/img/houses/house1.png`) nhưng frontend không biết server nào để load.

**Solution:**
1. Backend serve static files từ `frontend/src/assets`
2. Frontend auto-convert relative paths → full URLs
3. CORS configured properly

**Files Changed:**
1. `backend/server.js` - CORS + static files
2. `frontend/src/utils/imageHelper.js` - NEW
3. `frontend/src/components/HouseContext.js` - Use imageHelper
4. `frontend/src/pages/PropertyDetails.js` - Use getImageUrl

**Status:** ✅ FIXED

Restart backend và frontend, ảnh sẽ hiển thị!
