# 🖼️ Hướng dẫn Fix ảnh nhà bị mất

## Vấn đề
Ảnh nhà không hiển thị vì backend trả về đường dẫn tương đối (`/assets/img/houses/house1.png`) nhưng frontend không biết server nào để load.

## Giải pháp đã implement

### 1. ✅ Backend serve static files
**File:** `backend/server.js`

```javascript
// Serve static files from frontend assets
const path = require('path');
app.use('/assets', express.static(path.join(__dirname, '../frontend/src/assets')));
```

**Cách hoạt động:**
- Backend (port 5000) sẽ serve các file từ `frontend/src/assets`
- URL: `http://localhost:5000/assets/img/houses/house1.png`

### 2. ✅ Frontend image helper utility
**File:** `frontend/src/utils/imageHelper.js`

**Functions:**
- `getImageUrl(imagePath)` - Convert relative path to full URL
- `processHouseImages(house)` - Fix image URLs cho 1 house
- `processHousesImages(houses)` - Fix image URLs cho array of houses

**Usage:**
```javascript
import { processHousesImages } from '../utils/imageHelper';

const data = await apiEndpoints.houses.getAll();
const housesWithImages = processHousesImages(data);
```

### 3. ✅ HouseContext updated
**File:** `frontend/src/components/HouseContext.js`

Tự động convert image URLs khi load data từ API.

---

## Cách test

### 1. Restart backend
```bash
cd backend
npm run dev
```

### 2. Restart frontend
```bash
cd frontend
npm start
```

### 3. Kiểm tra
- Mở browser: `http://localhost:3000`
- Ảnh nhà phải hiển thị
- Mở DevTools Network tab, check image requests
- URL phải là: `http://localhost:5000/assets/img/houses/house1.png`

---

## Troubleshooting

### Ảnh vẫn không hiển thị?

**1. Check backend console:**
```
Backend should log: GET /assets/img/houses/house1.png 200
```

**2. Check frontend console:**
```javascript
// In HouseContext.js, temporarily add:
console.log('Houses with images:', housesWithImages);
```

**3. Check image file exists:**
```bash
ls frontend/src/assets/img/houses/
```

**4. Check CORS:**
Backend đã có CORS enabled, nhưng nếu vẫn lỗi:
```javascript
// backend/server.js
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

### Lỗi 404 Not Found?

**Option A: Copy assets to backend**
```bash
# Windows
xcopy /E /I frontend\src\assets backend\public\assets

# Linux/Mac
cp -r frontend/src/assets backend/public/assets
```

Then update server.js:
```javascript
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));
```

**Option B: Use CDN or cloud storage**
Upload images to Cloudinary, AWS S3, etc. và update seed data.

---

## Alternative: Update seed data với full URLs

Nếu muốn backend lưu full URLs:

**1. Update seedHouses.js:**
```javascript
const BASE_URL = process.env.BASE_URL || "http://localhost:5000";

const housesData = [
  {
    image: `${BASE_URL}/assets/img/houses/house1.png`,
    imageLg: `${BASE_URL}/assets/img/houses/house1lg.png`,
    // ...
  }
];
```

**2. Re-seed database:**
```bash
cd backend
node seed/seedHouses.js
```

**3. Remove imageHelper from HouseContext** (không cần nữa)

---

## Production deployment

### Option 1: Serve from backend
```javascript
// backend/server.js
if (process.env.NODE_ENV === 'production') {
  app.use('/assets', express.static(path.join(__dirname, 'public/assets')));
}
```

### Option 2: Use CDN (Recommended)
1. Upload images to Cloudinary/S3
2. Update seed data với CDN URLs
3. No need for backend to serve static files

### Option 3: Frontend serve images
Build frontend và serve từ nginx/Apache, images sẽ được bundle.

---

## Summary

✅ **Current solution:**
- Backend serves static files from `frontend/src/assets`
- Frontend auto-converts relative URLs to full URLs
- Works for both development and production

✅ **Benefits:**
- No need to re-seed database
- Works with existing data
- Easy to switch to CDN later

✅ **Next steps:**
- Test thoroughly
- Consider moving to CDN for production
- Add image optimization (compression, lazy loading)
