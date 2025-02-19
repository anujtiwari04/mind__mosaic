import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import Button from '../components/Button';

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: "Hello! I'm your AI mental health companion. How are you feeling today?",
      sender: 'ai',
      timestamp: new Date('2024-03-10T10:00:00')
    },
    {
      id: '2',
      content: "I'm here to listen and support you. Feel free to share what's on your mind.",
      sender: 'ai',
      timestamp: new Date('2024-03-10T10:00:05')
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isAtBottom, setIsAtBottom] = useState(true);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Replace with your actual API key and endpoint.
  const apiKey = import.meta.env.VITE_API_KEY;
  const apiUrl = import.meta.env.VITE_API_URL;


  // Build a prompt with instructions for bullet-point answers and word limits.
  const generateChatPrompt = (userMessage: string): string => {
    //     return `You are an AI mental health companion dedicated to providing support and advice on mental health issues.
    // Only address topics related to mental health, stress, anxiety, or emotional well-being.
    // If a user asks about something else, reply with:
    // "I'm sorry, I can only help with mental health related topics. Could you please ask a question related to mental health?"

    // Additionally, please provide your answer strictly in bullet point format. Each bullet point should start with a "•" and be concise (limit each bullet point to no more than 15 words). Do not include paragraphs or extra commentary.
    return `You are an AI mental health companion designed to provide empathetic, professional, and supportive responses to individuals seeking help with mental health, stress, anxiety, and emotional well-being.

Focus only on topics related to mental health and emotional well-being, try to answer every question related to upliftment of one's mental health.
If the user asks about extreamly unrelated subjects that can not in any condition be answred with a mental health related answer then, respond with:
"I’m here to support you with mental health-related questions. Can you share what’s on your mind regarding your emotional well-being?"
Please answer in a clear, friendly, and concise manner, try to using bullet points whenever needed, starting each point with "•." Keep responses brief (no more than 15 words per point if using bullet points) and avoid paragraphs or additional commentary if not needed try to minimize them.

User: ${userMessage}
AI:`;
  };

  // Scroll handler to detect if we are near the bottom of the messages container.
  const handleScroll = () => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    // If the user is not within 20px of the bottom, consider them scrolled up.
    if (scrollTop + clientHeight < scrollHeight - 20) {
      setIsAtBottom(false);
    } else {
      setIsAtBottom(true);
    }
  };

  // Auto-scroll to bottom if user is already near the bottom.
  useEffect(() => {
    if (chatContainerRef.current && isAtBottom) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isAtBottom]);

  // Handle sending a message and calling the generative API.
  const handleSend = async () => {
    if (newMessage.trim() === '') return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: newMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    // Add the user's message to the chat.
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');

    // Add a temporary AI message with "Thinking..." text.
    const tempAiMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      content: "Thinking...",
      sender: 'ai',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, tempAiMessage]);

    // Create the prompt with injected instructions.
    const prompt = generateChatPrompt(userMessage.content);

    try {
      const response = await fetch(`${apiUrl}?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const generatedText = data.candidates[0].content.parts[0].text;

      // Update the temporary "Thinking..." message with the AI's response.
      setMessages(prev =>
        prev.map(msg =>
          msg.id === tempAiMessage.id ? { ...msg, content: generatedText } : msg
        )
      );
    } catch (error) {
      console.error('Error fetching data:', error);
      // Update the temporary message with an error message.
      setMessages(prev =>
        prev.map(msg =>
          msg.id === tempAiMessage.id
            ? {
              ...msg,
              content:
                "I'm having trouble responding right now. Please try again later."
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
              className={`max-w-[80%] md:max-w-[60%] p-4 rounded-2xl ${message.sender === 'user'
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
            onClick={() => {
              if (chatContainerRef.current) {
                chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
              }
            }}
            className="absolute bottom-4 right-4 bg-emerald-600 text-white rounded-full p-2 shadow-md hover:bg-emerald-500"
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
          />
          <Button
            onClick={handleSend}
            disabled={newMessage.trim() === ''}
            className="p-4 aspect-square rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}























// import React, { useState } from 'react';
// import { Send } from 'lucide-react';
// import Button from '../components/Button';

// interface ChatMessage {
//   id: string;
//   content: string;
//   sender: 'user' | 'ai';
//   timestamp: Date;
// }

// export default function Chat() {
//   const [messages, setMessages] = useState<ChatMessage[]>([
//     {
//       id: '1',
//       content: "Hello! I'm your AI mental health companion. How are you feeling today?",
//       sender: 'ai',
//       timestamp: new Date('2024-03-10T10:00:00')
//     },
//     {
//       id: '2',
//       content: "I'm here to listen and support you. Feel free to share what's on your mind.",
//       sender: 'ai',
//       timestamp: new Date('2024-03-10T10:00:05')
//     }
//   ]);
//   const [newMessage, setNewMessage] = useState('');

//   const handleSend = () => {
//     if (newMessage.trim() === '') return;

//     const message: ChatMessage = {
//       id: Date.now().toString(),
//       content: newMessage,
//       sender: 'user',
//       timestamp: new Date(),
//     };

//     setMessages([...messages, message]);
//     setNewMessage('');
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSend();
//     }
//   };

//   return (
//     <div className="min-h-[80vh] flex flex-col bg-gray-50 dark:bg-gray-900 rounded-xl shadow-lg animate-fadeIn">
//       {/* Chat Messages */}
//       <div className="flex-1 p-4 overflow-y-auto space-y-4">
//         {messages.map((message) => (
//           <div
//             key={message.id}
//             className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
//           >
//             <div
//               className={`max-w-[80%] md:max-w-[60%] p-4 rounded-2xl ${
//                 message.sender === 'user'
//                   ? 'bg-emerald-600 text-white ml-auto rounded-tr-none'
//                   : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white mr-auto rounded-tl-none'
//               }`}
//             >
//               <p className="text-sm md:text-base">{message.content}</p>
//               <span className="text-xs opacity-75 mt-1 block">
//                 {new Date(message.timestamp).toLocaleTimeString([], {
//                   hour: '2-digit',
//                   minute: '2-digit'
//                 })}
//               </span>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Message Input */}
//       <div className="p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700">
//         <div className="flex items-center gap-2">
//           <textarea
//             value={newMessage}
//             onChange={(e) => setNewMessage(e.target.value)}
//             onKeyDown={handleKeyPress}
//             placeholder="Type your message..."
//             className="flex-1 resize-none rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4 focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent dark:text-white"
//             rows={1}
//           />
//           <Button
//             onClick={handleSend}
//             disabled={newMessage.trim() === ''}
//             className="p-4 aspect-square rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             <Send className="w-5 h-5" />
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }