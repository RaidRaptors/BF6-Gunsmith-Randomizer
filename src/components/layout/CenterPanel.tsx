import React from 'react';
import WeaponHeader from '../loadout/WeaponHeader';
import SlotGrid from '../loadout/SlotGrid';
import { useAppState } from '../../store/AppContext';
import { useRandomizer } from '../../hooks/useRandomizer';

const CenterPanel: React.FC = () => {
  const { state } = useAppState();
  const { randomize, isGenerating } = useRandomizer();
  const loadout = state.currentLoadout;

  return (
    <div style={styles.panel}>
      {loadout ? (
        <div className="fade-in" style={styles.content}>
          <WeaponHeader />
          <SlotGrid />
        </div>
      ) : (
        <div style={styles.empty}>
          <div style={styles.emptyIcon}>🎯</div>
          <h2 style={styles.emptyTitle}>战地6 枪械随机改装生成器</h2>
          <p style={styles.emptyText}>
            {state.mode === 'full'
              ? '点击右上角「随机生成」来随机一把武器及改装方案'
              : state.mode === 'category'
              ? '可选一个分类，或直接「随机生成」随机分类+武器'
              : '可选一把武器，或直接「随机生成」随机武器'}
          </p>
          <button className="hint-btn" onClick={randomize} disabled={isGenerating}>
            <span className="key">R</span> 快速随机
          </button>
        </div>
      )}

      {state.isGenerating && (
        <div style={styles.overlay}>
          <div style={styles.spinner} />
          <span>生成中...</span>
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  panel: {
    position: 'relative',
    backgroundColor: 'var(--color-bg-primary)',
    padding: 'var(--spacing-xl)',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  content: {
    width: '100%',
    maxWidth: 720,
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-lg)',
  },
  empty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    textAlign: 'center' as const,
    maxWidth: 400,
  },
  emptyIcon: {
    fontSize: 56,
    lineHeight: '112px',
    width: 112,
    height: 112,
    textAlign: 'center' as const,
    marginBottom: 'var(--spacing-lg)',
    backgroundColor: 'var(--tint-accent)',
    border: '1px solid var(--color-border-highlight)',
    borderRadius: 'var(--radius-xl)',
    boxShadow: 'inset 0 0 20px rgba(0, 255, 157, 0.06)',
  },
  emptyTitle: {
    fontSize: 'var(--text-xl)',
    fontWeight: 800,
    color: 'var(--color-text-primary)',
    letterSpacing: '0.02em',
    marginBottom: 'var(--spacing-sm)',
  },
  emptyText: {
    fontSize: 'var(--text-base)',
    color: 'var(--color-text-secondary)',
    lineHeight: 1.6,
    marginBottom: 'var(--spacing-lg)',
  },
  overlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(10, 14, 11, 0.72)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--spacing-md)',
    color: 'var(--color-text-secondary)',
    zIndex: 10,
  },
  spinner: {
    width: 32,
    height: 32,
    border: '3px solid var(--color-border)',
    borderTopColor: 'var(--color-accent)',
    borderRadius: '50%',
    animation: 'spin 0.6s linear infinite',
  },
};

// 添加动画样式
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default CenterPanel;
