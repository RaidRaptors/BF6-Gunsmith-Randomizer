import type { Attachment, SlotType } from '../types/attachment';

/** 计算配件列表的费用范围 */
export function getAttachmentCostRange(attachments: Attachment[]): {
  min: number;
  max: number;
  avg: number;
} {
  if (attachments.length === 0) return { min: 0, max: 0, avg: 0 };
  const costs = attachments.map((a) => a.cost);
  return {
    min: Math.min(...costs),
    max: Math.max(...costs),
    avg: Math.round(costs.reduce((a, b) => a + b, 0) / costs.length),
  };
}

/** 估算在给定预算下可以填充的槽位数量 */
export function estimateSlotFillCount(
  slots: { minCost: number }[],
  availableBudget: number
): number {
  let remaining = availableBudget;
  let filled = 0;
  const sorted = [...slots].sort((a, b) => a.minCost - b.minCost);
  for (const slot of sorted) {
    if (remaining >= slot.minCost) {
      remaining -= slot.minCost;
      filled++;
    }
  }
  return filled;
}

/** 判断预算是否紧张 */
export function isBudgetTight(remainingBudget: number, slotsRemaining: number): boolean {
  if (slotsRemaining === 0) return true;
  return remainingBudget / slotsRemaining < 20;
}

/** 计算已选配件的总费用 */
export function calculateTotalCost(
  selections: Map<SlotType, { attachmentId: string | null; cost: number }>
): number {
  let total = 0;
  for (const sel of selections.values()) {
    total += sel.cost;
  }
  return total;
}

/** 在预算约束下找到最便宜的可用配件 */
export function findCheapestAttachment(
  candidates: Attachment[],
  maxCost: number
): Attachment | null {
  const affordable = candidates.filter((a) => a.cost <= maxCost);
  if (affordable.length === 0) return null;
  return affordable.reduce((best, cur) => (cur.cost < best.cost ? cur : best));
}

/** 在预算约束下找到最贵的可用配件 */
export function findMostExpensiveAttachment(
  candidates: Attachment[],
  maxCost: number
): Attachment | null {
  const affordable = candidates.filter((a) => a.cost <= maxCost);
  if (affordable.length === 0) return null;
  return affordable.reduce((best, cur) => (cur.cost > best.cost ? cur : best));
}
