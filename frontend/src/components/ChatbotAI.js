// Advanced AI Chatbot with NLP & Smart Features
import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { HouseContext } from "./HouseContext";
import { FaRobot, FaTimes, FaPaperPlane, FaMapMarkerAlt, FaDollarSign, FaBed, FaMicrophone, FaTrash, FaLightbulb, FaBath } from "react-icons/fa";
import { ImSpinner2 } from "react-icons/im";
import { useToast } from "./Toast";

// Format markdown text
const formatMarkdown = (text) => {
  if (!text) return '';
  
  // Replace **text** with <strong>text</strong>
  let formatted = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  
  // Replace *text* with <em>text</em>
  formatted = formatted.replace(/\*(.+?)\*/g, '<em>$1</em>');
  
  // Replace line breaks
  formatted = formatted.replace(/\n/g, '<br/>');
  
  return formatted;
};

// Advanced NLP Engine
class AdvancedNLP {
  constructor() {
    // Synonyms for better understanding
    this.synonyms = {
      rent: ['thuê', 'tìm', 'cần', 'muốn', 'đang tìm', 'looking for', 'rent', 'need', 'want', 'searching'],
      apartment: ['apartment', 'căn hộ', 'chung cư', 'flat', 'condo'],
      house: ['house', 'nhà', 'nhà riêng', 'townhouse'],
      villa: ['villa', 'biệt thự', 'mansion'],
      cheap: ['rẻ', 'giá tốt', 'affordable', 'cheap', 'budget'],
      expensive: ['đắt', 'cao cấp', 'luxury', 'expensive', 'premium'],
      big: ['lớn', 'rộng', 'spacious', 'big', 'large'],
      small: ['nhỏ', 'compact', 'small', 'cozy']
    };

    // Sentiment words
    this.positiveWords = ['tuyệt', 'tốt', 'đẹp', 'thích', 'great', 'good', 'nice', 'love', 'perfect', 'excellent'];
    this.negativeWords = ['tệ', 'xấu', 'không thích', 'bad', 'ugly', 'hate', 'terrible', 'awful'];
  }

  // Detect intent with confidence score
  detectIntent(text) {
    const lower = text.toLowerCase();
    const intents = [];

    if (this.matchAny(lower, this.synonyms.rent)) {
      intents.push({ intent: 'search_house', confidence: 0.9 });
    }
    if (lower.match(/giá|price|cost|budget|bao nhiêu/)) {
      intents.push({ intent: 'ask_price', confidence: 0.8 });
    }
    if (lower.match(/so sánh|compare|khác nhau|difference/)) {
      intents.push({ intent: 'compare', confidence: 0.85 });
    }
    if (lower.match(/gợi ý|suggest|recommend|tư vấn/)) {
      intents.push({ intent: 'recommend', confidence: 0.9 });
    }
    if (lower.match(/xem|show|hiển thị|list/)) {
      intents.push({ intent: 'show_houses', confidence: 0.85 });
    }

    return intents.length > 0 ? intents[0] : { intent: 'unknown', confidence: 0.5 };
  }

  // Match any synonym
  matchAny(text, synonymList) {
    return synonymList.some(word => text.includes(word));
  }

