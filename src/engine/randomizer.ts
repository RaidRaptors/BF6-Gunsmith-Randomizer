import type { Weapon, SlotConfig } from '../types/weapon';
import type { Attachment, SlotType } from '../types/attachment';
import type { Loadout, SlotSelection, GenerationMode } from '../types/loadout';
import { generateId } from '../data';
import { isBudgetTight, findCheapestAttachment } from './budget';
import { computeWeights, weightedRandomPick } from './slotWeights';

export interface GenerateParams {
  weapon: Weapon;
  attachments: Attachment[];
  lockedSelections: Map<SlotType, string | null>;
  previousLoadout?: Loadout;
  mode: GenerationMode;
}

/**
 * 核心随机生成算法
 * 六阶段：固定计算 → 槽位排序 → 逐槽加权随机 → 预算修复 → 多样性检查 → 组装
 */
export function generateLoadout(params: GenerateParams): Loadout {
  const { weapon, attachments, lockedSelections, previousLoadout, mode } = params;
  const maxBudget = weapon.maxBudget;

  // 配件索引，避免反复线性查找
  const attById = new Map<string, Attachment>();
  for (const a of attachments) attById.set(a.id, a);

  const getAtt = (id: string): Attachment | undefined => attById.get(id);

  // === 阶段1：固定点数计算 ===
  let lockedCost = 0;
  for (const [, attachmentId] of lockedSelections) {
    if (attachmentId) {
      const att = getAtt(attachmentId);
      if (att) lockedCost += att.cost;
    }
  }

  const availableBudget = Math.max(0, maxBudget - lockedCost);

  // === 阶段2：槽位排序 ===
  const unlockedSlots = sortSlots(
    weapon.slots.filter((s) => !lockedSelections.has(s.slot))
  );

  // === 阶段3：逐槽加权随机 ===
  let remainingBudget = availableBudget;
  const selections = new Map<SlotType, { attachmentId: string | null; cost: number }>();

  // 先放入锁定的选择
  for (const [slot, attachmentId] of lockedSelections) {
    const att = attachmentId ? getAtt(attachmentId) : null;
    selections.set(slot, { attachmentId, cost: att?.cost ?? 0 });
  }

  for (let i = 0; i < unlockedSlots.length; i++) {
    const slotConfig = unlockedSlots[i];
    const slotsLeft = unlockedSlots.length - i;
    const mandatory = !slotConfig.defaultEmpty;
    const candidates = getMagnifierSafeCandidates(
      slotConfig.slot,
      slotConfig,
      remainingBudget,
      getAtt,
      selections,
      lockedSelections
    );

    // 必填槽位（瞄具/弹匣/枪管，VSSM 为枪口/弹匣/瞄具）在预算内无候选时，
    // 也要填入最便宜的允许配件，绝不留空。
    if (candidates.length === 0 && mandatory) {
      const cheapest = findCheapestAttachment(
        getMagnifierSafeCandidates(
          slotConfig.slot,
          slotConfig,
          Number.MAX_SAFE_INTEGER,
          getAtt,
          selections,
          lockedSelections
        ),
        Number.MAX_SAFE_INTEGER
      );
      if (cheapest) {
        selections.set(slotConfig.slot, { attachmentId: cheapest.id, cost: cheapest.cost });
        remainingBudget -= cheapest.cost;
      } else {
        selections.set(slotConfig.slot, { attachmentId: null, cost: 0 });
      }
      continue;
    }

    // 可选槽位有小概率留空；必填槽位永不跳过
    const skipChance = mandatory
      ? 0
      : isBudgetTight(remainingBudget, slotsLeft) ? 0.10 : 0.02;

    if (candidates.length === 0 || (Math.random() < skipChance && slotsLeft > 1)) {
      selections.set(slotConfig.slot, { attachmentId: null, cost: 0 });
      continue;
    }

    // 选择策略
    const strategy = isBudgetTight(remainingBudget, slotsLeft) ? 'tight' : 'comfortable';
    const weights = computeWeights(candidates, strategy, remainingBudget);
    const chosen = weightedRandomPick(candidates, weights);

    selections.set(slotConfig.slot, {
      attachmentId: chosen.id,
      cost: chosen.cost,
    });
    remainingBudget -= chosen.cost;
  }

  // === 阶段4：预算修复 ===
  let totalCost = calculateTotal(selections);

  // 如果超过了maxBudget（理论上不会，但安全处理）
  if (totalCost > maxBudget) {
    for (const slotConfig of weapon.slots) {
      if (totalCost <= maxBudget) break;
      if (lockedSelections.has(slotConfig.slot)) continue;

      const sel = selections.get(slotConfig.slot);
      if (!sel || !sel.attachmentId) continue;

      const excess = totalCost - maxBudget;
      const currentCost = sel.cost;
      // 找更便宜的替代品
      const cheaper = findCheapestAttachment(
        getMagnifierSafeCandidates(
          slotConfig.slot,
          slotConfig,
          currentCost - 1,
          getAtt,
          selections,
          lockedSelections
        ),
        currentCost - excess - 1
      );

      if (cheaper) {
        selections.set(slotConfig.slot, { attachmentId: cheaper.id, cost: cheaper.cost });
        totalCost = calculateTotal(selections);
      } else if (!slotConfig.defaultEmpty) {
        // 必填槽位不能清空，保留现有配件
        continue;
      } else {
        // 无法替换，清空此槽
        selections.set(slotConfig.slot, { attachmentId: null, cost: 0 });
        totalCost = calculateTotal(selections);
      }
    }
  }

  // === 阶段5：多样性检查 ===
  let loadoutSelections = buildSlotSelections(weapon.slots, selections, lockedSelections);
  let retries = 0;

  while (previousLoadout && isIdentical(loadoutSelections, previousLoadout.selections) && retries < 5) {
    // 扰动：随机选1-2个未锁定槽位重新随机
    const mutableSlots = loadoutSelections.filter(
      (s) => !s.locked && s.attachmentId !== null
    );
    const toReroll = mutableSlots.slice(0, Math.min(2, mutableSlots.length));

    for (const slot of toReroll) {
      const slotConfig = weapon.slots.find((sc) => sc.slot === slot.slot);
      if (!slotConfig) continue;

      const currentCost = slot.attachmentId
        ? (getAtt(slot.attachmentId)?.cost ?? 0)
        : 0;
      const budgetForSlot = remainingBudget + currentCost;
      let candidates = getCandidates(slotConfig, budgetForSlot, getAtt);
      if (slotConfig.slot === 'sight_attachment') {
        const sightSel = loadoutSelections.find((s) => s.slot === 'sight');
        const sightAtt = sightSel?.attachmentId ? getAtt(sightSel.attachmentId) : undefined;
        if (sightAtt?.magnifierCompatible !== true) {
          candidates = candidates.filter((a) => !isMagnifier(a));
        }
      } else if (slotConfig.slot === 'sight') {
        const magnifierId = lockedSelections.get('sight_attachment');
        if (magnifierId && isMagnifier(getAtt(magnifierId))) {
          candidates = candidates.filter((a) => a.magnifierCompatible === true);
        }
      }
      candidates = candidates.filter((a) => a.id !== slot.attachmentId);

      if (candidates.length > 0) {
        const chosen = candidates[Math.floor(Math.random() * candidates.length)];
        slot.attachmentId = chosen.id;
      }
    }
    retries++;
  }

  // === 阶段5.5：放大镜兼容性最终校验 ===
  fixMagnifierConflict(loadoutSelections, getAtt);

  // === 阶段6：组装 ===
  return {
    id: generateId(),
    weaponId: weapon.id,
    weaponName: weapon.nameZh,
    categoryId: weapon.category,
    selections: loadoutSelections,
    totalCost: calculateTotalFromSelections(loadoutSelections, getAtt),
    generatedAt: Date.now(),
    mode,
  };
}

