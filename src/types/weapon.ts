import type { SlotType } from './attachment';

/** 武器分类ID */
export type WeaponCategoryId =
  | 'assault_rifle'
  | 'submachine_gun'
  | 'carbine'
  | 'light_machine_gun'
  | 'dmr'
  | 'sniper_rifle'
  | 'shotgun';

/** 武器分类元数据 */
export interface WeaponCategoryMeta {
  id: WeaponCategoryId;
  nameZh: string;
  icon: string;
  order: number;
}

/** 单个槽位的配置 */
export interface SlotConfig {
  slot: SlotType;
  allowedAttachmentIds: string[];
  defaultEmpty: boolean;
}

/** 武器数据 */
export interface Weapon {
  id: string;
  nameZh: string;
  category: WeaponCategoryId;
  maxBudget: number;
  slots: SlotConfig[];
  fireModes: string[];
  /** 武器图片文件名（如 "m5a3.png"），空字符串表示暂无图片 */
  image?: string;
}
