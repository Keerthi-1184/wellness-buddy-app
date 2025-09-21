import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../config/api';
import { 
  Send, 
  Bot, 
  User, 
  Heart, 
  Sparkles,
  AlertTriangle,
  Loader,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Lightbulb,
  MessageCircle,
  Smile,
  Frown,
  Meh,
  Laugh,
  TrendingUp
} from 'lucide-react';

const ChatInterface = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [crisisDetected, setCrisisDetected] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [conversationContext, setConversationContext] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Quick reply suggestions based on context
  const getQuickReplies = () => {
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || lastMessage.role === 'user') {
      return [
        "I'm feeling great today! 😊",
        "I'm having a tough day 😔",
        "I need some motivation 💪",
        "I want to talk about my goals 🎯",
        "I'm feeling anxious 😰",
        "I need help with stress 🧘"
      ];
    }

    // Context-based suggestions
    const content = lastMessage.content.toLowerCase();
    if (content.includes('sad') || content.includes('down') || content.includes('depressed')) {
      return [
        "Tell me more about what's bothering you",
        "I understand, that sounds really hard",
        "What usually helps you feel better?",
        "Would you like to try a breathing exercise?",
        "I'm here for you, you're not alone"
      ];
    } else if (content.includes('anxious') || content.includes('worried') || content.includes('stress')) {
      return [
        "Let's work through this together",
        "What's making you feel anxious?",
        "Would you like to try some grounding techniques?",
        "I can help you break this down",
        "You're safe here, take your time"
      ];
    } else if (content.includes('happy') || content.includes('good') || content.includes('great')) {
      return [
        "That's wonderful to hear! 🌟",
        "What made you feel so good?",
        "I love hearing about your positive moments",
        "How can we keep this energy going?",
        "You deserve to feel this way!"
      ];
    } else {
      return [
        "Tell me more about that",
        "I'm listening, go on",
        "That sounds interesting",
        "How did that make you feel?",
        "I want to understand better"
      ];
    }
  };

  // Typing indicator component
  const TypingIndicator = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex justify-start"
    >
      <div className="flex items-start space-x-2">
        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center">
          <Heart className="h-4 w-4 text-white" />
        </div>
        <div className="bg-white rounded-2xl px-4 py-2 shadow-sm">
          <div className="flex items-center space-x-1">
            <div className="flex space-x-1">
              <motion.div
                className="w-2 h-2 bg-primary-500 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
              />
              <motion.div
                className="w-2 h-2 bg-primary-500 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
              />
              <motion.div
                className="w-2 h-2 bg-primary-500 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
              />
            </div>
            <span className="text-sm text-gray-600 ml-2">Wellness Buddy is typing...</span>
          </div>
        </div>
      </div>
    </motion.div>
  );

  // Streaming message effect
  const streamMessage = (text, messageId) => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setStreamingMessage(text.substring(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        setIsStreaming(false);
        setStreamingMessage('');
        
        // Add the complete message to the messages array
        setMessages(prev => prev.map(msg => 
          msg.id === messageId 
            ? { ...msg, content: text, isStreaming: false }
            : msg
        ));
      }
    }, 30); // Adjust speed as needed
  };

  useEffect(() => {
    // Add welcome message with streaming effect
    const welcomeMessage = {
      id: 1,
      role: 'bot',
      content: "Hello! I'm your Wellness Buddy. I'm here to listen and support you. How are you feeling today? 💙",
      timestamp: new Date(),
      isStreaming: false
    };
    setMessages([welcomeMessage]);
  }, []);

  const handleSendMessage = async (message = null) => {
    const messageToSend = message || inputMessage;
    if (!messageToSend.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: messageToSend,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);
    setShowSuggestions(false);

    // Add context to conversation
    setConversationContext(prev => [...prev.slice(-5), messageToSend]);

    try {
      const response = await api.sendChat(messageToSend);
      
      // Create bot message with streaming placeholder
      const botMessage = {
        id: Date.now() + 1,
        role: 'bot',
        content: '',
        timestamp: new Date(),
        isStreaming: true
      };

      setMessages(prev => [...prev, botMessage]);
      setIsStreaming(true);
      
      // Start streaming the response
      setTimeout(() => {
        streamMessage(response.response, botMessage.id);
      }, 1000); // Small delay to show typing indicator

      // Check for crisis keywords
      const crisisKeywords = ['suicide', 'self-harm', 'hopeless', 'kill myself', 'end it all'];
      const hasCrisis = crisisKeywords.some(keyword => 
        messageToSend.toLowerCase().includes(keyword)
      );
      
      if (hasCrisis) {
        setCrisisDetected(true);
        setTimeout(() => setCrisisDetected(false), 10000);
        
        if (user?.emergencyEmail) {
          alert(`⚠️ Crisis detected! An alert has been sent to your emergency contact: ${user.emergencyEmail}`);
        } else {
          alert('⚠️ Crisis detected! Please set an emergency contact in Emergency Settings for your safety.');
        }
      }

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        role: 'bot',
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment. 💙",
        timestamp: new Date(),
        isStreaming: false
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      setTimeout(() => setShowSuggestions(true), 2000); // Show suggestions after response
    }
  };

  const handleQuickReply = (reply) => {
    handleSendMessage(reply);
  };

  const handleMessageAction = (messageId, action) => {
    if (action === 'regenerate') {
      // Find the user message that prompted this bot response
      const messageIndex = messages.findIndex(msg => msg.id === messageId);
      if (messageIndex > 0) {
        const userMessage = messages[messageIndex - 1];
        if (userMessage.role === 'user') {
          // Remove the current bot response and regenerate
          setMessages(prev => prev.filter(msg => msg.id !== messageId));
          handleSendMessage(userMessage.content);
        }
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Crisis Alert */}
      <AnimatePresence>
        {crisisDetected && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3"
          >
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <div>
              <p className="text-red-800 font-medium">Crisis Support Available</p>
              <p className="text-red-600 text-sm">
                {user?.emergencyEmail ? (
                  <>An alert has been sent to your emergency contact: <strong>{user.emergencyEmail}</strong></>
                ) : (
                  <>Please set an emergency contact in Emergency Settings. Call 988 (Suicide & Crisis Lifeline) for immediate help.</>
                )}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="card p-0 overflow-hidden">
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-4 text-white">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold">Wellness Buddy</h3>
              <p className="text-sm text-primary-100">Always here to listen and support you</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    message.role === 'user' 
                      ? 'bg-primary-500' 
                      : 'bg-gradient-to-r from-pink-500 to-purple-500'
                  }`}>
                    {message.role === 'user' ? (
                      <User className="h-4 w-4 text-white" />
                    ) : (
                      <Heart className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <div className={`rounded-2xl px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-primary-500 text-white'
                      : 'bg-white text-gray-800 shadow-sm'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">
                      {message.isStreaming ? streamingMessage : message.content}
                      {message.isStreaming && (
                        <motion.span
                          animate={{ opacity: [1, 0, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="ml-1"
                        >
                          |
                        </motion.span>
                      )}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <p className={`text-xs ${
                        message.role === 'user' ? 'text-primary-100' : 'text-gray-500'
                      }`}>
                        {formatTime(message.timestamp)}
                      </p>
                      {message.role === 'bot' && !message.isStreaming && (
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleMessageAction(message.id, 'regenerate')}
                            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                            title="Regenerate response"
                          >
                            <RefreshCw className="h-3 w-3 text-gray-400 hover:text-gray-600" />
                          </button>
                          <button
                            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                            title="Like this response"
                          >
                            <ThumbsUp className="h-3 w-3 text-gray-400 hover:text-green-500" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && <TypingIndicator />}

          {/* Quick Reply Suggestions */}
          {showSuggestions && messages.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4"
            >
              <div className="flex items-center space-x-2 mb-2">
                <Lightbulb className="h-4 w-4 text-yellow-500" />
                <span className="text-sm text-gray-600 font-medium">Quick replies:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {getQuickReplies().slice(0, 4).map((reply, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleQuickReply(reply)}
                    className="px-3 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:bg-primary-50 hover:border-primary-200 hover:text-primary-700 transition-all duration-200 shadow-sm"
                  >
                    {reply}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-200">
          {/* Conversation Topics */}
          <div className="mb-3">
            <div className="flex items-center space-x-2 mb-2">
              <MessageCircle className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-gray-600 font-medium">Conversation starters:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                "I'm feeling overwhelmed",
                "Help me with my goals",
                "I need motivation",
                "I'm struggling with anxiety",
                "Tell me about mindfulness",
                "I want to talk about my day"
              ].map((topic, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setInputMessage(topic)}
                  className="px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-xs text-blue-700 hover:bg-blue-100 transition-colors"
                >
                  {topic}
                </motion.button>
              ))}
            </div>
          </div>

          <div className="flex space-x-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="How are you feeling? I'm here to listen..."
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                disabled={loading}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setInputMessage(prev => prev + '😊')}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  title="Add emoji"
                >
                  <Smile className="h-4 w-4 text-gray-400" />
                </motion.button>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || loading}
              className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:from-primary-600 hover:to-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
            >
              <Send className="h-4 w-4" />
              <span className="hidden sm:inline">Send</span>
            </motion.button>
          </div>
          
          <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <Heart className="h-3 w-3" />
              <span>Your conversations are private and secure</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>Press Enter to send</span>
              <span>•</span>
              <span>Shift+Enter for new line</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
