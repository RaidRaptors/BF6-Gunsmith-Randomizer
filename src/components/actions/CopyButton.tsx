import React from 'react';
import { useAppState } from '../../store/AppContext';
import { useClipboard } from '../../hooks/useClipboard';
import { formatLoadoutAsText } from '../../engine/formatter';

const CopyButton: React.FC = () => {
  const { state } = useAppState();
  const { copyText, copied } = useClipboard();

  const handleCopy = () => {
    if (state.currentLoadout) {
      const text = formatLoadoutAsText(state.currentLoadout, state.weapons, state.attachments);
      copyText(text);
    }
  };

  return (
    <button
      className="btn btn--secondary"
      disabled={!state.currentLoadout}
      onClick={handleCopy}
      title="复制方案到剪贴板"
    >
      {copied ? '✅ 已复制' : '📋 复制'}
    </button>
  );
};

export default CopyButton;
