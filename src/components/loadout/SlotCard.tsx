import React, { useState } from 'react';
import { useAppState } from '../../store/AppContext';
import { attachmentImgUrl } from '../../utils/images';
import { SLOT_META } from '../../types/attachment';
import type { SlotSelection } from '../../types/loadout';

interface SlotCardProps {
  selection: SlotSelection;
}

const SlotCard: React.FC<SlotCardProps> = ({ selection }) => {
  const { state, dispatch, actions } = useAppState();
  const meta = SLOT_META[selection.slot];
  const attachment = selection.attachmentId
    ? state.attachments.find((a) => a.id === selection.attachmentId)
    : null;

  const [imgError, setImgError] = useState(false);

  const handleToggleLock = () => {
    if (state.currentLoadout) {
      dispatch(actions.toggleLockSlot(state.currentLoadout.weaponId, selection.slot));
    }
  };

  const isLocked = selection.locked;
  const imgSrc = attachment ? attachmentImgUrl(attachment.image) : undefined;
  const showImage = Boolean(imgSrc) && !imgError;

  const cardClass = [
    'module-card',
    attachment ? 'module-card--filled' : 'module-card--empty',
    isLocked ? 'module-card--locked' : '',
  ]
    .join(' ')
    .trim();

  return (
    <div className={cardClass} style={styles.card}>
      <div style={styles.header}>
        <span style={{ ...styles.slotIcon, ...(attachment ? styles.slotIconFilled : {}) }}>
          {meta.icon}
        </span>
        <span style={styles.slotLabel}>{meta.labelZh}</span>
        <button
          style={{
            ...styles.lockBtn,
            ...(isLocked ? styles.lockBtnActive : {}),
          }}
          onClick={handleToggleLock}
          title={isLocked ? '解锁此槽位' : '锁定此槽位'}
        >
          {isLocked ? '🔒' : '🔓'}
        </button>
      </div>

      <div style={styles.body}>
        {attachment ? (
          <>
            {showImage ? (
              <img
                src={imgSrc}
                alt={attachment.nameZh}
                onError={() => setImgError(true)}
                style={styles.image}
              />
            ) : (
              <span style={styles.fallbackIcon}>{meta.icon}</span>
            )}
            <span style={styles.attName}>{attachment.nameZh}</span>
            <div style={styles.footer}>
              <span style={styles.attCost}>{attachment.cost}点</span>
            </div>
          </>
        ) : (
          <>
            <span style={styles.fallbackIcon}>{meta.icon}</span>
            <span style={styles.emptyText}>空</span>
          </>
        )}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  card: {
    display: 'flex',
    flexDirection: 'column',
    padding: 'var(--spacing-md)',
    minHeight: 100,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-sm)',
    marginBottom: 'var(--spacing-sm)',
  },
  slotIcon: {
    fontSize: 14,
    transition: 'color var(--transition-fast)',
  },
  slotIconFilled: {
    color: 'var(--color-accent)',
  },
  slotLabel: {
    fontSize: 'var(--text-xs)',
    fontWeight: 600,
    color: 'var(--color-text-muted)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    flex: 1,
  },
  lockBtn: {
    fontSize: 12,
    padding: 2,
    opacity: 0.4,
    transition: 'opacity var(--transition-fast)',
    borderRadius: 'var(--radius-sm)',
  },
  lockBtnActive: {
    opacity: 1,
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-xs)',
    flex: 1,
    justifyContent: 'center',
  },
  attName: {
    fontSize: 'var(--text-base)',
    fontWeight: 600,
    color: 'var(--color-text-primary)',
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
  attCost: {
    fontSize: 'var(--text-sm)',
    fontWeight: 700,
    color: 'var(--color-accent)',
    fontFamily: 'var(--font-mono)',
  },
  emptyText: {
    fontSize: 'var(--text-base)',
    color: 'var(--color-text-muted)',
    fontStyle: 'italic',
  },
  image: {
    width: 48,
    height: 48,
    objectFit: 'contain' as const,
    borderRadius: 'var(--radius-sm)',
    backgroundColor: 'var(--color-bg-tertiary)',
    alignSelf: 'center',
  },
  fallbackIcon: {
    fontSize: 32,
    textAlign: 'center' as const,
    lineHeight: '48px',
  },
};

export default SlotCard;
