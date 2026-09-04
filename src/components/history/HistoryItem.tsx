import React from 'react';
import type { Loadout } from '../../types/loadout';
import { useHistory } from '../../hooks/useHistory';

interface HistoryItemProps {
  loadout: Loadout;
}

const HistoryItem: React.FC<HistoryItemProps> = ({ loadout }) => {
  const { loadFromHistory } = useHistory();

  const time = new Date(loadout.generatedAt).toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <button className="card" style={styles.item} onClick={() => loadFromHistory(loadout)}>
      <span style={styles.name}>{loadout.weaponName}</span>
      <span style={styles.cost}>{loadout.totalCost}点</span>
      <span style={styles.time}>{time}</span>
    </button>
  );
};

const styles: Record<string, React.CSSProperties> = {
  item: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 'var(--spacing-xs)',
    padding: 'var(--spacing-sm) var(--spacing-md)',
    minWidth: 90,
    textAlign: 'center' as const,
  },
  name: {
    fontSize: 'var(--text-xs)',
    fontWeight: 600,
    color: 'var(--color-text-primary)',
    whiteSpace: 'nowrap' as const,
  },
  cost: {
    fontSize: 'var(--text-xs)',
    fontFamily: 'var(--font-mono)',
    color: 'var(--color-accent)',
    fontWeight: 700,
  },
  time: {
    fontSize: 'var(--text-xs)',
    color: 'var(--color-text-muted)',
  },
};

export default HistoryItem;
