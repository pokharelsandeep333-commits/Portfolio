import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';

const Terminal = () => {
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const endOfMessagesRef = useRef(null);
  const messagesRef = useRef(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, isLoading]);

  const handleKeyDown = async (e) => {
    if (e.key === 'Enter' && input.trim()) {
      const userMessage = input.trim();
      setInput('');
      setHistory(prev => [...prev, { role: 'user', content: userMessage }]);
      setIsLoading(true);

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: userMessage }),
        });

        const data = await response.json();
        
        setHistory(prev => [...prev, { role: 'bot', content: data.response || data.error || 'Error' }]);
      } catch {
        setHistory(prev => [...prev, { role: 'bot', content: 'Network Error' }]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (messagesRef.current && history.length > 0) {
      const lastMessage = messagesRef.current.children[history.length - 1];
      if (lastMessage) {
        gsap.fromTo(lastMessage, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3 });
      }
    }
  }, [history]);

  return (
    <div className="w-full max-w-2xl mx-auto p-4 bg-[#0a192f] rounded-lg shadow-2xl border border-[#1d2d50] font-mono text-sm text-[#8892b0]">
      <div className="flex items-center space-x-2 mb-4 pb-2 border-b border-[#1d2d50]">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <span className="ml-2 text-xs font-semibold">guest@sandeeppokharel: ~</span>
      </div>
      
      <div className="h-64 overflow-y-auto mb-4 scrollbar-thin scrollbar-thumb-[#1d2d50]" ref={messagesRef}>
        {history.map((msg, index) => (
          <div key={index} className="mb-2">
            {msg.role === 'user' ? (
              <div>
                <span className="text-[#64ffda]">$</span> {msg.content}
              </div>
            ) : (
              <div className="text-[#e6f1ff]">{msg.content}</div>
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

      <div className="flex items-center relative">
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
        {!input && !isLoading && (
          <span className="w-2 h-4 bg-[#64ffda] animate-pulse absolute left-4 pointer-events-none"></span>
        )}
      </div>
    </div>
  );
};

export default Terminal;
