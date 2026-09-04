import React from 'react';
import { useAppState } from '../../store/AppContext';
import type { GenerationMode } from '../../types/loadout';

const MODES: { value: GenerationMode; label: string; desc: string }[] = [
  { value: 'full', label: '完全随机', desc: '随机选枪+配件' },
  { value: 'category', label: '按分类随机', desc: '选定分类，随机枪械' },
  { value: 'specific', label: '指定枪械', desc: '自选武器，随机配件' },
];

const ModeToggle: React.FC = () => {
  const { state, dispatch, actions } = useAppState();

  return (
    <div style={styles.container}>
      {MODES.map((mode) => (
        <button
          key={mode.value}
          style={{
            ...styles.option,
            ...(state.mode === mode.value ? styles.optionActive : {}),
          }}
          onClick={(e) => {
            e.currentTarget.blur();
            dispatch(actions.setMode(mode.value));
          }}
        >
          <span style={styles.optionLabel}>{mode.label}</span>
          <span style={styles.optionDesc}>{mode.desc}</span>
        </button>
      ))}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-xs)',
  },
  option: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    padding: 'var(--spacing-sm) var(--spacing-md)',
    borderRadius: 'var(--radius-sm)',
    backgroundColor: 'transparent',
    border: '1px solid transparent',
    textAlign: 'left' as const,
    transition: 'all var(--transition-fast)',
  },
  optionActive: {
    backgroundColor: 'var(--tint-accent)',
    borderColor: 'var(--color-accent)',
  },
  optionLabel: {
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
    color: 'var(--color-text-primary)',
  },
  optionDesc: {
    fontSize: 'var(--text-xs)',
    color: 'var(--color-text-muted)',
  },
};

export default ModeToggle;
