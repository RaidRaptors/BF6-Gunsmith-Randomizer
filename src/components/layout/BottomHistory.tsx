import React from 'react';
import HistoryStrip from '../history/HistoryStrip';
import { useAppState } from '../../store/AppContext';

const BottomHistory: React.FC = () => {
  const { state } = useAppState();

  if (state.history.length === 0) return null;

  return (
    <div style={styles.container}>
      <span style={styles.label}>历史记录</span>
      <HistoryStrip />
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-md)',
    padding: 'var(--spacing-sm) var(--spacing-lg)',
    backgroundColor: 'var(--color-bg-secondary)',
    borderTop: '1px solid var(--color-border)',
    minHeight: 56,
  },
  label: {
    fontSize: 'var(--text-xs)',
    fontWeight: 600,
    color: 'var(--color-text-muted)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    whiteSpace: 'nowrap' as const,
    flexShrink: 0,
  },
};

export default BottomHistory;
