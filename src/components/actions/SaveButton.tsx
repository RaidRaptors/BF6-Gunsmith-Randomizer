import React, { useState } from 'react';
import { useAppState } from '../../store/AppContext';
import { useHistory } from '../../hooks/useHistory';

const SaveButton: React.FC = () => {
  const { state } = useAppState();
  const { saveToHistory } = useHistory();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (state.currentLoadout) {
      saveToHistory(state.currentLoadout);
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    }
  };

  return (
    <button
      className="btn btn--secondary"
      disabled={!state.currentLoadout}
      onClick={handleSave}
      title="保存到历史记录"
    >
      {saved ? '💾 已保存' : '💾 保存'}
    </button>
  );
};

export default SaveButton;
