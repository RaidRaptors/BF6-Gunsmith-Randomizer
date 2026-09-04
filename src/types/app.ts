import type { Weapon, WeaponCategoryId } from './weapon';
import type { Attachment } from './attachment';
import type { Loadout, GenerationMode } from './loadout';

/** 应用全局状态 */
export interface AppState {
  // 选择状态
  mode: GenerationMode;
  selectedCategoryId: WeaponCategoryId | null;
  selectedWeaponId: string | null;

  // 运行时数据（内置种子数据）
  weapons: Weapon[];
  attachments: Attachment[];

  // 当前方案
  currentLoadout: Loadout | null;

  // 锁定槽位 (weaponId -> slotType[])
  lockedSlots: Record<string, string[]>;

  // 历史记录
  history: Loadout[];

  // UI 状态
  isGenerating: boolean;
  lastError: string | null;
}

/** Reducer Action 类型 */
export type AppAction =
  | { type: 'SET_MODE'; payload: GenerationMode }
  | { type: 'SELECT_CATEGORY'; payload: WeaponCategoryId | null }
  | { type: 'SELECT_WEAPON'; payload: string | null }
  | { type: 'GENERATE_START' }
  | { type: 'GENERATE_COMPLETE'; payload: Loadout }
  | { type: 'GENERATE_ERROR'; payload: string }
  | { type: 'TOGGLE_LOCK_SLOT'; payload: { weaponId: string; slot: string } }
  | { type: 'REROLL_UNLOCKED'; payload: Loadout }
  | { type: 'SAVE_TO_HISTORY'; payload: Loadout }
  | { type: 'LOAD_FROM_HISTORY'; payload: Loadout }
  | { type: 'CLEAR_HISTORY' };
