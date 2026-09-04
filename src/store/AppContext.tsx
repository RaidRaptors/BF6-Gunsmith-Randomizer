import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { AppState, AppAction } from '../types/app';
import { appReducer, initialState } from './appReducer';
import { actions } from './actions';

const STORAGE_KEY = 'bf6-gunsmith-state';

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  actions: typeof actions;
}

const AppContext = createContext<AppContextValue | null>(null);

/** 从 localStorage 恢复状态 */
function loadPersistedState(): Partial<AppState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const data = JSON.parse(raw);
    return {
      history: data.history || [],
      lockedSlots: data.lockedSlots || {},
    };
  } catch {
    return {};
  }
}

/** 持久化状态到 localStorage */
function persistState(state: AppState) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        history: state.history,
        lockedSlots: state.lockedSlots,
      })
    );
  } catch {
    // localStorage 不可用时静默失败
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState, (init) => ({
    ...init,
    ...loadPersistedState(),
  }));

  // 每次状态变化时持久化（localStorage 只存 history/lockedSlots）
  useEffect(() => {
    persistState(state);
  }, [state.history, state.lockedSlots]);

  return (
    <AppContext.Provider value={{ state, dispatch, actions }}>
      {children}
    </AppContext.Provider>
  );
};

/** 获取应用状态 */
export function useAppState(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useAppState must be used within AppProvider');
  }
  return ctx;
}
