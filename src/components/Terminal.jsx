import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import ReactMarkdown from 'react-markdown';

const Terminal = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const endOfMessagesRef = useRef(null);
  const messagesRef = useRef(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleKeyDown = async (e) => {
    if (e.key === 'Enter' && input.trim()) {
      const userMessage = input.trim();
      setInput('');
      setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
      setIsLoading(true);

      try {
        const apiUrl = import.meta.env.VITE_API_URL || '/api/chat';
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: userMessage }),
        });

        if (response.status === 429) {
          setMessages(prev => [...prev, { role: 'bot', content: 'Too many requests. Please slow down and try again in a minute.' }]);
          return;
        }

        const data = await response.json();
        
        setMessages(prev => [...prev, { role: 'bot', content: data.response || data.error || 'Error' }]);
      } catch {
        setMessages(prev => [...prev, { role: 'bot', content: 'Network Error' }]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (messagesRef.current && messages.length > 0) {
      const lastMessage = messagesRef.current.children[messages.length - 1];
      if (lastMessage) {
        gsap.fromTo(lastMessage, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3 });
      }
    }
  }, [messages]);

  return (
    <div className="w-full max-w-2xl mx-auto p-4 bg-[#0a192f] rounded-lg shadow-2xl border border-[#1d2d50] font-mono text-sm text-[#8892b0]">
      <div className="flex items-center space-x-2 mb-4 pb-2 border-b border-[#1d2d50]">
        {['bg-red-500', 'bg-yellow-500', 'bg-green-500'].map((colorClass, i) => (
          <div key={i} className={`w-3 h-3 rounded-full ${colorClass}`}></div>
        ))}
        <span className="ml-2 text-xs font-semibold">guest@sandeeppokharel: ~</span>
      </div>
      
      <div className="h-64 overflow-y-auto mb-4 scrollbar-thin scrollbar-thumb-[#1d2d50]" ref={messagesRef}>
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">
            {msg.role === 'user' ? (
              <div>
                <span className="text-[#64ffda]">$</span> {msg.content}
              </div>
            ) : (
              <div className="text-[#e6f1ff] [&>p]:mb-2 [&>ul]:list-disc [&>ul]:ml-4 [&>ol]:list-decimal [&>ol]:ml-4 [&_a]:text-[#64ffda] [&_a]:underline">
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="text-[#e6f1ff] flex items-center">
            <span>thinking</span>
            <span className="w-2 h-4 bg-[#64ffda] ml-1 animate-pulse"></span>
          </div>
        )}
        <div ref={endOfMessagesRef} />
      </div>

      <div className="flex items-center">
        <span className="text-[#64ffda] mr-2">$</span>
        <input
          type="text"
          role="textbox"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none text-[#e6f1ff]"
          autoFocus
          disabled={isLoading}
        />
      </div>
    </div>
  );
};

export default Terminal;
