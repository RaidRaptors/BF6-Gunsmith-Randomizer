import { useCallback } from 'react';
import { useAppState } from '../store/AppContext';
import type { Loadout } from '../types/loadout';

export function useHistory() {
  const { state, dispatch, actions } = useAppState();

  const saveToHistory = useCallback(
    (loadout: Loadout) => {
      dispatch(actions.saveToHistory(loadout));
    },
    [dispatch, actions]
  );

  const loadFromHistory = useCallback(
    (loadout: Loadout) => {
      dispatch(actions.loadFromHistory(loadout));
    },
    [dispatch, actions]
  );

  const clearHistory = useCallback(() => {
    dispatch(actions.clearHistory());
  }, [dispatch, actions]);

  return {
    history: state.history,
    saveToHistory,
    loadFromHistory,
    clearHistory,
  };
}
