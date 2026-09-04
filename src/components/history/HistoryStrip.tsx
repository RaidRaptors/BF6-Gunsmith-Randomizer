import React from 'react';
import { useHistory } from '../../hooks/useHistory';
import HistoryItem from './HistoryItem';

const HistoryStrip: React.FC = () => {
  const { history, clearHistory } = useHistory();

  return (
    <div style={styles.container}>
      <div style={styles.strip}>
        {history.map((loadout) => (
          <HistoryItem key={loadout.id} loadout={loadout} />
        ))}
      </div>
      {history.length > 0 && (
        <button
          style={styles.clearBtn}
          onClick={clearHistory}
          title="清除所有历史"
        >
          🗑️
        </button>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-sm)',
    flex: 1,
    overflow: 'hidden',
  },
  strip: {
    display: 'flex',
    gap: 'var(--spacing-sm)',
    overflowX: 'auto',
    flex: 1,
    paddingBottom: 2,
  },
  clearBtn: {
    fontSize: 14,
    padding: 'var(--spacing-sm)',
    borderRadius: 'var(--radius-sm)',
    flexShrink: 0,
    opacity: 0.5,
    transition: 'opacity var(--transition-fast)',
  },
};

export default HistoryStrip;
