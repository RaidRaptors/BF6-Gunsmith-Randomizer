import React, { useState } from 'react';
import { useAppState } from '../../store/AppContext';
import { searchWeaponsInCategory, getWeaponsByCategory } from '../../data';
import WeaponSearch from './WeaponSearch';
import type { Weapon } from '../../types/weapon';

const WeaponList: React.FC = () => {
  const { state, dispatch, actions } = useAppState();
  const [searchQuery, setSearchQuery] = useState('');

  const weapons = getFilteredWeapons(
    state.mode,
    state.selectedCategoryId,
    searchQuery,
    state.weapons
  );

  const handleSelect = (weapon: Weapon, e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.currentTarget.blur();
    dispatch(actions.selectWeapon(weapon.id));
  };

  return (
    <div style={styles.container}>
      {state.mode === 'specific' && (
        <WeaponSearch onSearch={setSearchQuery} />
      )}
      <div style={styles.list}>
        {weapons.length === 0 ? (
          <div style={styles.noResults}>未找到匹配的武器</div>
        ) : (
          weapons.map((weapon) => (
            <button
              key={weapon.id}
              style={{
                ...styles.item,
                ...(state.selectedWeaponId === weapon.id ? styles.itemActive : {}),
              }}
              onClick={(e) => handleSelect(weapon, e)}
            >
              <div style={styles.itemInfo}>
                <span style={styles.weaponName}>{weapon.nameZh}</span>
                <span style={styles.weaponMeta}>
                  {weapon.fireModes.join('/')}
                </span>
              </div>
              <span style={styles.slotCount}>{weapon.slots.length}槽</span>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

function getFilteredWeapons(
  mode: string,
  categoryId: string | null,
  query: string,
  weapons: Weapon[]
): Weapon[] {
  if (mode === 'full') {
    return weapons;
  }
  if (mode === 'category' && categoryId) {
    return getWeaponsByCategory(weapons, categoryId as Weapon['category']);
  }
  if (mode === 'specific') {
    if (categoryId) {
      return searchWeaponsInCategory(weapons, query, categoryId as Weapon['category']);
    }
    return weapons.filter((w) =>
      w.nameZh.toLowerCase().includes(query.toLowerCase())
    );
  }
  return [];
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-sm)',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    maxHeight: 300,
    overflowY: 'auto',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 'var(--spacing-sm) var(--spacing-md)',
    borderRadius: 'var(--radius-sm)',
    backgroundColor: 'transparent',
    border: '1px solid transparent',
    fontSize: 'var(--text-sm)',
    color: 'var(--color-text-secondary)',
    transition: 'all var(--transition-fast)',
    textAlign: 'left' as const,
  },
  itemActive: {
    backgroundColor: 'var(--tint-accent)',
    borderColor: 'var(--color-accent)',
    color: 'var(--color-text-primary)',
  },
  itemInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  weaponName: {
    fontWeight: 600,
    fontSize: 'var(--text-sm)',
  },
  weaponMeta: {
    fontSize: 'var(--text-xs)',
    color: 'var(--color-text-muted)',
  },
  slotCount: {
    fontSize: 'var(--text-xs)',
    color: 'var(--color-text-muted)',
    backgroundColor: 'var(--color-bg-primary)',
    padding: '2px 8px',
    borderRadius: 'var(--radius-sm)',
  },
  noResults: {
    textAlign: 'center' as const,
    color: 'var(--color-text-muted)',
    fontSize: 'var(--text-sm)',
    padding: 'var(--spacing-lg)',
  },
};

export default WeaponList;
