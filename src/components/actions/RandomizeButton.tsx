import React, { useEffect, useCallback } from 'react';
import { useRandomizer } from '../../hooks/useRandomizer';
import { useAppState } from '../../store/AppContext';

const RandomizeButton: React.FC = () => {
  const { randomize, isGenerating } = useRandomizer();
  const { state } = useAppState();

  // 三种模式均可随机：按分类随机未选分类时自动随机分类；指定枪械未选武器时自动随机武器。
  // 仅生成过程中禁用。
  const isReady = !isGenerating;

  // 键盘快捷键
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'r' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        // 不在输入框中时触发
        const target = e.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;
        if (isReady) {
          randomize();
        }
      }
    },
    [randomize, isReady]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <button
      className="btn btn--primary"
      style={styles.btn}
      disabled={!isReady}
      onClick={randomize}
    >
      🎲 随机生成
    </button>
  );
};

const styles: Record<string, React.CSSProperties> = {
  btn: {
    fontWeight: 700,
    fontSize: 'var(--text-sm)',
    padding: 'var(--spacing-sm) var(--spacing-lg)',
    letterSpacing: '0.03em',
    boxShadow: 'var(--glow-accent)',
  },
};

export default RandomizeButton;
