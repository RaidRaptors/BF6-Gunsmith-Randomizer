import React, { useState } from 'react';
import { useAppState } from '../../store/AppContext';
import { getCategoryMeta } from '../../data';
import { weaponImgUrl } from '../../utils/images';
import type { WeaponCategoryId } from '../../types/weapon';

/** 获取分类 emoji，找不到时返回默认值 */
function categoryEmoji(categoryId: string): string {
  const meta = getCategoryMeta(categoryId as WeaponCategoryId);
  return meta?.icon ?? '🔫';
}

const WeaponHeader: React.FC = () => {
  const { state } = useAppState();
  const loadout = state.currentLoadout;

  const [imgError, setImgError] = useState(false);

  if (!loadout) return null;

  const weapon = state.weapons.find((w) => w.id === loadout.weaponId);
  const imgSrc = weapon ? weaponImgUrl(weapon.image) : undefined;
  const showImage = Boolean(imgSrc) && !imgError;

  return (
    <div style={styles.container}>
      <div style={styles.leftSection}>
        {weapon && (
          showImage ? (
            <img
              src={imgSrc}
              alt={weapon.nameZh}
              onError={() => setImgError(true)}
              style={styles.image}
            />
          ) : (
            <span style={styles.fallbackIcon}>{categoryEmoji(loadout.categoryId)}</span>
          )
        )}
        <div style={styles.info}>
          <h2 style={styles.name}>{loadout.weaponName}</h2>
          {weapon && (
            <div style={styles.meta}>
              <span style={styles.metaItem}>{weapon.fireModes.join(' / ')}</span>
              <span style={styles.dot}>·</span>
              <span style={styles.metaItem}>{weapon.slots.length} 个改装槽位</span>
            </div>
          )}
        </div>
      </div>
      <div style={styles.costBadge}>
        <span style={styles.costLabel}>PTS</span>
        <span style={styles.costValue}>{loadout.totalCost}</span>
        <span style={styles.costMax}>/100</span>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 'var(--spacing-md) var(--spacing-lg)',
    backgroundColor: 'var(--color-bg-card)',
    border: '1px solid var(--color-border)',
    borderTop: '2px solid var(--color-accent)',
    borderRadius: 'var(--radius-lg)',
  },
  leftSection: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-md)',
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-xs)',
  },
  name: {
    fontSize: 'var(--text-xl)',
    fontWeight: 700,
    color: 'var(--color-text-primary)',
  },
  meta: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-sm)',
    fontSize: 'var(--text-sm)',
    color: 'var(--color-text-secondary)',
  },
  metaItem: {},
  dot: {
    color: 'var(--color-text-muted)',
  },
  image: {
    width: 56,
    height: 56,
    objectFit: 'contain' as const,
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'var(--color-bg-tertiary)',
    flexShrink: 0,
  },
  fallbackIcon: {
    fontSize: 40,
    textAlign: 'center' as const,
    lineHeight: '56px',
    width: 56,
    height: 56,
    flexShrink: 0,
  },
  costBadge: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 2,
    padding: 'var(--spacing-sm) var(--spacing-lg)',
    backgroundColor: 'var(--color-bg-tertiary)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--color-border)',
    boxShadow: 'inset 0 0 0 1px rgba(0, 255, 157, 0.06)',
  },
  costLabel: {
    fontSize: 'var(--text-xs)',
    fontWeight: 700,
    color: 'var(--color-text-muted)',
    fontFamily: 'var(--font-mono)',
    letterSpacing: '0.1em',
    marginRight: 'var(--spacing-xs)',
  },
  costValue: {
    fontSize: 'var(--text-2xl)',
    fontWeight: 800,
    fontFamily: 'var(--font-mono)',
    color: 'var(--color-accent)',
    textShadow: '0 0 12px rgba(0, 255, 157, 0.35)',
  },
  costMax: {
    fontSize: 'var(--text-sm)',
    color: 'var(--color-text-muted)',
    fontFamily: 'var(--font-mono)',
  },
};

export default WeaponHeader;
