import type { Weapon, WeaponCategoryId, WeaponCategoryMeta } from '../types/weapon';
import type { Attachment, SlotType } from '../types/attachment';

import categoriesData from './categories.json';
import assaultRifles from './weapons/assault-rifles.json';
import submachineGuns from './weapons/submachine-guns.json';
import carbines from './weapons/carbines.json';
import lightMachineGuns from './weapons/light-machine-guns.json';
import dmr from './weapons/dmr.json';
import sniperRifles from './weapons/sniper-rifles.json';
import shotguns from './weapons/shotguns.json';

import muzzles from './attachments/muzzles.json';
import barrels from './attachments/barrels.json';
import underbarrels from './attachments/underbarrels.json';
import magazines from './attachments/magazines.json';
import ammoTypes from './attachments/ammo-types.json';
import sights from './attachments/sights.json';
import sightAttachments from './attachments/sight-attachments.json';
import topAttachments from './attachments/top-attachments.json';
import rails from './attachments/rails.json';
import leftRails from './attachments/left-rails.json';
import ergonomics from './attachments/ergonomics.json';

/** 所有武器分类元数据 */
export const allCategories: WeaponCategoryMeta[] = categoriesData as WeaponCategoryMeta[];

/** 分类ID -> 分类元数据 */
const categoryMap = new Map<string, WeaponCategoryMeta>();
allCategories.forEach((c) => categoryMap.set(c.id, c));

/** 内置种子武器（首次启动的初始数据） */
export const seedWeapons: Weapon[] = [
  ...assaultRifles,
  ...submachineGuns,
  ...carbines,
  ...lightMachineGuns,
  ...dmr,
  ...sniperRifles,
  ...shotguns,
] as Weapon[];

/** 内置种子配件（首次启动的初始数据） */
export const seedAttachments: Attachment[] = [
  ...muzzles,
  ...barrels,
  ...underbarrels,
  ...magazines,
  ...ammoTypes,
  ...sights,
  ...sightAttachments,
  ...topAttachments,
  ...rails,
  ...leftRails,
  ...ergonomics,
] as Attachment[];

/** 获取分类元数据 */
export function getCategoryMeta(id: WeaponCategoryId): WeaponCategoryMeta | undefined {
  return categoryMap.get(id);
}

/** 从数组中获取武器 */
export function getWeapon(weapons: Weapon[], id: string): Weapon | undefined {
  return weapons.find((w) => w.id === id);
}

/** 从数组中获取配件 */
export function getAttachment(attachments: Attachment[], id: string): Attachment | undefined {
  return attachments.find((a) => a.id === id);
}

/** 按分类过滤武器 */
export function getWeaponsByCategory(weapons: Weapon[], categoryId: WeaponCategoryId): Weapon[] {
  return weapons.filter((w) => w.category === categoryId);
}

/** 按槽位过滤配件 */
export function getAttachmentsBySlot(attachments: Attachment[], slot: SlotType): Attachment[] {
  return attachments.filter((a) => a.slot === slot);
}

/** 搜索武器（中英文模糊匹配） */
export function searchWeapons(weapons: Weapon[], query: string): Weapon[] {
  const q = query.toLowerCase().trim();
  if (!q) return weapons;
  return weapons.filter(
    (w) =>
      w.nameZh.toLowerCase().includes(q) ||
      w.id.toLowerCase().includes(q) ||
      w.category.toLowerCase().includes(q)
  );
}

/** 搜索武器（在指定分类内） */
export function searchWeaponsInCategory(
  weapons: Weapon[],
  query: string,
  categoryId: WeaponCategoryId
): Weapon[] {
  const q = query.toLowerCase().trim();
  const categoryWeapons = getWeaponsByCategory(weapons, categoryId);
  if (!q) return categoryWeapons;
  return categoryWeapons.filter(
    (w) =>
      w.nameZh.toLowerCase().includes(q) ||
      w.id.toLowerCase().includes(q)
  );
}

/** 生成唯一ID */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 10);
}
