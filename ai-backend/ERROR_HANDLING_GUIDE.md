# 🛡️ AI Backend Error Handling Guide

## Tổng quan các cải tiến

AI Backend đã được nâng cấp với hệ thống xử lý lỗi toàn diện để đảm bảo ứng dụng hoạt động ổn định và an toàn.

---

## ✅ Các tính năng Error Handling

### 1. **Input Validation** 
Kiểm tra và làm sạch dữ liệu đầu vào:

- ✅ Kiểm tra input rỗng
- ✅ Kiểm tra độ dài (min: 1, max: 500 ký tự)
- ✅ Kiểm tra kiểu dữ liệu (phải là string)
- ✅ Phát hiện SQL injection
- ✅ Phát hiện XSS attacks
- ✅ Phát hiện JavaScript injection
- ✅ Tự động trim whitespace

**Ví dụ lỗi:**
```json
{
  "error": "Input quá dài (tối đa 500 ký tự)",
  "response": "❌ Input quá dài (tối đa 500 ký tự). Vui lòng nhập lại tin nhắn hợp lệ.",
  "success": false
}
```

---

### 2. **Entity Validation**
Kiểm tra tính hợp lệ của các thông tin trích xuất:

- ✅ Số phòng ngủ: 1-20
- ✅ Số phòng tắm: 1-20
- ✅ Giá: không âm
- ✅ Diện tích: 10-10,000 m²
- ✅ Tự động swap min/max nếu sai thứ tự

**Ví dụ:**
```python
# Input: "Tìm nhà 100 phòng ngủ"
# Output: bedrooms = None (vượt quá giới hạn 20)
```

---

### 3. **Model Error Handling**
Xử lý lỗi khi model AI gặp sự cố:

- ✅ Kiểm tra model đã load chưa
- ✅ Try-catch khi encode text
- ✅ Fallback response khi model fail
- ✅ Logging chi tiết lỗi

**Response khi model fail:**
```json
{
  "error": "AI model chưa được tải. Vui lòng thử lại sau.",
  "response": "Xin lỗi, hệ thống AI đang gặp sự cố. Vui lòng thử lại sau! 🔧",
  "success": false
}
```

---

### 4. **HTTP Error Handlers**
Xử lý các lỗi HTTP phổ biến:

#### 400 - Bad Request
```json
{
  "error": "Invalid request format",
  "response": "Yêu cầu không hợp lệ. Vui lòng gửi dữ liệu JSON.",
  "success": false
}
```

#### 404 - Not Found
```json
{
  "error": "Endpoint not found",
  "message": "API endpoint không tồn tại"
}
```

#### 405 - Method Not Allowed
```json
{
  "error": "Method not allowed",
  "message": "HTTP method không được hỗ trợ"
}
```

#### 500 - Internal Server Error
```json
{
  "error": "Internal server error",
  "response": "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại! 😔",
  "success": false
}
```

#### 503 - Service Unavailable
```json
{
  "error": "AI model chưa được tải. Vui lòng thử lại sau.",
  "response": "Xin lỗi, hệ thống AI đang gặp sự cố. Vui lòng thử lại sau! 🔧",
  "success": false
}
```

---

### 5. **Helpful Fallback Responses**
Khi AI không hiểu input:

```json
{
  "response": "Xin lỗi, tôi không hiểu yêu cầu của bạn. 🤔\n\nBạn có thể thử:\n• 'Tìm apartment 2 phòng ngủ ở Canada'\n• 'Cần thuê house ở USA giá dưới 50k'\n• Hoặc gõ 'help' để xem hướng dẫn",
  "intent": null,
  "confidence": 0
}
```

---

### 6. **Enhanced Health Check**
Endpoint `/health` cung cấp thông tin chi tiết:

```json
{
  "status": "ok",
  "model": "paraphrase-multilingual-MiniLM-L12-v2",
  "model_status": "loaded",
  "embeddings_status": "ready",
  "active_contexts": 5
}
```

---

## 🧪 Testing

### Chạy test tự động:

```bash
# Bước 1: Start AI backend
cd ai-backend
python app.py

# Bước 2: Chạy test (terminal khác)
python test_error_handling.py
```

### Test cases bao gồm:

1. ✅ Input rỗng
2. ✅ Input quá dài (>500 ký tự)
3. ✅ XSS injection
4. ✅ SQL injection
5. ✅ Random gibberish
6. ✅ Special characters only
7. ✅ Numbers only
8. ✅ JavaScript injection
9. ✅ Valid short input
10. ✅ Valid Vietnamese query
11. ✅ Invalid JSON
12. ✅ Missing fields
13. ✅ Health check
14. ✅ Invalid endpoint (404)
15. ✅ Wrong HTTP method (405)

---

## 📊 Logging

Hệ thống logging chi tiết:

