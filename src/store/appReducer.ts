import type { AppState, AppAction } from '../types/app';
import { seedWeapons, seedAttachments } from '../data';

const MAX_HISTORY_SIZE = 50;

export const initialState: AppState = {
  mode: 'full',
  selectedCategoryId: null,
  selectedWeaponId: null,
  weapons: seedWeapons,
  attachments: seedAttachments,
  currentLoadout: null,
  lockedSlots: {},
  history: [],
  isGenerating: false,
  lastError: null,
};

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_MODE':
      return {
        ...state,
        mode: action.payload,
        // 切换模式时保留当前结果与已选分类/武器：
        // 允许用户随时切换到其他模式并重新生成，选择会随模式保留。
      };

    case 'SELECT_CATEGORY':
      return {
        ...state,
        selectedCategoryId: action.payload,
        selectedWeaponId: null,
      };

    case 'SELECT_WEAPON':
      return {
        ...state,
        selectedWeaponId: action.payload,
      };

    case 'GENERATE_START':
      return {
        ...state,
        isGenerating: true,
        lastError: null,
      };

    case 'GENERATE_COMPLETE':
      return {
        ...state,
        isGenerating: false,
        currentLoadout: action.payload,
        lastError: null,
      };

    case 'GENERATE_ERROR':
      return {
        ...state,
        isGenerating: false,
        lastError: action.payload,
      };

    case 'TOGGLE_LOCK_SLOT': {
      const { weaponId, slot } = action.payload;
      const current = state.lockedSlots[weaponId] || [];
      const isLocked = current.includes(slot);

      let newLocked: string[];
      if (isLocked) {
        newLocked = current.filter((s) => s !== slot);
      } else {
        newLocked = [...current, slot];
      }

      // 更新 currentLoadout 中该槽位的锁定状态
      let updatedLoadout = state.currentLoadout;
      if (updatedLoadout) {
        updatedLoadout = {
          ...updatedLoadout,
          selections: updatedLoadout.selections.map((sel) =>
            sel.slot === slot ? { ...sel, locked: !isLocked } : sel
          ),
        };
      }

      return {
        ...state,
        lockedSlots: {
          ...state.lockedSlots,
          [weaponId]: newLocked.length > 0 ? newLocked : [],
        },
        currentLoadout: updatedLoadout,
      };
    }

    case 'REROLL_UNLOCKED':
      return {
        ...state,
        currentLoadout: action.payload,
        lastError: null,
      };

    case 'SAVE_TO_HISTORY': {
      const exists = state.history.findIndex((h) => h.id === action.payload.id);
      let newHistory: typeof state.history;
      if (exists >= 0) {
        newHistory = [
          action.payload,
          ...state.history.slice(0, exists),
          ...state.history.slice(exists + 1),
        ];
      } else {
        newHistory = [action.payload, ...state.history];
      }
      if (newHistory.length > MAX_HISTORY_SIZE) {
        newHistory = newHistory.slice(0, MAX_HISTORY_SIZE);
      }
      return { ...state, history: newHistory };
    }

    case 'LOAD_FROM_HISTORY':
      return {
        ...state,
        currentLoadout: action.payload,
        selectedWeaponId: action.payload.weaponId,
        selectedCategoryId: action.payload.categoryId as AppState['selectedCategoryId'],
      };

    case 'CLEAR_HISTORY':
      return {
        ...state,
        history: [],
      };

    default:
      return state;
  }
}