/** 获取可用候选配件 */
function getCandidates(
  slotConfig: SlotConfig,
  maxCost: number,
  getAtt: (id: string) => Attachment | undefined
): Attachment[] {
  return slotConfig.allowedAttachmentIds
    .map((id) => getAtt(id))
    .filter((a): a is Attachment => a !== undefined && a.cost <= maxCost);
}

/** 放大镜配件名 */
const MAGNIFIER_NAME = '放大镜';

/** 判断是否为放大镜（瞄准镜附件槽中的放大镜） */
function isMagnifier(a: Attachment | undefined): boolean {
  return !!a && a.slot === 'sight_attachment' && a.nameZh === MAGNIFIER_NAME;
}

/**
 * 获取符合放大镜规则的候选配件：
 * - 放大镜只能与 magnifierCompatible 的瞄具搭配；
 * - 若放大镜被锁定，瞄具只能选兼容型号。
 */
function getMagnifierSafeCandidates(
  slot: SlotType,
  slotConfig: SlotConfig,
  maxCost: number,
  getAtt: (id: string) => Attachment | undefined,
  selections: Map<SlotType, { attachmentId: string | null; cost: number }>,
  lockedSelections: Map<SlotType, string | null>
): Attachment[] {
  const candidates = getCandidates(slotConfig, maxCost, getAtt);
  if (slot === 'sight_attachment') {
    const sightId = selections.get('sight')?.attachmentId ?? null;
    const sight = sightId ? getAtt(sightId) : undefined;
    if (sight?.magnifierCompatible !== true) {
      return candidates.filter((a) => !isMagnifier(a));
    }
  } else if (slot === 'sight') {
    const magnifierId = lockedSelections.get('sight_attachment');
    if (magnifierId && isMagnifier(getAtt(magnifierId))) {
      return candidates.filter((a) => a.magnifierCompatible === true);
    }
  }
  return candidates;
}

