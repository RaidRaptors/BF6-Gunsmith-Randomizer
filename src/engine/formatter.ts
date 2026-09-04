import type { Loadout, SlotSelection } from '../types/loadout';
import type { Attachment } from '../types/attachment';
import type { Weapon } from '../types/weapon';
import { SLOT_META } from '../types/attachment';
import { getWeapon, getAttachment } from '../data';

/** 将方案格式化为可读文本（用于复制） */
export function formatLoadoutAsText(
  loadout: Loadout,
  weapons: Weapon[],
  attachments: Attachment[]
): string {
  const weapon = getWeapon(weapons, loadout.weaponId);
  const lines: string[] = [];

  lines.push('═══════════════════════════════');
  lines.push(`  武器：${loadout.weaponName}`);
  if (weapon) {
    lines.push(`  射速模式：${weapon.fireModes.join(' / ')}`);
  }
  lines.push(`  总点数：${loadout.totalCost} / 100`);
  lines.push('───────────────────────────────');

  for (const selection of loadout.selections) {
    const meta = SLOT_META[selection.slot];
    const attachment = selection.attachmentId ? getAttachment(attachments, selection.attachmentId) : null;

    if (attachment) {
      const lockIcon = selection.locked ? '🔒' : '  ';
      lines.push(
        `  ${lockIcon} ${meta.labelZh.padEnd(6, '　')}│ ${attachment.nameZh.padEnd(14, ' ')} │ ${attachment.cost}点`
      );
    } else {
      lines.push(`     ${meta.labelZh.padEnd(6, '　')}│ (空)                  │ 0点`);
    }
  }

  lines.push('───────────────────────────────');
  lines.push(`  生成时间：${new Date(loadout.generatedAt).toLocaleString('zh-CN')}`);
  lines.push('═══════════════════════════════');

  return lines.join('\n');
}

/** 将方案转为简洁格式 */
export function formatLoadoutCompact(loadout: Loadout, attachments: Attachment[]): string {
  const parts: string[] = [];
  parts.push(`[${loadout.weaponName}]`);

  for (const sel of loadout.selections) {
    if (sel.attachmentId) {
      const att = getAttachment(attachments, sel.attachmentId);
      const meta = SLOT_META[sel.slot];
      parts.push(`${meta.labelZh}:${att?.nameZh ?? sel.attachmentId}`);
    }
  }

  parts.push(`${loadout.totalCost}/100`);
  return parts.join(' ');
}
