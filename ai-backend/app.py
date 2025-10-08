# -*- coding: utf-8 -*-
from flask import Flask, request, jsonify
from flask_cors import CORS
from sentence_transformers import SentenceTransformer
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import json
import re
import logging
from functools import wraps

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Constants
MAX_INPUT_LENGTH = 500
MIN_INPUT_LENGTH = 1

# Load pre-trained model for Vietnamese
try:
    model = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')
    logger.info("✅ Model loaded successfully")
except Exception as e:
    logger.error(f"❌ Failed to load model: {str(e)}")
    model = None

# Training data - Intents và responses (ENHANCED)
INTENTS = {
    "greeting": {
        "patterns": [
            "xin chào", "chào", "hello", "hi", "hey", "chào bạn", 
            "chào bot", "alo", "hế nhô", "hế lô", "good morning",
            "good afternoon", "good evening", "buổi sáng", "buổi chiều",
            "buổi tối", "chào buổi sáng", "chào buổi tối"
        ],
        "responses": [
            "Xin chào! 👋 Tôi là trợ lý AI của HomeLand. Tôi có thể giúp bạn tìm căn nhà hoàn hảo!",
            "Chào bạn! 😊 Rất vui được hỗ trợ bạn tìm nhà hôm nay!",
            "Hello! Tôi là AI Assistant, sẵn sàng giúp bạn tìm nhà mơ ước! 🏠",
            "Chào mừng bạn đến với HomeLand! Hãy cho tôi biết bạn đang tìm loại nhà nào nhé! 🏡"
        ]
    },
    "thanks": {
        "patterns": [
            "cảm ơn", "cám ơn", "thank", "thanks", "thank you", 
            "cảm ơn bạn", "cảm ơn nhiều", "thanks a lot", "thank you so much",
            "cảm ơn rất nhiều", "cảm ơn lắm", "thanks bro", "tks", "ty"
        ],
        "responses": [
            "Rất vui được giúp đỡ bạn! 😊 Nếu cần gì thêm, cứ hỏi tôi nhé!",
            "Không có gì! Tôi luôn sẵn sàng hỗ trợ bạn! 🤗",
            "Hân hạnh được phục vụ! Chúc bạn tìm được căn nhà ưng ý! ✨",
            "Không sao! Đó là nhiệm vụ của tôi mà! 💪"
        ]
    },
    "goodbye": {
        "patterns": [
            "tạm biệt", "bye", "goodbye", "see you", "hẹn gặp lại",
            "chào tạm biệt", "bye bye", "bái bai", "see ya", "catch you later",
            "tạm biệt nhé", "bye nha", "tạm biệt nha", "đi đây"
        ],
        "responses": [
            "Tạm biệt! Chúc bạn tìm được căn nhà ưng ý! 🏠✨",
            "Hẹn gặp lại bạn! Chúc một ngày tốt lành! 😊",
            "Bye bye! Quay lại bất cứ lúc nào bạn cần nhé! 👋",
            "Chúc bạn may mắn! Hẹn gặp lại! 🍀"
        ]
    },
    "help": {
        "patterns": [
            "giúp", "help", "hướng dẫn", "làm sao", "làm thế nào",
            "tôi cần giúp đỡ", "giúp tôi", "giúp đỡ", "bạn có thể làm gì",
            "bạn giúp được gì", "tính năng", "chức năng", "hỗ trợ",
            "what can you do", "how to use", "cách dùng"
        ],
        "responses": [
            "Tôi có thể giúp bạn tìm nhà theo:\n\n🏠 Loại nhà: Apartment, House, Villa\n📍 Vị trí: Canada, USA, Vietnam\n🛏️ Số phòng ngủ (1-5+)\n🛁 Số phòng tắm\n💰 Giá thuê (min-max)\n📐 Diện tích\n\nVí dụ:\n• 'Tôi muốn thuê apartment 2 phòng ngủ ở Canada dưới 50k'\n• 'Tìm house ở USA có 3 phòng ngủ'\n• 'Cần villa ở Vietnam giá từ 100k đến 200k'"
        ]
    },
    "rent_intent": {
        "patterns": [
            "tôi muốn thuê", "cần thuê", "tìm nhà", "tìm phòng",
            "muốn tìm", "đang tìm", "looking for", "need to rent",
            "want to rent", "cần tìm nhà", "cần tìm phòng", "tìm cho tôi",
            "có nhà nào", "có phòng nào", "show me", "tìm giúp tôi",
            "muốn xem", "xem nhà", "tìm kiếm", "search", "find",
            "có không", "có căn nào", "giới thiệu", "recommend"
        ],
        "responses": [
            "Tuyệt! Tôi sẽ giúp bạn tìm nhà. Bạn muốn tìm loại nhà nào? (Apartment, House, hay Villa?) 🏠",
            "Được rồi! Hãy cho tôi biết thêm chi tiết: loại nhà, vị trí, số phòng ngủ, giá... 🔍",
            "OK! Tôi sẵn sàng tìm kiếm cho bạn. Bạn có thể cho tôi biết thêm về yêu cầu không? 📝"
        ]
    },
    "price_inquiry": {
        "patterns": [
            "giá bao nhiêu", "giá", "price", "cost", "how much",
            "giá thuê", "chi phí", "mức giá", "giá cả", "bao nhiêu tiền",
            "giá khoảng", "trong khoảng giá", "budget", "ngân sách"
        ],
        "responses": [
            "Giá thuê nhà của chúng tôi dao động từ $20,000 đến $300,000/tháng tùy loại nhà và vị trí. Bạn có ngân sách bao nhiêu? 💰"
        ]
    },
    "location_inquiry": {
        "patterns": [
            "ở đâu", "vị trí", "location", "where", "khu vực nào",
            "quốc gia nào", "thành phố nào", "địa điểm", "nơi nào",
            "có ở", "có tại", "available in", "khu nào"
        ],
        "responses": [
            "Chúng tôi có nhà tại:\n🇨🇦 Canada\n🇺🇸 United States (USA)\n🇻🇳 Vietnam\n\nBạn muốn tìm nhà ở quốc gia nào? 🌍"
        ]
    },
    "bedrooms_inquiry": {
        "patterns": [
            "mấy phòng ngủ", "bao nhiêu phòng ngủ", "số phòng ngủ",
            "phòng ngủ", "bedroom", "bedrooms", "how many bedrooms",
            "có mấy phòng", "phòng", "rooms"
        ],
        "responses": [
            "Chúng tôi có nhà từ 1 đến 5+ phòng ngủ. Bạn cần bao nhiêu phòng ngủ? 🛏️"
        ]
    },
    "house_type_inquiry": {
        "patterns": [
            "loại nhà", "kiểu nhà", "type", "house type", "loại nào",
            "có loại gì", "apartment hay house", "villa hay apartment",
            "chung cư", "biệt thự", "nhà riêng", "căn hộ"
        ],
        "responses": [
            "Chúng tôi có 3 loại nhà:\n🏢 Apartment (Căn hộ/Chung cư)\n🏠 House (Nhà riêng)\n🏰 Villa (Biệt thự)\n\nBạn thích loại nào? 😊"
        ]
    },
    "positive_feedback": {
        "patterns": [
            "tốt", "hay", "đẹp", "ưng", "thích", "ok", "okay",
            "good", "great", "nice", "perfect", "excellent",
            "tuyệt", "tuyệt vời", "xuất sắc", "ổn", "được",
            "hợp", "phù hợp", "ưng ý"
        ],
        "responses": [
            "Tuyệt vời! 🎉 Bạn có muốn xem thêm thông tin chi tiết không?",
            "Rất vui vì bạn thích! 😊 Hãy click vào căn nhà để xem chi tiết nhé!",
            "Tốt quá! Bạn có thể đặt lịch xem nhà hoặc liên hệ với chúng tôi! 📞"
        ]
    },
    "negative_feedback": {
        "patterns": [
            "không", "không thích", "không ưng", "không phù hợp",
            "không hợp", "chưa ưng", "chưa hợp", "no", "not good",
            "bad", "tệ", "không được", "không ổn", "không hay"
        ],
        "responses": [
            "Không sao! Hãy cho tôi biết thêm về yêu cầu của bạn để tôi tìm căn phù hợp hơn nhé! 🔍",
            "Được rồi! Bạn muốn thay đổi điều gì? (Giá, vị trí, số phòng...) 🤔",
            "OK! Tôi sẽ tìm các lựa chọn khác cho bạn! 💪"
        ]
    },
    "name_introduction": {
        "patterns": [
            "tên tôi là", "tôi là", "my name is", "i am", "i'm",
            "mình là", "mình tên", "tên mình", "call me", "gọi tôi"
        ],
        "responses": []  # Will be handled specially
    }
}

