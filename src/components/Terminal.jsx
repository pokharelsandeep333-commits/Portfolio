import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import ReactMarkdown from 'react-markdown';

const Terminal = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    { role: 'bot', content: 'Hi there! I am Digital Sandeep. Ask me anything about Sandeep\'s skills, projects, or experience.' }
  ]);
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
    <>
      {/* Sidebar panel */}
      <div 
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-[#0a192f] shadow-2xl border-l border-[#1d2d50] z-50 flex flex-col font-mono text-sm text-[#8892b0] transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between p-4 border-b border-[#1d2d50]">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold">guest@sandeeppokharel: ~</span>
          </div>
          <button 
            onClick={onClose}
            className="text-[#8892b0] hover:text-[#FFC72C] transition-colors"
            aria-label="Close terminal"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-[#1d2d50]" ref={messagesRef}>
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">
            {msg.role === 'user' ? (
              <div>
                <span className="text-[#FFC72C]">$</span> {msg.content}
              </div>
            ) : (
              <div className="text-[#e6f1ff] [&>p]:mb-2 [&>ul]:list-disc [&>ul]:ml-4 [&>ol]:list-decimal [&>ol]:ml-4 [&_a]:text-[#FFC72C] [&_a]:underline">
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="text-[#e6f1ff] flex items-center">
            <span>thinking</span>
            <span className="w-2 h-4 bg-[#FFC72C] ml-1 animate-pulse"></span>
          </div>
        )}
        <div ref={endOfMessagesRef} />
      </div>

        <div className="flex items-center border-t border-[#1d2d50] p-4 bg-[#050e1f]">
          <span className="text-[#FFC72C] mr-2">$</span>
          <input
            type="text"
            role="textbox"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none text-[#e6f1ff]"
            autoFocus
            disabled={isLoading}
            placeholder="Type a message..."
          />
        </div>
      </div>
    </>
  );
};

export default Terminal;
