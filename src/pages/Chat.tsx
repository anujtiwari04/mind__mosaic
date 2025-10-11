import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import Button from '../components/Button';
import AuthModal from '../components/AuthModal';
import { useAuth } from '../contexts/AuthContext';
import { useGoogleGenAI } from '../Hooks/useGoogleGenAI';

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "2",
    content: "I'm here to listen and support you. Feel free to share what's on your mind.",
    sender: "ai",
    timestamp: new Date(),
  },
];

export default function Chat() {
  const [username, setUsername] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [newMessage, setNewMessage] = useState('');
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const { generateContent, isLoading } = useGoogleGenAI();
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Fetch username from localStorage
  useEffect(() => {
    const getUserData = async () => {
      try {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
          setUsername(storedUsername);
          console.log("Username retrieved in chat:", storedUsername);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    getUserData();
  }, []);

  // Update first message with username
  useEffect(() => {
    if (username) {
      setMessages((prevMessages) => [
        {
          id: "1",
          content: `Hello ${username}! I'm your AI mental health companion. How are you feeling today?`,
          sender: "ai",
          timestamp: new Date(),
        },
        ...prevMessages,
      ]);
    }
  }, [username]);

  const handleAuthSuccess = () => {
    setIsLoggedIn(true);
  };

  // Build a prompt with instructions for the AI
  const generateChatPrompt = (userMessage: string): string => {
    return `You are an AI mental health companion designed to provide empathetic, professional, and supportive responses to individuals seeking help with mental health, stress, anxiety, and emotional well-being.

Focus only on topics related to mental health and emotional well-being, try to answer every question related to upliftment of one's mental health.
If the user asks about extremely unrelated subjects that cannot in any condition be answered with a mental health related answer then, respond with:
"I'm here to support you with mental health-related questions. Can you share what's on your mind regarding your emotional well-being?"

Please answer in a clear, friendly, and concise manner, using bullet points whenever needed, starting each point with "•." Keep responses brief (no more than 15 words per point if using bullet points) and avoid paragraphs or additional commentary if not needed.

User: ${userMessage}
AI:`;
  };

  // Scroll handler to detect if we are near the bottom of the messages container
  const handleScroll = () => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    if (scrollTop + clientHeight < scrollHeight - 20) {
      setIsAtBottom(false);
    } else {
      setIsAtBottom(true);
    }
  };

  // Auto-scroll to bottom if user is already near the bottom
  useEffect(() => {
    if (chatContainerRef.current && isAtBottom) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isAtBottom]);

  // Handle sending a message and calling the generative API
  const handleSend = async () => {
    if (newMessage.trim() === '') return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: newMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    // Add the user's message to the chat
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');

    // Add a temporary AI message with "Thinking..." text
    const tempAiMessageId = `temp-${Date.now()}`;
    const tempAiMessage: ChatMessage = {
      id: tempAiMessageId,
      content: "Thinking...",
      sender: 'ai',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, tempAiMessage]);

    try {
      // Create the prompt with injected instructions
      const prompt = generateChatPrompt(userMessage.content);
      const generatedText = await generateContent({ prompt });

      // Replace the temporary message with the actual response
      setMessages(prev =>
        prev.map(msg =>
          msg.id === tempAiMessageId
            ? { ...msg, content: generatedText }
            : msg
        )
      );
    } catch (error) {
      console.error("Error fetching data:", error);
      // Replace temporary message with error message
      setMessages(prev =>
        prev.map(msg =>
          msg.id === tempAiMessageId
            ? {
                ...msg,
                content: "I'm having trouble responding right now. Please try again later.",
              }
            : msg
        )
      );
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  if (!isLoggedIn) {
    return (
      <AuthModal
        isOpen={true}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    );
  }

  return (
    <div className="min-h-[80vh] flex flex-col bg-gray-50 dark:bg-gray-900 rounded-xl shadow-lg animate-fadeIn relative">
      {/* Chat Messages Container */}
      <div
        ref={chatContainerRef}
        onScroll={handleScroll}
        className="flex-1 p-4 overflow-y-auto space-y-4 relative"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] md:max-w-[60%] p-4 rounded-2xl ${
                message.sender === 'user'
                  ? 'bg-emerald-600 text-white ml-auto rounded-tr-none'
                  : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white mr-auto rounded-tl-none'
              }`}
            >
              <p className="text-sm md:text-base whitespace-pre-wrap">
                {message.content}
              </p>
              <span className="text-xs opacity-75 mt-1 block">
                {new Date(message.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>
        ))}

        {/* Scroll-to-bottom button appears if not at the bottom */}
        {!isAtBottom && (
          <button
            onClick={scrollToBottom}
            className="absolute bottom-4 right-4 bg-emerald-600 text-white rounded-full p-2 shadow-md hover:bg-emerald-500"
            aria-label="Scroll to bottom"
          >
            ↓
          </button>
        )}
      </div>

      {/* Sticky Message Input */}
      <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t dark:border-gray-700 p-4">
        <div className="flex items-center gap-2">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 resize-none rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4 focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent dark:text-white"
            rows={1}
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={newMessage.trim() === '' || isLoading}
            className="p-4 aspect-square rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}