# Pre-compute embeddings for patterns
pattern_embeddings = {}
try:
    if model:
        for intent, data in INTENTS.items():
            pattern_embeddings[intent] = model.encode(data["patterns"])
        logger.info("✅ Pattern embeddings computed successfully")
except Exception as e:
    logger.error(f"❌ Failed to compute embeddings: {str(e)}")

# Context storage (in-memory, should use Redis in production)
user_contexts = {}

def validate_input(user_input):
    """Validate user input"""
    if not user_input:
        return False, "Input không được để trống"
    
    if not isinstance(user_input, str):
        return False, "Input phải là chuỗi ký tự"
    
    user_input = user_input.strip()
    
    if len(user_input) < MIN_INPUT_LENGTH:
        return False, f"Input quá ngắn (tối thiểu {MIN_INPUT_LENGTH} ký tự)"
    
    if len(user_input) > MAX_INPUT_LENGTH:
        return False, f"Input quá dài (tối đa {MAX_INPUT_LENGTH} ký tự)"
    
    # Check for suspicious patterns (SQL injection, XSS, etc.)
    suspicious_patterns = [
        r'<script[^>]*>.*?</script>',
        r'javascript:',
        r'on\w+\s*=',
        r'DROP\s+TABLE',
        r'DELETE\s+FROM',
        r'INSERT\s+INTO',
        r'UPDATE\s+\w+\s+SET'
    ]
    
    for pattern in suspicious_patterns:
        if re.search(pattern, user_input, re.IGNORECASE):
            return False, "Input chứa nội dung không hợp lệ"
    
    return True, user_input.strip()

