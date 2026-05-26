import { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { FiSend, FiZap } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { generateAIResponse } from '../services/aiService';
import { AISuggestionsPanel } from '../components/AISuggestionsPanel';
import { getAISuggestedDestinations } from '../services/aiService';
import { useApp } from '../context/AppContext';

const WELCOME = {
  role: 'assistant',
  content:
    "Hello! I'm your TravelSync AI assistant. Ask me about destinations, itineraries, budgets, hotels, or trip optimization.",
  suggestions: ['Suggest beach destinations', 'Plan a 5-day itinerary', 'Estimate my budget'],
};

export const AIAssistant = () => {
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);
  const { searchFilters } = useApp();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const send = async (text) => {
    const msg = text || input;
    if (!msg.trim()) return;
    setInput('');
    setMessages((m) => [...m, { role: 'user', content: msg }]);
    setTyping(true);
    try {
      const res = await generateAIResponse(msg, {
        destination: searchFilters.location,
        travelers: searchFilters.travelers,
        budget: 3500,
      });
      setMessages((m) => [...m, res]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>AI Assistant | TravelSync TripNest</title>
      </Helmet>
      <div className="container page-wrapper ai-page">
        <AISuggestionsPanel
          destinations={getAISuggestedDestinations()}
          onSelect={(d) => send(`Tell me about ${d.name}`)}
        />
        <div className="glass-card ai-chat">
          <div className="ai-chat-header">
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FiZap className="text-accent" /> AI Travel Assistant
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Smart recommendations powered by TravelSync
            </p>
          </div>
          <div className="ai-messages">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                className={`ai-message ${msg.role}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {msg.content.split('**').map((part, j) => (j % 2 === 1 ? <strong key={j}>{part}</strong> : part))}
                {msg.suggestions && (
                  <div className="ai-message-suggestions">
                    {msg.suggestions.map((s) => (
                      <button key={s} type="button" className="ai-quick-suggestion" onClick={() => send(s)}>
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
            {typing && (
              <div className="ai-message assistant">
                <div className="typing-indicator">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <form
            className="ai-input-area"
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about destinations, budget, itinerary..."
            />
            <button type="submit" className="btn btn-primary" aria-label="Send">
              <FiSend />
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