  // Extract entities (type, location, price, etc.)
  extractEntities(text) {
    const entities = {};
    const lower = text.toLowerCase();

    // Type
    if (this.matchAny(lower, this.synonyms.apartment)) entities.type = 'Apartment';
    else if (this.matchAny(lower, this.synonyms.house)) entities.type = 'House';
    else if (this.matchAny(lower, this.synonyms.villa)) entities.type = 'Villa';

    // Country
    if (lower.match(/canada|canadian/i)) entities.country = 'Canada';
    else if (lower.match(/mỹ|usa|us|united states|america|american/i)) entities.country = 'United States';
    else if (lower.match(/việt nam|vietnam|vn|vietnamese/i)) entities.country = 'Vietnam';

    // Bedrooms
    const bedMatch = lower.match(/(\d+)\s*(?:phòng ngủ|pn|bedroom|bedrooms?|beds?|ngủ)/i);
    if (bedMatch) entities.bedrooms = parseInt(bedMatch[1], 10);

    // Bathrooms
    const bathMatch = lower.match(/(\d+)\s*(?:phòng tắm|wc|bathroom|bathrooms?|baths?|toilet)/i);
    if (bathMatch) entities.bathrooms = parseInt(bathMatch[1], 10);

    // Area
    const areaMatch = lower.match(/(\d+)\s*(?:m2|m²|mét vuông|sq\s*ft|ft2|ft²)/i);
    if (areaMatch) entities.area = parseInt(areaMatch[1], 10);

    // Price - Advanced parsing
    const pricePatterns = [
      { regex: /(?:dưới|under|below|<|<=)\s*(\d+(?:[,.]\d+)?)\s*(?:k|triệu|tr|nghìn|ngàn)?/i, type: 'max' },
      { regex: /(?:trên|over|above|>|>=)\s*(\d+(?:[,.]\d+)?)\s*(?:k|triệu|tr|nghìn|ngàn)?/i, type: 'min' },
      { regex: /(?:từ|from)\s*(\d+(?:[,.]\d+)?)\s*(?:đến|to|-)\s*(\d+(?:[,.]\d+)?)\s*(?:k|triệu|tr)?/i, type: 'range' }
    ];

    for (const pattern of pricePatterns) {
      const match = lower.match(pattern.regex);
      if (match) {
        let price1 = parseFloat(match[1].replace(',', '.'));
        if (lower.match(/k|nghìn|ngàn/i)) price1 *= 1000;
        if (lower.match(/triệu|tr/i)) price1 *= 1000000;

        if (pattern.type === 'max') entities.maxPrice = Math.round(price1);
        else if (pattern.type === 'min') entities.minPrice = Math.round(price1);
        else if (pattern.type === 'range' && match[2]) {
          let price2 = parseFloat(match[2].replace(',', '.'));
          if (lower.match(/k|nghìn|ngàn/i)) price2 *= 1000;
          if (lower.match(/triệu|tr/i)) price2 *= 1000000;
          entities.minPrice = Math.round(price1);
          entities.maxPrice = Math.round(price2);
        }
        break;
      }
    }

    // Preferences
    if (this.matchAny(lower, this.synonyms.cheap)) entities.preference = 'cheap';
    if (this.matchAny(lower, this.synonyms.expensive)) entities.preference = 'expensive';
    if (this.matchAny(lower, this.synonyms.big)) entities.sizePreference = 'big';
    if (this.matchAny(lower, this.synonyms.small)) entities.sizePreference = 'small';

    return entities;
  }

  // Analyze sentiment
  analyzeSentiment(text) {
    const lower = text.toLowerCase();
    let score = 0;

    this.positiveWords.forEach(word => {
      if (lower.includes(word)) score += 1;
    });

    this.negativeWords.forEach(word => {
      if (lower.includes(word)) score -= 1;
    });

    if (score > 0) return 'positive';
    if (score < 0) return 'negative';
    return 'neutral';
  }

  // Extract user name
  extractName(text) {
    const nameMatch = text.match(/tên\s+(?:tôi|mình|em)\s+là\s+(\w+)/i) || 
                      text.match(/(?:tôi|mình|em)\s+là\s+(\w+)/i) ||
                      text.match(/call\s+me\s+(\w+)/i) ||
                      text.match(/my\s+name\s+is\s+(\w+)/i);
    return nameMatch ? nameMatch[1] : null;
  }
}

