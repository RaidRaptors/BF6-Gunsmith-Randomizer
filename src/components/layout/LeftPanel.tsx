import React from 'react';
import ModeToggle from '../weapon/ModeToggle';
import CategoryList from '../weapon/CategoryList';
import WeaponSearch from '../weapon/WeaponSearch';
import WeaponList from '../weapon/WeaponList';
import { useAppState } from '../../store/AppContext';

const LeftPanel: React.FC = () => {
  const { state } = useAppState();

  return (
    <div style={styles.panel}>
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>生成模式</h3>
        <ModeToggle />
      </div>

      <div style={styles.divider} />

      {state.mode !== 'full' && (
        <>
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>枪械分类</h3>
            <CategoryList />
          </div>
          <div style={styles.divider} />
        </>
      )}

      {state.mode === 'specific' && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>选择武器</h3>
          <WeaponSearch />
          <WeaponList />
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  panel: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'var(--color-bg-secondary)',
    padding: 'var(--spacing-md)',
    overflowY: 'auto',
    gap: 'var(--spacing-sm)',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-sm)',
  },
  sectionTitle: {
    fontSize: 'var(--text-xs)',
    fontWeight: 700,
    color: 'var(--color-text-secondary)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.08em',
    borderLeft: '2px solid var(--color-accent)',
    paddingLeft: 'var(--spacing-sm)',
    marginBottom: 'var(--spacing-xs)',
  },
  divider: {
    height: 1,
    backgroundColor: 'var(--color-border)',
    margin: 'var(--spacing-sm) 0',
  },
};

export default LeftPanel;
