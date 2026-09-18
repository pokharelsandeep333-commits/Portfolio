import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import ReactMarkdown from 'react-markdown';

// Shown only on an empty conversation — a blank input gets ignored, whereas a
// tappable question gives visitors an obvious first move. Each one is
// answerable from the portfolio data the assistant is grounded in.
const STARTER_QUESTIONS = [
  'What have you built with AWS?',
  'Tell me about ShiftSentry',
  'What do you do at DSU?',
  'Are you open to internships?',
];

// One source for the opening message — rendered on first load, restored by
// "Clear chat", and asserted verbatim in Terminal.test.jsx.
const GREETING_TEXT =
  "Hi — I'm Digital Sandeep, an AI version of Sandeep. Ask me anything about my work, projects, or experience.";
const makeGreeting = () => [{ role: 'bot', content: GREETING_TEXT }];

const Terminal = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('chatHistory');
      if (saved) {
        let parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Migrate legacy cached messages to the new schema to prevent Zod API validation errors
          return parsed.map(msg => ({
            role: msg.role || (msg.isBot ? 'bot' : 'user'),
            content: msg.content || msg.text || ''
          }));
        }
      }
    } catch (error) {
      console.error("Failed to parse chat history", error);
    }
    return makeGreeting();
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const endOfMessagesRef = useRef(null);
  const messagesRef = useRef(null);
  const inputRef = useRef(null);
  const restoreFocusRef = useRef(null);
  const panelRef = useRef(null);


  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(messages));
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // The drawer is always mounted and only translated off-canvas, so `autoFocus`
  // would claim focus on page load — and pop the keyboard on mobile — while the
  // panel is still hidden. Focus only once it is actually open, and hand focus
  // back on close: browsers do not blur an already-focused element when `inert`
  // is applied, which would otherwise strand the caret off-canvas.
  useEffect(() => {
    if (isOpen) {
      restoreFocusRef.current = document.activeElement;
      inputRef.current?.focus();
    } else if (restoreFocusRef.current) {
      // Only reclaim focus if it is still trapped inside the panel. Closing by
      // clicking the page already moved focus elsewhere — stealing it back
      // would be its own annoyance.
      if (panelRef.current?.contains(document.activeElement)) {
        restoreFocusRef.current.focus?.();
      }
      restoreFocusRef.current = null;
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (e) => { if (e.key === 'Escape') onClose?.(); };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  const clearChat = () => {
    const initial = makeGreeting();
    setMessages(initial);
    localStorage.setItem('chatHistory', JSON.stringify(initial));
  };

  // Shared by the input's Enter key and the starter-question buttons.
  const sendMessage = async (text) => {
    const userMessage = text.trim();
    if (!userMessage || isLoading) return;
    setInput('');

    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || '/api/chat';
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: newMessages }),
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
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && input.trim()) {
      sendMessage(input);
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
        ref={panelRef}
        className={`chat-drawer fixed right-0 top-0 w-full sm:w-80 bg-[#050e1f]/40 backdrop-blur-2xl shadow-[-20px_0_40px_rgba(0,0,0,0.6)] border-l border-white/10 z-50 flex flex-col text-sm text-[#e6f1ff] ${isOpen ? 'is-open' : ''}`}
        aria-label="Digital Sandeep AI chat"
        aria-hidden={!isOpen}
        inert={!isOpen}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
          <div className="flex items-center space-x-2 text-white">
            <span className="font-semibold text-[#FFC72C]">Digital Sandeep (AI)</span>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={clearChat}
              className="text-white/50 hover:text-red-400 transition-colors"
              aria-label="Clear chat"
              title="Clear Chat History"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18"></path>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
              </svg>
            </button>
            <button 
              onClick={onClose}
              className="text-white/50 hover:text-[#FFC72C] transition-colors"
              aria-label="Close chat"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-white/10 space-y-4" ref={messagesRef}>
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-3.5 ${msg.role === 'user' ? 'bg-gradient-to-br from-[#FFC72C] to-[#d4a017] text-[#050e1f] rounded-tr-sm shadow-md shadow-[#FFC72C]/20 font-medium' : 'bg-white/10 backdrop-blur-md border border-white/10 text-[#e6f1ff] rounded-tl-sm shadow-lg'}`}>
              {msg.role === 'user' ? (
                <div>
                  {msg.content}
                </div>
              ) : (
                <div className="[&>p]:mb-2 last:[&>p]:mb-0 [&>ul]:list-disc [&>ul]:ml-4 [&>ol]:list-decimal [&>ol]:ml-4 [&_a]:text-[#FFC72C] [&_a]:underline">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        ))}
        {messages.length <= 1 && !isLoading && (
          <div className="pt-1">
            <p className="text-white/35 text-xs font-inter uppercase tracking-widest mb-2.5 px-1">Try asking</p>
            <div className="flex flex-col items-start gap-2">
              {STARTER_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="text-xs font-inter text-left px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-white/60 hover:border-[#FFC72C]/40 hover:text-white hover:bg-white/10 transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/10 backdrop-blur-md border border-white/10 text-[#e6f1ff] max-w-[85%] rounded-2xl rounded-tl-sm p-4 flex items-center space-x-2 shadow-lg">
              <div className="w-2 h-2 bg-[#FFC72C] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-[#FFC72C] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-[#FFC72C] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
        <div ref={endOfMessagesRef} />
      </div>

        <div
          className="border-t border-white/10 p-4 bg-white/5 backdrop-blur-xl"
          style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
        >
          <input
            type="text"
            role="textbox"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            ref={inputRef}
            className="chat-drawer-input w-full bg-[#050e1f]/50 border border-white/10 rounded-full px-4 py-3 outline-none text-[#e6f1ff] placeholder-white/40 focus:border-[#FFC72C]/50 focus:ring-1 focus:ring-[#FFC72C]/50 transition-all shadow-inner"
            disabled={isLoading}
            placeholder="Type your message..."
          />
        </div>
      </div>
    </>
  );
};

export default Terminal;