export default function ChatbotAI() {
  const navigate = useNavigate();
  const { houses } = useContext(HouseContext);
  const { toast } = useToast();
  
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      sender: "bot", 
      text: "Xin chào! 👋 Tôi là AI Assistant của HomeLand.\n\nTôi có thể giúp bạn:\n• 🏠 Tìm nhà phù hợp\n• 💰 So sánh giá\n• 🎯 Gợi ý thông minh\n• 📊 Phân tích thị trường\n\nHãy cho tôi biết bạn cần gì nhé!",
      timestamp: new Date(),
      suggestions: ['Tìm apartment', 'Gợi ý nhà đẹp', 'So sánh giá']
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [userName, setUserName] = useState("");
  const [isListening, setIsListening] = useState(false);
  const listRef = useRef(null);
  const nlp = useRef(new AdvancedNLP()).current;

  // Conversation context with history
  const [context, setContext] = useState({
    intent: null,
    type: null,
    country: null,
    bedrooms: null,
    bathrooms: null,
    area: null,
    minPrice: null,
    maxPrice: null,
    preference: null,
    sizePreference: null,
    conversationHistory: [],
    lastSearchResults: [],
    userSentiment: 'neutral'
  });

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("chatbot_ai_data");
    if (saved) {
      const data = JSON.parse(saved);
      setMessages(data.messages || messages);
      setContext(data.context || context);
      setUserName(data.userName || "");
    }
  }, []);

  // Auto scroll
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, isOpen, isTyping]);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("chatbot_ai_data", JSON.stringify({
      messages,
      context,
      userName
    }));
  }, [messages, context, userName]);

  // Smart house filtering with scoring
  const smartFilter = (houses, ctx) => {
    let results = houses.map(house => ({
      house,
      score: 0,
      reasons: []
    }));

    // Apply filters and calculate scores
    results.forEach(item => {
      const h = item.house;

      // Exact matches (high score)
      if (ctx.type && h.type === ctx.type) {
        item.score += 10;
        item.reasons.push(`Đúng loại ${ctx.type}`);
      }
      if (ctx.country && h.country === ctx.country) {
        item.score += 10;
        item.reasons.push(`Vị trí ${ctx.country}`);
      }
      if (ctx.bedrooms && parseInt(h.bedrooms) === ctx.bedrooms) {
        item.score += 8;
        item.reasons.push(`${ctx.bedrooms} phòng ngủ`);
      }
      if (ctx.bathrooms && parseInt(h.bathrooms) === ctx.bathrooms) {
        item.score += 5;
        item.reasons.push(`${ctx.bathrooms} phòng tắm`);
      }

      // Price range
      const price = parseInt(h.price);
      if (ctx.maxPrice && price <= ctx.maxPrice) {
        item.score += 7;
        item.reasons.push('Trong tầm giá');
      }
      if (ctx.minPrice && price >= ctx.minPrice) {
        item.score += 5;
      }

      // Preferences
      if (ctx.preference === 'cheap' && price < 50000) {
        item.score += 5;
        item.reasons.push('Giá tốt');
      }
      if (ctx.preference === 'expensive' && price > 100000) {
        item.score += 5;
        item.reasons.push('Cao cấp');
      }

      // Size preferences
      const area = parseInt(h.surface);
      if (ctx.sizePreference === 'big' && area > 200) {
        item.score += 5;
        item.reasons.push('Diện tích rộng');
      }
      if (ctx.sizePreference === 'small' && area < 100) {
        item.score += 5;
        item.reasons.push('Nhỏ gọn');
      }
    });

    // Filter out zero scores and sort
    return results
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score);
  };

  // Generate smart response
  const generateSmartResponse = (userInput, ctx, intent) => {
    const greeting = userName ? `${userName}, ` : "";
    const sentiment = nlp.analyzeSentiment(userInput);
    
    // Update sentiment in context
    setContext(prev => ({ ...prev, userSentiment: sentiment }));

    // Greetings
    if (userInput.match(/^(xin chào|chào|hello|hi|hey)/i)) {
      return {
        text: `${greeting}Chào bạn! 😊 Tôi rất vui được hỗ trợ bạn tìm nhà. Bạn muốn tìm loại nhà nào?`,
        suggestions: ['Apartment 2 phòng', 'Villa cao cấp', 'Nhà giá rẻ']
      };
    }

    // Thanks
    if (userInput.match(/cảm ơn|thank|thanks/i)) {
      return {
        text: "Rất vui được giúp đỡ! 🎉 Nếu cần gì thêm, cứ hỏi tôi nhé!",
        suggestions: ['Tìm nhà khác', 'So sánh giá', 'Gợi ý tốt nhất']
      };
    }

    // Help
    if (userInput.match(/giúp|help|hướng dẫn/i)) {
      return {
        text: "Tôi có thể giúp bạn:\n\n🏠 **Tìm nhà**: Cho tôi biết loại nhà, vị trí, giá...\n💡 **Gợi ý**: Tôi sẽ đề xuất nhà phù hợp nhất\n📊 **So sánh**: So sánh các lựa chọn\n🎯 **Phân tích**: Đánh giá ưu nhược điểm\n\nVí dụ: 'Tìm apartment 2 phòng ở Canada dưới 50k'",
        suggestions: ['Gợi ý nhà đẹp', 'Nhà giá tốt', 'So sánh']
      };
    }

    // Recommend intent
    if (intent.intent === 'recommend') {
      return {
        text: `${greeting}Để gợi ý chính xác nhất, cho tôi biết:\n• Ngân sách của bạn?\n• Vị trí ưa thích?\n• Số phòng ngủ cần?`,
        suggestions: ['Dưới 50k', 'Canada', '2-3 phòng']
      };
    }

    // Build context-aware response
    let response = "";
    const missing = [];

    if (ctx.type) response += `✓ Loại: ${ctx.type}\n`;
    else missing.push("loại nhà");

    if (ctx.country) response += `✓ Vị trí: ${ctx.country}\n`;
    else missing.push("vị trí");

    if (ctx.bedrooms) response += `✓ Phòng ngủ: ${ctx.bedrooms}\n`;
    if (ctx.maxPrice) response += `✓ Giá tối đa: $${ctx.maxPrice.toLocaleString()}\n`;

    if (missing.length > 0) {
      return {
        text: response + `\n🤔 Tôi cần thêm thông tin về: **${missing.join(", ")}**\n\nBạn có thể cho tôi biết không?`,
        suggestions: missing.map(m => {
          if (m === "loại nhà") return "Apartment";
          if (m === "vị trí") return "Canada";
          return "Thêm info";
        })
      };
    }

    return {
      text: response + "\n✅ Đã đủ thông tin! Đang tìm kiếm...",
      suggestions: []
    };
  };

  // Handle send message
  const handleSend = async () => {
    const q = input.trim();
    if (!q) return;

    // Add user message
    setMessages(prev => [...prev, { 
      sender: "user", 
      text: q,
      timestamp: new Date()
    }]);
    setInput("");
    setIsTyping(true);

    // Extract name
    const name = nlp.extractName(q);
    if (name && !userName) {
      setUserName(name);
      toast.success(`Rất vui được gặp bạn, ${name}! 👋`);
    }

    // Detect intent
    const intent = nlp.detectIntent(q);
    
    // Extract entities
    const entities = nlp.extractEntities(q);
    
    // Update context
    const newContext = {
      ...context,
      ...entities,
      intent: intent.intent,
      conversationHistory: [...context.conversationHistory, { query: q, entities, intent }]
    };
    setContext(newContext);

    // Simulate AI thinking
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if we can search
    const canSearch = newContext.type && newContext.country;

    if (canSearch) {
      const results = smartFilter(houses, newContext);
      
      if (results.length > 0) {
        const top5 = results.slice(0, 5);
        setMessages(prev => [...prev, {
          sender: "bot",
          text: `🎉 Tuyệt! Tôi tìm thấy **${results.length} căn nhà** phù hợp!\n\nĐây là **${top5.length} lựa chọn tốt nhất** cho bạn:`,
          houses: top5.map(r => ({ ...r.house, matchReasons: r.reasons })),
          timestamp: new Date(),
          suggestions: ['Xem thêm', 'So sánh', 'Lọc lại']
        }]);
        
        setContext(prev => ({ ...prev, lastSearchResults: results }));
      } else {
        setMessages(prev => [...prev, {
          sender: "bot",
          text: "😔 Xin lỗi, tôi chưa tìm thấy nhà phù hợp.\n\n💡 Gợi ý:\n• Mở rộng khoảng giá\n• Thử vị trí khác\n• Giảm yêu cầu",
          timestamp: new Date(),
          suggestions: ['Mở rộng giá', 'Thử vị trí khác', 'Gợi ý khác']
        }]);
      }
    } else {
      const response = generateSmartResponse(q, newContext, intent);
      setMessages(prev => [...prev, {
        sender: "bot",
        text: response.text,
        timestamp: new Date(),
        suggestions: response.suggestions
      }]);
    }

    setIsTyping(false);
  };

  // Clear chat
  const handleClearChat = () => {
    if (window.confirm('Xóa toàn bộ lịch sử chat?')) {
      setMessages([{
        sender: "bot",
        text: "Chat đã được xóa. Bắt đầu lại nhé! 👋",
        timestamp: new Date()
      }]);
      setContext({
        intent: null,
        type: null,
        country: null,
        bedrooms: null,
        bathrooms: null,
        area: null,
        minPrice: null,
        maxPrice: null,
        preference: null,
        sizePreference: null,
        conversationHistory: [],
        lastSearchResults: [],
        userSentiment: 'neutral'
      });
      toast.success('Đã xóa lịch sử chat');
    }
  };

  // Voice input (Web Speech API)
  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      toast.error('Trình duyệt không hỗ trợ voice input');
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'vi-VN';
    recognition.continuous = false;

    recognition.onstart = () => {
      setIsListening(true);
      toast.info('Đang nghe... 🎤');
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
      toast.error('Lỗi voice input');
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleCardClick = (house) => {
    setIsOpen(false);
    const houseId = house._id || house.id;
    navigate(`/property/${houseId}`);
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{ zIndex: 9999 }}
        className="fixed bottom-5 right-5 bg-gradient-to-r from-violet-600 to-purple-600 
                   text-white rounded-full w-14 h-14 flex items-center justify-center 
                   shadow-2xl hover:scale-110 transition-transform
                   animate-bounce hover:animate-none group"
      >
        <FaRobot className="text-2xl group-hover:rotate-12 transition-transform" />
        {messages.length > 1 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold 
                         rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            {messages.length - 1}
          </span>
        )}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div 
          style={{ zIndex: 9999 }}
          className="fixed bottom-20 right-5 w-[340px] h-[480px] 
                     bg-white dark:bg-gray-800
                     border border-gray-200 dark:border-gray-700
                     rounded-2xl shadow-2xl flex flex-col overflow-hidden
                     animate-[slideUp_0.3s_ease-out]">

          {/* Header */}
          <div className="bg-gradient-to-r from-violet-600 to-purple-600 text-white p-2.5 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <FaRobot className="text-lg" />
              </div>
              <div>
                <h3 className="font-bold text-sm">AI {userName && userName}</h3>
                <p className="text-[9px] text-white/80 flex items-center gap-1">
                  <span className="w-1 h-1 bg-green-400 rounded-full"></span>
                  Online
                </p>
              </div>
            </div>
            <div className="flex gap-1">
              <button 
                onClick={handleClearChat}
                className="hover:bg-white/20 p-1.5 rounded-full transition"
                title="Xóa chat"
              >
                <FaTrash className="text-sm" />
              </button>
              <button 
                onClick={() => setIsOpen(false)} 
                className="hover:bg-white/20 p-1.5 rounded-full transition"
              >
                <FaTimes className="text-base" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div ref={listRef} className="flex-1 overflow-y-auto p-2.5 space-y-2.5 bg-gray-50 dark:bg-gray-900">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} 
                                      animate-[fadeIn_0.3s_ease-out]`}>
                {msg.sender === "bot" && (
                  <div className="w-7 h-7 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full 
                                flex items-center justify-center mr-1.5 flex-shrink-0">
                    <FaRobot className="text-white text-xs" />
                  </div>
                )}

                <div className={msg.sender === "user" ? "text-right" : "text-left max-w-[85%]"}>
                  <div
                    className={`inline-block px-3 py-2 rounded-xl break-words shadow-sm
                      ${msg.sender === "user" 
                        ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-br-none max-w-[220px]" 
                        : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none border border-gray-200 dark:border-gray-600"}`}
                  >
                    <div 
                      className="text-xs leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: formatMarkdown(msg.text) }}
                    />
                  </div>

                  {/* Timestamp */}
                  <p className="text-[9px] text-gray-400 dark:text-gray-500 mt-0.5 px-1">
                    {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString('vi-VN', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    }) : ''}
                  </p>

                  {/* Suggestions */}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {msg.suggestions.map((sug, idx) => (
                        <button
                          key={idx}
                          onClick={() => setInput(sug)}
                          className="px-2 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 
                                   rounded-full text-[10px] hover:bg-violet-200 dark:hover:bg-violet-900/50 transition flex items-center gap-1"
                        >
                          <FaLightbulb className="text-[8px]" />
                          {sug}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* House cards */}
                  {msg.houses && msg.houses.length > 0 && (
                    <div className="mt-2 space-y-1.5">
                      {msg.houses.map((h, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleCardClick(h)}
                          className="flex gap-2 p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg 
                                   cursor-pointer hover:shadow-md hover:border-violet-400 dark:hover:border-violet-500 
                                   transition-all group"
                        >
                          <img 
                            src={h.image} 
                            alt={h.name} 
                            className="w-20 h-16 object-cover rounded group-hover:scale-105 transition-transform" 
                          />
                          <div className="flex-1 text-xs">
                            <div className="font-bold text-gray-800 dark:text-gray-200 line-clamp-1 group-hover:text-violet-600 dark:group-hover:text-violet-400 text-[11px]">
                              {h.name}
                            </div>
                            <div className="flex items-center gap-0.5 text-[9px] text-gray-500 dark:text-gray-400 mt-0.5">
                              <FaMapMarkerAlt className="text-violet-500 text-[8px]" />
                              {h.country}
                            </div>
                            <div className="flex items-center gap-2 text-[9px] text-gray-600 dark:text-gray-400 mt-0.5">
                              <span className="flex items-center gap-0.5">
                                <FaBed className="text-violet-500 text-[8px]" />
                                {h.bedrooms}
                              </span>
                              <span className="flex items-center gap-0.5">
                                <FaBath className="text-violet-500 text-[8px]" />
                                {h.bathrooms}
                              </span>
                            </div>
                            <div className="flex items-center gap-0.5 font-bold text-violet-600 mt-0.5 text-[10px]">
                              <FaDollarSign className="text-[8px]" />
                              {h.price}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start animate-[fadeIn_0.3s_ease-out]">
                <div className="w-8 h-8 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full 
                              flex items-center justify-center mr-2">
                  <FaRobot className="text-white text-sm" />
                </div>
                <div className="inline-block px-4 py-3 rounded-2xl bg-white dark:bg-gray-700 shadow-md 
                              border border-gray-200 dark:border-gray-600 rounded-bl-none">
                  <div className="flex gap-1 items-center">
                    <ImSpinner2 className="animate-spin text-violet-600" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">AI đang suy nghĩ...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-2 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <button
                onClick={handleVoiceInput}
                disabled={isListening}
                className={`p-2 rounded-full transition ${
                  isListening 
                    ? 'bg-red-500 text-white animate-pulse' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                title="Voice input"
              >
                <FaMicrophone className="text-sm" />
              </button>
              
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) handleSend(); }}
                placeholder={isListening ? "Đang nghe..." : "Nhập..."}
                className="flex-1 rounded-full px-3 py-2 text-xs bg-gray-100 dark:bg-gray-700 
                         placeholder-gray-500 dark:placeholder-gray-400 text-gray-800 dark:text-gray-200 
                         border border-gray-300 dark:border-gray-600
                         focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                disabled={isListening}
              />
              
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isListening}
                className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700
                         text-white w-9 h-9 rounded-full flex items-center justify-center
                         shadow-md hover:shadow-lg
                         disabled:opacity-50 disabled:cursor-not-allowed
                         hover:scale-105 active:scale-95 transition-all"
              >
                <FaPaperPlane className="text-xs" />
              </button>
            </div>

            {/* Quick actions */}
            <div className="flex gap-1.5 mt-2 overflow-x-auto pb-1">
              <button 
                onClick={() => setInput("Gợi ý nhà đẹp")}
                className="px-2 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 rounded-full text-[10px] 
                         hover:bg-violet-200 dark:hover:bg-violet-900/50 whitespace-nowrap transition"
              >
                💡 Gợi ý
              </button>
              <button 
                onClick={() => setInput("Apartment Canada")}
                className="px-2 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 rounded-full text-[10px] 
                         hover:bg-violet-200 dark:hover:bg-violet-900/50 whitespace-nowrap transition"
              >
                🏠 Apartment
              </button>
              <button 
                onClick={() => setInput("Giá rẻ")}
                className="px-2 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 rounded-full text-[10px] 
                         hover:bg-violet-200 dark:hover:bg-violet-900/50 whitespace-nowrap transition"
              >
                💰 Giá tốt
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
