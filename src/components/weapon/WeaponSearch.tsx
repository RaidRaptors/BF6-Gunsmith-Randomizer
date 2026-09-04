import React, { useState, useCallback } from 'react';

interface WeaponSearchProps {
  onSearch?: (query: string) => void;
}

const WeaponSearch: React.FC<WeaponSearchProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      setQuery(v);
      onSearch?.(v);
    },
    [onSearch]
  );

  return (
    <div style={styles.container}>
      <span style={styles.icon}>🔍</span>
      <input
        className="input"
        style={styles.input}
        type="text"
        placeholder="搜索武器名称..."
        value={query}
        onChange={handleChange}
      />
      {query && (
        <button
          style={styles.clear}
          onClick={() => {
            setQuery('');
            onSearch?.('');
          }}
        >
          ✕
        </button>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    position: 'absolute',
    left: 10,
    fontSize: 12,
    pointerEvents: 'none',
    zIndex: 1,
  },
  input: {
    paddingLeft: 30,
    paddingRight: 30,
  },
  clear: {
    position: 'absolute',
    right: 6,
    fontSize: 'var(--text-xs)',
    color: 'var(--color-text-muted)',
    padding: 4,
    borderRadius: '50%',
    lineHeight: 1,
  },
};

export default WeaponSearch;