```python
# INFO level
logger.info("✅ Model loaded successfully")
logger.info("✅ Pattern embeddings computed successfully")

# ERROR level
logger.error("❌ Failed to load model: {error}")
logger.error("Model or embeddings not available")

# WARNING level
logger.warning("Error parsing area: {error}")
logger.warning("Error validating entities: {error}")
```

---

## 🔒 Security Features

### 1. Input Sanitization
Phát hiện và chặn các pattern nguy hiểm:

```python
suspicious_patterns = [
    r'<script[^>]*>.*?</script>',  # XSS
    r'javascript:',                 # JS injection
    r'on\w+\s*=',                   # Event handlers
    r'DROP\s+TABLE',                # SQL injection
    r'DELETE\s+FROM',               # SQL injection
    r'INSERT\s+INTO',               # SQL injection
    r'UPDATE\s+\w+\s+SET'          # SQL injection
]
```

### 2. Length Limits
```python
MAX_INPUT_LENGTH = 500  # Ngăn DoS attacks
MIN_INPUT_LENGTH = 1    # Đảm bảo có nội dung
```

### 3. Type Checking
```python
if not isinstance(user_input, str):
    return False, "Input phải là chuỗi ký tự"
```

---

## 📝 Response Format

### Success Response:
```json
{
  "response": "Xin chào! 👋 Tôi là trợ lý AI của HomeLand...",
  "intent": "greeting",
  "confidence": 0.95,
  "entities": {
    "type": null,
    "country": null,
    "bedrooms": null
  },
  "context": {},
  "can_search": false,
  "success": true
}
```

### Error Response:
```json
{
  "error": "Input không được để trống",
  "response": "❌ Input không được để trống. Vui lòng nhập lại tin nhắn hợp lệ.",
  "success": false,
  "intent": null,
  "confidence": 0,
  "entities": {},
  "context": {},
  "can_search": false
}
```

---

## 🚀 Best Practices

### 1. Always check `success` field
```javascript
const response = await fetch('/chat', {
  method: 'POST',
  body: JSON.stringify({ message: userInput })
});

const data = await response.json();

if (!data.success) {
  // Handle error
  console.error(data.error);
  showErrorMessage(data.response);
} else {
  // Process successful response
  displayMessage(data.response);
}
```

### 2. Handle HTTP status codes
```javascript
if (!response.ok) {
  if (response.status === 503) {
    // Service unavailable
    showMaintenanceMessage();
  } else if (response.status === 400) {
    // Bad request
    showValidationError();
  }
}
```

### 3. Implement retry logic
```javascript
async function chatWithRetry(message, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch('/chat', {
        method: 'POST',
        body: JSON.stringify({ message })
      });
      
      if (response.ok) {
        return await response.json();
      }
      
      if (response.status === 503 && i < maxRetries - 1) {
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        continue;
      }
      
      throw new Error(`HTTP ${response.status}`);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
    }
  }
}
```

---

## 🔍 Troubleshooting

### Model không load được:
```bash
# Check logs
✅ Model loaded successfully
# hoặc
❌ Failed to load model: [error details]

# Solution:
pip install --upgrade sentence-transformers torch
```

### Embeddings fail:
```bash
# Check logs
❌ Failed to compute embeddings: [error details]

# Solution:
# Restart server, model sẽ tự động reload
```

### Input validation fails:
```bash
# Check response
{
  "error": "Input chứa nội dung không hợp lệ"
}

# Solution:
# Đảm bảo input không chứa HTML/JS/SQL code
```

---

## 📚 API Documentation

### POST /chat
**Request:**
```json
{
  "message": "Tìm apartment 2 phòng ngủ",
  "user_id": "user123"
}
```

**Success Response (200):**
```json
{
  "response": "...",
  "intent": "rent_intent",
  "confidence": 0.85,
  "entities": {...},
  "context": {...},
  "can_search": true,
  "success": true
}
```

**Error Responses:**
- `400` - Bad Request (invalid input)
- `500` - Internal Server Error
- `503` - Service Unavailable (model not loaded)

### GET /health
**Response (200):**
```json
{
  "status": "ok",
  "model": "paraphrase-multilingual-MiniLM-L12-v2",
  "model_status": "loaded",
  "embeddings_status": "ready",
  "active_contexts": 5
}
```

---

## 🎯 Summary

✅ **Input validation** - Chặn input không hợp lệ  
✅ **Security** - Phát hiện injection attacks  
✅ **Error handling** - Xử lý mọi exception  
✅ **Logging** - Ghi log chi tiết  
✅ **HTTP errors** - Handler cho 404, 405, 500, 503  
✅ **Helpful responses** - Gợi ý khi không hiểu  
✅ **Health check** - Monitor system status  
✅ **Testing** - Comprehensive test suite  

---

**Tác giả:** AI Assistant  
**Ngày cập nhật:** 2025-10-05  
**Version:** 2.0