def detect_intent(user_input):
    """Detect user intent using semantic similarity"""
    try:
        if not model or not pattern_embeddings:
            logger.error("Model or embeddings not available")
            return None, 0
        
        user_embedding = model.encode([user_input])
        
        best_intent = None
        best_score = 0
        
        for intent, embeddings in pattern_embeddings.items():
            similarities = cosine_similarity(user_embedding, embeddings)
            max_similarity = np.max(similarities)
            
            if max_similarity > best_score:
                best_score = max_similarity
                best_intent = intent
        
        # Threshold for confidence
        if best_score > 0.5:
            return best_intent, best_score
        return None, 0
    
    except Exception as e:
        logger.error(f"Error in detect_intent: {str(e)}")
        return None, 0

def extract_entities(text):
    """Extract entities from text using enhanced regex and NLP"""
    try:
        entities = {
            "type": None,
            "country": None,
            "bedrooms": None,
            "bathrooms": None,
            "min_price": None,
            "max_price": None,
            "area": None
        }
    except Exception as e:
        logger.error(f"Error initializing entities: {str(e)}")
        return {}
    
    text_lower = text.lower()
    
    # Type detection (ENHANCED - more patterns)
    if re.search(r'apartment|căn hộ|chung cư|flat|condo|condominium', text_lower):
        entities["type"] = "Apartment"
    elif re.search(r'\bhouse\b|nhà\s+(?:riêng|phố|ở)|townhouse|nhà liền kề', text_lower):
        entities["type"] = "House"
    elif re.search(r'villa|biệt thự|mansion|penthouse', text_lower):
        entities["type"] = "Villa"
    
    # Country detection (ENHANCED - more variations)
    if re.search(r'canada|canadian|ca\b|toronto|vancouver|montreal', text_lower):
        entities["country"] = "Canada"
    elif re.search(r'\bmỹ\b|usa|us\b|united states|america|american|new york|california|texas', text_lower):
        entities["country"] = "United States"
    elif re.search(r'việt nam|vietnam|vn\b|vietnamese|hà nội|sài gòn|hcm|hanoi|saigon', text_lower):
        entities["country"] = "Vietnam"
    
    # Bedrooms (ENHANCED - more patterns)
    bed_patterns = [
        r'(\d+)\s*(?:phòng ngủ|pn|bedroom|bedrooms?|beds?|ngủ)',
        r'(?:có|with)\s*(\d+)\s*(?:phòng|room)',
        r'(\d+)br\b',  # 2br, 3br format
        r'(\d+)\s*(?:phòng|room)'
    ]
    for pattern in bed_patterns:
        bed_match = re.search(pattern, text_lower)
        if bed_match:
            entities["bedrooms"] = int(bed_match.group(1))
            break
    
    # Bathrooms (ENHANCED)
    bath_patterns = [
        r'(\d+)\s*(?:phòng tắm|wc|bathroom|bathrooms?|baths?|toilet)',
        r'(\d+)ba\b'  # 2ba format
    ]
    for pattern in bath_patterns:
        bath_match = re.search(pattern, text_lower)
        if bath_match:
            entities["bathrooms"] = int(bath_match.group(1))
            break
    
    # Price - Under/Below (ENHANCED - more formats)
    under_patterns = [
        r'(?:dưới|under|below|<|<=|max|tối đa)\s*(\d+(?:[,\.]\d+)?)\s*(?:k|triệu|tr|nghìn|ngàn|đô|dollar|\$)?',
        r'(?:không quá|ko quá|không vượt quá)\s*(\d+(?:[,\.]\d+)?)\s*(?:k|triệu|tr)?'
    ]
    for pattern in under_patterns:
        under_match = re.search(pattern, text_lower)
        if under_match:
            price = float(under_match.group(1).replace(',', '.'))
            # Smart price detection
            if 'k' in text_lower or 'nghìn' in text_lower or 'ngàn' in text_lower:
                price *= 1000
            elif 'triệu' in text_lower or 'tr' in text_lower:
                price *= 1000000
            elif price < 1000:  # If number is small, assume it's in thousands
                price *= 1000
            entities["max_price"] = int(price)
            break
    
    # Price - Over/Above (ENHANCED)
    over_patterns = [
        r'(?:trên|over|above|>|>=|min|tối thiểu|từ)\s*(\d+(?:[,\.]\d+)?)\s*(?:k|triệu|tr|nghìn|ngàn|đô|dollar|\$)?',
        r'(?:ít nhất|it nhất)\s*(\d+(?:[,\.]\d+)?)\s*(?:k|triệu|tr)?'
    ]
    for pattern in over_patterns:
        over_match = re.search(pattern, text_lower)
        if over_match:
            price = float(over_match.group(1).replace(',', '.'))
            if 'k' in text_lower or 'nghìn' in text_lower or 'ngàn' in text_lower:
                price *= 1000
            elif 'triệu' in text_lower or 'tr' in text_lower:
                price *= 1000000
            elif price < 1000:
                price *= 1000
            entities["min_price"] = int(price)
            break
    
    # Price range (ENHANCED)
    range_patterns = [
        r'(?:từ|from)\s*(\d+(?:[,\.]\d+)?)\s*(?:đến|to|-|~)\s*(\d+(?:[,\.]\d+)?)\s*(?:k|triệu|tr|nghìn|ngàn)?',
        r'(\d+(?:[,\.]\d+)?)\s*(?:đến|to|-|~)\s*(\d+(?:[,\.]\d+)?)\s*(?:k|triệu|tr)?'
    ]
    for pattern in range_patterns:
        range_match = re.search(pattern, text_lower)
        if range_match:
            min_p = float(range_match.group(1).replace(',', '.'))
            max_p = float(range_match.group(2).replace(',', '.'))
            if 'k' in text_lower or 'nghìn' in text_lower or 'ngàn' in text_lower:
                min_p *= 1000
                max_p *= 1000
            elif 'triệu' in text_lower or 'tr' in text_lower:
                min_p *= 1000000
                max_p *= 1000000
            elif min_p < 1000:
                min_p *= 1000
                max_p *= 1000
            entities["min_price"] = int(min_p)
            entities["max_price"] = int(max_p)
            break
    
    # Area
    try:
        area_match = re.search(r'(\d+)\s*(?:m2|m²|mét vuông|sq\s*ft|ft2|ft²)', text_lower)
        if area_match:
            area_value = int(area_match.group(1))
            # Validate area (reasonable range)
            if 10 <= area_value <= 10000:
                entities["area"] = area_value
    except (ValueError, AttributeError) as e:
        logger.warning(f"Error parsing area: {str(e)}")
    
    # Validate extracted values
    try:
        if entities.get("bedrooms") and (entities["bedrooms"] < 1 or entities["bedrooms"] > 20):
            entities["bedrooms"] = None
        
        if entities.get("bathrooms") and (entities["bathrooms"] < 1 or entities["bathrooms"] > 20):
            entities["bathrooms"] = None
        
        if entities.get("min_price") and entities["min_price"] < 0:
            entities["min_price"] = None
        
        if entities.get("max_price") and entities["max_price"] < 0:
            entities["max_price"] = None
        
        # Swap if min > max
        if entities.get("min_price") and entities.get("max_price"):
            if entities["min_price"] > entities["max_price"]:
                entities["min_price"], entities["max_price"] = entities["max_price"], entities["min_price"]
    except Exception as e:
        logger.warning(f"Error validating entities: {str(e)}")
    
    return entities

