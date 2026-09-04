import type { Attachment } from '../types/attachment';

/** 权重计算策略 */
export type WeightStrategy = 'tight' | 'comfortable' | 'variety';

/** 为配件列表计算权重 */
export function computeWeights(
  attachments: Attachment[],
  strategy: WeightStrategy,
  _remainingBudget: number
): number[] {
  switch (strategy) {
    case 'tight':
      // 预算紧张：强烈偏向便宜配件 (权重 = 1 / cost²)
      return attachments.map((a) => 1 / (a.cost * a.cost));
    case 'comfortable':
      // 预算充裕：轻微偏向便宜配件 (权重 = 1 / cost)
      return attachments.map((a) => 1 / a.cost);
    case 'variety':
      // 多样性模式：忽略cost差异，均匀随机
      return attachments.map(() => 1);
  }
}

/** 加权随机选取 */
export function weightedRandomPick<T>(items: T[], weights: number[]): T {
  if (items.length === 0) throw new Error('Cannot pick from empty array');
  if (items.length === 1) return items[0];

  const totalWeight = weights.reduce((a, b) => a + b, 0);
  if (totalWeight <= 0) {
    // 所有权重为0或负数，均匀随机
    return items[Math.floor(Math.random() * items.length)];
  }

  let r = Math.random() * totalWeight;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r <= 0) return items[i];
  }
  return items[items.length - 1];
}

/** 随机打乱数组 */
export function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
