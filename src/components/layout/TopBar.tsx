import React from 'react';
import { useAppState } from '../../store/AppContext';
import { getCategoryMeta, getWeapon } from '../../data';
import RandomizeButton from '../actions/RandomizeButton';
import CopyButton from '../actions/CopyButton';
import SaveButton from '../actions/SaveButton';

/** 顶部战术状态条（HUD 读数）：显示当前模式/分类/武器 */
function statusText(state: ReturnType<typeof useAppState>['state']): string {
  if (state.mode === 'full') return 'MODE // 完全随机';
  if (state.mode === 'category') {
    if (state.selectedCategoryId) {
      const cat = getCategoryMeta(state.selectedCategoryId);
      return `CATEGORY // ${cat?.nameZh ?? state.selectedCategoryId}`;
    }
    return 'CATEGORY // —';
  }
  if (state.selectedWeaponId) {
    const w = getWeapon(state.weapons, state.selectedWeaponId);
    return `WEAPON // ${w?.nameZh ?? state.selectedWeaponId}`;
  }
  return 'WEAPON // —';
}

const TopBar: React.FC = () => {
  const { state } = useAppState();

  return (
    <div style={styles.container}>
      <div style={styles.left}>
        <span style={styles.brandMark} />
        <h1 style={styles.title}>战地6 枪械随机改装</h1>
      </div>
      <div style={styles.center}>
        <span style={styles.status}>{statusText(state)}</span>
      </div>
      <div style={styles.right}>
        <RandomizeButton />
        <CopyButton />
        <SaveButton />
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-lg)',
    padding: 'var(--spacing-sm) var(--spacing-lg)',
    backgroundColor: 'var(--color-bg-secondary)',
    borderBottom: '1px solid var(--color-border)',
    minHeight: 60,
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-sm)',
    flex: '0 0 auto',
  },
  center: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-sm)',
    flex: '0 0 auto',
  },
  title: {
    fontSize: 'var(--text-lg)',
    fontWeight: 800,
    color: 'var(--color-text-primary)',
    letterSpacing: '0.02em',
    whiteSpace: 'nowrap' as const,
  },
  brandMark: {
    width: 8,
    height: 8,
    backgroundColor: 'var(--color-accent)',
    boxShadow: 'var(--glow-accent)',
    flexShrink: 0,
  },
  status: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-xs)',
    letterSpacing: '0.12em',
    color: 'var(--color-text-muted)',
    textTransform: 'uppercase' as const,
    whiteSpace: 'nowrap' as const,
  },
};

export default TopBar;
