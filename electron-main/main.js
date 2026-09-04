const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const fs = require('fs');

// Detect dev mode: if dist/ doesn't exist, we're in development
const isDev = !fs.existsSync(path.join(__dirname, '../dist/renderer/index.html'));

function createWindow() {
  // 移除默认应用菜单栏（File/Edit/View 等）
  Menu.setApplicationMenu(null);

  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 720,
    title: '战地6 枪械随机改装生成器',
    backgroundColor: '#0d1117',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (isDev) {
    win.loadURL('http://localhost:5173');
    win.webContents.openDevTools({ mode: 'detach' });
  } else {
    win.loadFile(path.join(__dirname, '../dist/renderer/index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
