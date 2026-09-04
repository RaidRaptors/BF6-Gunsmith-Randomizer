/** 配件槽位类型 */
export type SlotType =
  | 'muzzle'
  | 'barrel'
  | 'underbarrel'
  | 'magazine'
  | 'ammo'
  | 'sight'
  | 'sight_attachment'
  | 'top'
  | 'rail'
  | 'left_rail'
  | 'ergonomics';

/** 配件数据 */
export interface Attachment {
  id: string;
  nameZh: string;
  slot: SlotType;
  cost: number;
  /** 配件图片文件名（如 "supp_std.png"），空字符串表示暂无图片 */
  image?: string;
  /** 是否兼容放大镜（仅部分 1.25x~2x 瞄具为 true） */
  magnifierCompatible?: boolean;
}

/** 槽位元数据 */
export const SLOT_META: Record<SlotType, { labelZh: string; icon: string }> = {
  muzzle:           { labelZh: '枪口',       icon: '🔇' },
  barrel:           { labelZh: '枪管',       icon: '🔫' },
  underbarrel:      { labelZh: '下握把',     icon: '👇' },
  magazine:         { labelZh: '弹匣',       icon: '📦' },
  ammo:             { labelZh: '弹药类型',   icon: '🎯' },
  sight:            { labelZh: '瞄具',       icon: '🔭' },
  sight_attachment: { labelZh: '瞄准镜附件', icon: '🔍' },
  top:              { labelZh: '顶部配件',   icon: '🔝' },
  rail:             { labelZh: '右侧配件',   icon: '💡' },
  left_rail:        { labelZh: '左侧配件',   icon: '🔦' },
  ergonomics:       { labelZh: '人体工学',   icon: '🛡️' },
};

/** 槽位显示顺序 */
export const SLOT_ORDER: SlotType[] = [
  'muzzle',
  'barrel',
  'underbarrel',
  'magazine',
  'ammo',
  'sight',
  'sight_attachment',
  'top',
  'rail',
  'left_rail',
  'ergonomics',
];
