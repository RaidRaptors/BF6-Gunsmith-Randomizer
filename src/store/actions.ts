import type { AppAction } from '../types/app';
import type { Loadout } from '../types/loadout';
import type { GenerationMode } from '../types/loadout';
import type { WeaponCategoryId } from '../types/weapon';

/** Action 类型常量 */
export const ActionTypes = {
  SET_MODE: 'SET_MODE',
  SELECT_CATEGORY: 'SELECT_CATEGORY',
  SELECT_WEAPON: 'SELECT_WEAPON',
  GENERATE_START: 'GENERATE_START',
  GENERATE_COMPLETE: 'GENERATE_COMPLETE',
  GENERATE_ERROR: 'GENERATE_ERROR',
  TOGGLE_LOCK_SLOT: 'TOGGLE_LOCK_SLOT',
  REROLL_UNLOCKED: 'REROLL_UNLOCKED',
  SAVE_TO_HISTORY: 'SAVE_TO_HISTORY',
  LOAD_FROM_HISTORY: 'LOAD_FROM_HISTORY',
  CLEAR_HISTORY: 'CLEAR_HISTORY',
} as const;

/** Action 创建函数 */
export const actions = {
  setMode: (mode: GenerationMode): AppAction =>
    ({ type: 'SET_MODE', payload: mode }),

  selectCategory: (categoryId: WeaponCategoryId | null): AppAction =>
    ({ type: 'SELECT_CATEGORY', payload: categoryId }),

  selectWeapon: (weaponId: string | null): AppAction =>
    ({ type: 'SELECT_WEAPON', payload: weaponId }),

  generateStart: (): AppAction =>
    ({ type: 'GENERATE_START' }),

  generateComplete: (loadout: Loadout): AppAction =>
    ({ type: 'GENERATE_COMPLETE', payload: loadout }),

  generateError: (error: string): AppAction =>
    ({ type: 'GENERATE_ERROR', payload: error }),

  toggleLockSlot: (weaponId: string, slot: string): AppAction =>
    ({ type: 'TOGGLE_LOCK_SLOT', payload: { weaponId, slot } }),

  rerollUnlocked: (loadout: Loadout): AppAction =>
    ({ type: 'REROLL_UNLOCKED', payload: loadout }),

  saveToHistory: (loadout: Loadout): AppAction =>
    ({ type: 'SAVE_TO_HISTORY', payload: loadout }),

  loadFromHistory: (loadout: Loadout): AppAction =>
    ({ type: 'LOAD_FROM_HISTORY', payload: loadout }),

  clearHistory: (): AppAction =>
    ({ type: 'CLEAR_HISTORY' }),
};
