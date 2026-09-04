import { useCallback } from 'react';
import { useAppState } from '../store/AppContext';
import { getWeapon, getWeaponsByCategory } from '../data';
import { generateLoadout } from '../engine/randomizer';
import type { Weapon } from '../types/weapon';
import type { SlotType } from '../types/attachment';
import type { GenerationMode } from '../types/loadout';

/**
 * 随机生成编排 hook
 * 根据当前state（模式、选择、锁定、预算）调用生成引擎
 */
export function useRandomizer() {
  const { state, dispatch, actions } = useAppState();

  const randomize = useCallback(() => {
    dispatch(actions.generateStart());

    try {
      // 1. 确定目标武器
      const weapon = selectWeapon(
        state.mode,
        state.selectedCategoryId,
        state.selectedWeaponId,
        state.weapons
      );
      if (!weapon) {
        dispatch(actions.generateError('请先选择武器或分类'));
        return;
      }

      // 2. 构建锁定设置
      const lockedSlotNames = state.lockedSlots[weapon.id] || [];
      const lockedSelections = new Map<SlotType, string | null>();

      if (state.currentLoadout && state.currentLoadout.weaponId === weapon.id) {
        for (const sel of state.currentLoadout.selections) {
          if (sel.locked) {
            lockedSelections.set(sel.slot, sel.attachmentId);
          }
        }
      }
      // 也处理 lockedSlots 中但不在 currentLoadout 的情况
      for (const slotName of lockedSlotNames) {
        if (!lockedSelections.has(slotName as SlotType)) {
          lockedSelections.set(slotName as SlotType, null);
        }
      }

      // 3. 生成
      const loadout = generateLoadout({
        weapon,
        attachments: state.attachments,
        lockedSelections,
        previousLoadout: state.currentLoadout ?? undefined,
        mode: state.mode,
      });

      dispatch(actions.generateComplete(loadout));
    } catch (err) {
      dispatch(actions.generateError(err instanceof Error ? err.message : '生成失败'));
    }
  }, [state, dispatch, actions]);

  return { randomize, isGenerating: state.isGenerating, lastError: state.lastError };
}

/** 根据模式和选择状态选出一把武器（未选择时自动随机兜底，保证始终可生成） */
function selectWeapon(
  mode: GenerationMode,
  categoryId: string | null,
  weaponId: string | null,
  weapons: Weapon[]
): Weapon | null {
  switch (mode) {
    case 'full':
      // 完全随机：从所有武器中选
      return weapons[Math.floor(Math.random() * weapons.length)] || null;

    case 'category': {
      // 按分类随机：优先用已选分类；未选则随机挑一个含武器的分类
      const availableCats = [...new Set(weapons.map((w) => w.category))];
      const chosenCat =
        categoryId && weapons.some((w) => w.category === categoryId)
          ? categoryId
          : availableCats[Math.floor(Math.random() * availableCats.length)];
      if (!chosenCat) return null;
      const categoryWeapons = getWeaponsByCategory(weapons, chosenCat as Weapon['category']);
      return categoryWeapons.length > 0
        ? categoryWeapons[Math.floor(Math.random() * categoryWeapons.length)]
        : null;
    }

    case 'specific':
      // 指定武器：优先用已选武器；未选则从所有武器随机一把
      if (weaponId) {
        return getWeapon(weapons, weaponId) || null;
      }
      return weapons[Math.floor(Math.random() * weapons.length)] || null;

    default:
      return null;
  }
}