/** 最终校验：放大镜必须搭配兼容瞄具，否则移除放大镜 */
function fixMagnifierConflict(
  selections: SlotSelection[],
  getAtt: (id: string) => Attachment | undefined
): void {
  const saSel = selections.find((s) => s.slot === 'sight_attachment');
  if (!saSel?.attachmentId) return;
  if (!isMagnifier(getAtt(saSel.attachmentId))) return;
  const sightSel = selections.find((s) => s.slot === 'sight');
  const sightAtt = sightSel?.attachmentId ? getAtt(sightSel.attachmentId) : undefined;
  if (sightAtt?.magnifierCompatible === true) return;
  // 瞄具不兼容，移除放大镜
  saSel.attachmentId = null;
}

/** 从 SlotSelection 数组计算总费用 */
function calculateTotalFromSelections(
  selections: SlotSelection[],
  getAtt: (id: string) => Attachment | undefined
): number {
  let total = 0;
  for (const s of selections) {
    if (s.attachmentId) total += getAtt(s.attachmentId)?.cost ?? 0;
  }
  return total;
}

/** 槽位排序：defaultEmpty优先 → 选择多的优先 → 便宜的优先 */
function sortSlots(slots: SlotConfig[]): SlotConfig[] {
  return [...slots].sort((a, b) => {
    // defaultEmpty 的排在后面（容易被留空）
    if (a.defaultEmpty !== b.defaultEmpty) {
      return a.defaultEmpty ? 1 : -1;
    }
    // 可选配件多的排在前面
    if (a.allowedAttachmentIds.length !== b.allowedAttachmentIds.length) {
      return b.allowedAttachmentIds.length - a.allowedAttachmentIds.length;
    }
    return 0;
  });
}

/** 计算总有费用 */
function calculateTotal(selections: Map<SlotType, { cost: number }>): number {
  let total = 0;
  for (const sel of selections.values()) {
    total += sel.cost;
  }
  return total;
}

/** 构建 SlotSelection 数组 */
function buildSlotSelections(
  slots: SlotConfig[],
  selections: Map<SlotType, { attachmentId: string | null; cost: number }>,
  lockedSelections: Map<SlotType, string | null>
): SlotSelection[] {
  return slots.map((sc) => {
    const sel = selections.get(sc.slot);
    return {
      slot: sc.slot,
      attachmentId: sel?.attachmentId ?? null,
      locked: lockedSelections.has(sc.slot),
    };
  });
}

/** 判断两个方案是否完全相同 */
function isIdentical(a: SlotSelection[], b: SlotSelection[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((sa, i) => sa.attachmentId === b[i].attachmentId);
}
