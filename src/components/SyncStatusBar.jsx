import { FiCheck, FiCloud, FiAlertCircle, FiRefreshCw } from 'react-icons/fi';

const LABELS = {
  idle: null,
  pending: 'Unsaved changes…',
  saving: 'Saving to cloud…',
  saved: 'All changes saved',
  error: 'Sync failed',
};

export const SyncStatusBar = ({ status, error, onRetry }) => {
  const label = LABELS[status];
  if (!label && status !== 'error') return null;

  return (
    <div className={`sync-status-bar sync-status-${status}`} role="status">
      {status === 'saving' && <FiCloud className="spin" />}
      {status === 'saved' && <FiCheck />}
      {status === 'error' && <FiAlertCircle />}
      {status === 'pending' && <FiCloud />}
      <span>{status === 'error' ? error || label : label}</span>
      {status === 'error' && onRetry && (
        <button type="button" className="btn btn-ghost" onClick={onRetry} style={{ padding: '0.25rem 0.5rem', fontSize: '0.85rem' }}>
          <FiRefreshCw /> Retry
        </button>
      )}
    </div>
  );
};
