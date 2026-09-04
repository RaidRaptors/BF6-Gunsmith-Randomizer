import React from 'react';
import { useAppState } from '../../store/AppContext';
import SlotCard from './SlotCard';

const SlotGrid: React.FC = () => {
  const { state } = useAppState();
  const loadout = state.currentLoadout;

  if (!loadout) return null;

  return (
    <div style={styles.grid}>
      {loadout.selections.map((selection) => (
        <SlotCard key={selection.slot} selection={selection} />
      ))}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 'var(--spacing-md)',
  },
};

export default SlotGrid;
