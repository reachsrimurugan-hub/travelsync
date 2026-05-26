import { motion } from 'framer-motion';
import { FiZap } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export const AISuggestionsPanel = ({ destinations, onSelect }) => (
  <aside className="glass-card ai-sidebar">
    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
      <FiZap className="text-accent" /> AI Picks
    </h3>
    {(destinations || []).map((dest, i) => (
      <motion.button
        key={dest.id}
        type="button"
        className="ai-suggestion-chip"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.08 }}
        onClick={() => onSelect?.(dest)}
      >
        <strong>{dest.name}</strong>
        <br />
        <small>{dest.aiReason || dest.description?.slice(0, 60)}</small>
      </motion.button>
    ))}
    <Link to="/ai-assistant" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
      Open AI Assistant
    </Link>
  </aside>
);
