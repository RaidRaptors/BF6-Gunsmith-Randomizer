import React from 'react';
import TopBar from './TopBar';
import LeftPanel from './LeftPanel';
import CenterPanel from './CenterPanel';
import BottomHistory from './BottomHistory';

const AppShell: React.FC = () => {
  return (
    <div style={styles.shell}>
      <TopBar />
      <div style={styles.main}>
        <LeftPanel />
        <CenterPanel />
      </div>
      <BottomHistory />
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  shell: {
    display: 'grid',
    gridTemplateRows: 'auto 1fr auto',
    height: '100vh',
    overflow: 'hidden',
    backgroundColor: 'var(--color-bg-primary)',
  },
  main: {
    display: 'grid',
    gridTemplateColumns: '280px 1fr',
    overflow: 'hidden',
    gap: '1px',
    backgroundColor: 'var(--color-border)',
  },
};

export default AppShell;
