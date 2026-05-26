import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertTriangle, FiX } from 'react-icons/fi';

export const DeleteTripModal = ({ trip, open, onClose, onConfirm, loading }) => {
  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="place-detail-modal" style={{ alignItems: 'center', padding: '1rem' }}>
        <motion.div
          className="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
        <motion.div
          className="glass-card"
          style={{ position: 'relative', zIndex: 1, maxWidth: '420px', width: '100%', padding: '2rem' }}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
            <FiX />
          </button>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <FiAlertTriangle size={48} color="var(--accent)" style={{ marginBottom: '1rem' }} />
            <h2>Delete trip?</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              &quot;{trip?.tripName || trip?.title}&quot; will be permanently removed from your cloud planner.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="button" className="btn btn-primary" style={{ flex: 1, background: '#e74c3c' }} onClick={onConfirm} disabled={loading}>
              {loading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