def generate_response(intent, entities, user_name=None):
    """Generate contextual response"""
    import random
    
    if intent in INTENTS:
        response = random.choice(INTENTS[intent]["responses"])
        if user_name:
            response = f"{user_name} ơi, {response}"
        return response
    
    # Context-aware response for search
    parts = []
    greeting = f"{user_name} ơi, " if user_name else ""
    
    if entities.get("type"):
        parts.append(f"Bạn đang tìm {entities['type']}")
    if entities.get("country"):
        parts.append(f"ở {entities['country']}")
    if entities.get("bedrooms"):
        parts.append(f"với {entities['bedrooms']} phòng ngủ")
    if entities.get("max_price"):
        parts.append(f"giá dưới ${entities['max_price']:,}")
    
    if parts:
        response = greeting + ". ".join(parts) + "."
    else:
        response = greeting + "Tôi đang lắng nghe yêu cầu của bạn."
    
    # Ask for missing info
    if not entities.get("type"):
        response += "\n\nBạn muốn tìm loại nhà nào? (Apartment, House, hay Villa?) 🏠"
    elif not entities.get("country"):
        response += "\n\nBạn muốn tìm ở quốc gia nào? (Canada, USA, Vietnam...) 🌍"
    
    return response

@app.route('/chat', methods=['POST'])
def chat():
    """Main chat endpoint"""
    try:
        # Check if model is loaded
        if not model:
            return jsonify({
                'error': 'AI model chưa được tải. Vui lòng thử lại sau.',
                'response': 'Xin lỗi, hệ thống AI đang gặp sự cố. Vui lòng thử lại sau! 🔧',
                'success': False
            }), 503
        
        # Get request data
        if not request.json:
            return jsonify({
                'error': 'Invalid request format',
                'response': 'Yêu cầu không hợp lệ. Vui lòng gửi dữ liệu JSON.',
                'success': False
            }), 400
        
        data = request.json
        user_input = data.get('message', '')
        user_id = data.get('user_id', 'default')
        
        # Validate input
        is_valid, result = validate_input(user_input)
        if not is_valid:
            return jsonify({
                'error': result,
                'response': f'❌ {result}. Vui lòng nhập lại tin nhắn hợp lệ.',
                'success': False,
                'intent': None,
                'confidence': 0,
                'entities': {},
                'context': {},
                'can_search': False
            }), 400
        
        user_input = result  # Use cleaned input
    
        # Detect user name
        name_match = re.search(r'tên\s+(?:tôi|mình|em)\s+là\s+(\w+)', user_input, re.IGNORECASE)
        user_name = None
        if name_match:
            user_name = name_match.group(1)
            if user_id not in user_contexts:
                user_contexts[user_id] = {}
            user_contexts[user_id]['name'] = user_name
        elif user_id in user_contexts and 'name' in user_contexts[user_id]:
            user_name = user_contexts[user_id]['name']
        
        # Detect intent
        intent, confidence = detect_intent(user_input)
        
        # Extract entities
        entities = extract_entities(user_input)
        
        # Update context
        if user_id not in user_contexts:
            user_contexts[user_id] = {}
        
        for key, value in entities.items():
            if value is not None:
                user_contexts[user_id][key] = value
        
        # Generate response
        response = generate_response(intent, user_contexts[user_id], user_name)
        
        # If no intent detected and no entities found, provide helpful response
        if not intent and not any(entities.values()):
            response = "Xin lỗi, tôi không hiểu yêu cầu của bạn. 🤔\n\nBạn có thể thử:\n• 'Tìm apartment 2 phòng ngủ ở Canada'\n• 'Cần thuê house ở USA giá dưới 50k'\n• Hoặc gõ 'help' để xem hướng dẫn"
        
        # Check if we have enough info to search
        context = user_contexts[user_id]
        can_search = context.get('type') and context.get('country')
        
        return jsonify({
            'response': response,
            'intent': intent,
            'confidence': float(confidence) if confidence else 0,
            'entities': entities,
            'context': context,
            'can_search': can_search,
            'success': True
        }), 200
    
    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}")
        return jsonify({
            'error': 'Internal server error',
            'response': 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại! 😔',
            'success': False,
            'intent': None,
            'confidence': 0,
            'entities': {},
            'context': {},
            'can_search': False
        }), 500

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    try:
        model_status = 'loaded' if model else 'not_loaded'
        embeddings_status = 'ready' if pattern_embeddings else 'not_ready'
        
        return jsonify({
            'status': 'ok' if model and pattern_embeddings else 'degraded',
            'model': 'paraphrase-multilingual-MiniLM-L12-v2',
            'model_status': model_status,
            'embeddings_status': embeddings_status,
            'active_contexts': len(user_contexts)
        }), 200
    except Exception as e:
        logger.error(f"Error in health check: {str(e)}")
        return jsonify({
            'status': 'error',
            'error': str(e)
        }), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'error': 'Endpoint not found',
        'message': 'API endpoint không tồn tại'
    }), 404

@app.errorhandler(405)
def method_not_allowed(error):
    return jsonify({
        'error': 'Method not allowed',
        'message': 'HTTP method không được hỗ trợ'
    }), 405

@app.errorhandler(500)
def internal_error(error):
    logger.error(f"Internal server error: {str(error)}")
    return jsonify({
        'error': 'Internal server error',
        'message': 'Lỗi hệ thống. Vui lòng thử lại sau'
    }), 500

if __name__ == '__main__':
    import sys
    import io
    # Fix Windows console encoding for emoji
    if sys.platform == 'win32':
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    
    print("🤖 AI Chatbot Backend is starting...")
    print("📦 Loading model: paraphrase-multilingual-MiniLM-L12-v2")
    print("✅ Server ready at http://localhost:5001")
    app.run(host='0.0.0.0', port=5001, debug=True)
