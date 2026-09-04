import type { SlotType } from './attachment';

/** 生成模式 */
export type GenerationMode = 'full' | 'category' | 'specific';

/** 单个槽位的选择结果 */
export interface SlotSelection {
  slot: SlotType;
  attachmentId: string | null;
  locked: boolean;
}

/** 改装方案 */
export interface Loadout {
  id: string;
  weaponId: string;
  weaponName: string;
  categoryId: string;
  selections: SlotSelection[];
  totalCost: number;
  generatedAt: number;
  mode: GenerationMode;
}
