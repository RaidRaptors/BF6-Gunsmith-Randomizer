import React from 'react';
import { useAppState } from '../../store/AppContext';
import { allCategories } from '../../data';
import type { WeaponCategoryId } from '../../types/weapon';

const CategoryList: React.FC = () => {
  const { state, dispatch, actions } = useAppState();

  return (
    <div style={styles.container}>
      {allCategories.map((cat) => (
        <button
          key={cat.id}
          style={{
            ...styles.item,
            ...(state.selectedCategoryId === cat.id ? styles.itemActive : {}),
          }}
          onClick={(e) => {
            e.currentTarget.blur();
            dispatch(actions.selectCategory(cat.id as WeaponCategoryId));
          }}
        >
          <span style={styles.icon}>{cat.icon}</span>
          <span style={styles.name}>{cat.nameZh}</span>
        </button>
      ))}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-sm)',
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
  icon: {
    fontSize: 16,
  },
  name: {
    fontWeight: 500,
  },
};

export default CategoryList;
