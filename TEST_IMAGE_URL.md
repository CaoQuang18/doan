# Test Image URLs

## Mở các URL này trong browser để test:

1. **Test backend serve image:**
   ```
   http://localhost:5000/assets/img/houses/house1.png
   ```
   - Nếu thấy ảnh → Backend OK ✅
   - Nếu 404 → Backend chưa serve đúng ❌

2. **Test API response:**
   ```
   http://localhost:5000/api/houses
   ```
   - Check field `image` trong response
   - Phải là: `/assets/img/houses/house1.png` hoặc full URL

## Debug Steps:

### 1. Check backend console
Khi mở `http://localhost:5000/assets/img/houses/house1.png`, backend phải log:
```
GET /assets/img/houses/house1.png 200
```

### 2. Check frontend console
Mở F12 → Console, phải thấy:
```
🔄 Fetching houses from API...
✅ Received data: [...]
📊 Number of houses: 18
🖼️ Houses with images: [...]
```

### 3. Check Network tab
F12 → Network → Filter: Img
- Phải thấy requests đến: `http://localhost:5000/assets/img/houses/house1.png`
- Status phải là 200, không phải 404

## Quick Fix nếu vẫn lỗi:

### Option 1: Restart backend với log
```bash
cd backend
npm run dev
```

### Option 2: Check static path
Backend server.js line 31:
```javascript
app.use('/assets', express.static(path.join(__dirname, '../frontend/src/assets')));
```

Path phải đúng: `backend/../frontend/src/assets` = `frontend/src/assets`

### Option 3: Temporary fix - Copy assets to backend
```bash
# Windows PowerShell
xcopy /E /I frontend\src\assets backend\public\assets

# Then update server.js:
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));
```
