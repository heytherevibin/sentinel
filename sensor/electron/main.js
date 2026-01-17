const { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage } = require('electron');
const path = require('path');
const SensorManager = require('./sensor-manager.js');

let mainWindow;
let settingsWindow;
let tray;
let sensorManager;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 820,
    height: 640,
    minWidth: 760,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    titleBarStyle: 'default',
    backgroundColor: '#151412',
    frame: true,
    show: false, // Don't show window on creation
    autoHideMenuBar: false,
  });

  // Load the app
  // Check if running from source (dev mode) or built app
  const isDev = !app.isPackaged || process.env.NODE_ENV === 'development';
  
  if (isDev) {
    // In development, wait a bit for Vite dev server to start
    setTimeout(() => {
      mainWindow.loadURL('http://localhost:5173').catch(() => {
        console.log('Waiting for Vite dev server...');
        setTimeout(() => {
          mainWindow.loadURL('http://localhost:5173');
        }, 2000);
      });
    }, 1000);
    // Don't auto-open DevTools in menu bar mode
    // Uncomment the next line to debug production issues:
    // mainWindow.webContents.openDevTools();
  } else {
    // In production, __dirname points to the Resources/app.asar/electron directory
    // The dist folder is at Resources/app.asar/dist
    const indexPath = path.join(__dirname, '../dist/index.html');
    
    // Enable DevTools for debugging
    mainWindow.webContents.openDevTools();
    
    mainWindow.loadFile(indexPath).catch((error) => {
      console.error('Failed to load index.html:', error);
      // Fallback: try alternative path
      mainWindow.loadFile(path.join(app.getAppPath(), 'dist/index.html')).catch((err) => {
        console.error('Failed to load from app path:', err);
      });
    });
  }

  // Hide window instead of closing it
  mainWindow.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function createSettingsWindow() {
  if (settingsWindow) {
    settingsWindow.focus();
    return;
  }

  settingsWindow = new BrowserWindow({
    width: 500,
    height: 400,
    minWidth: 400,
    minHeight: 300,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    titleBarStyle: 'default',
    backgroundColor: '#151412',
    frame: true,
    show: false,
    parent: mainWindow,
    modal: false,
  });

  const isDev = !app.isPackaged || process.env.NODE_ENV === 'development';
  
  if (isDev) {
    settingsWindow.loadURL('http://localhost:5173/#/settings');
  } else {
    settingsWindow.loadFile(path.join(__dirname, '../dist/index.html'), {
      hash: 'settings'
    });
  }

  settingsWindow.once('ready-to-show', () => {
    settingsWindow.show();
  });

  settingsWindow.on('closed', () => {
    settingsWindow = null;
  });
}

function showTelemetryWindow() {
  if (!mainWindow) {
    createWindow();
  }
  
  if (mainWindow.isVisible()) {
    mainWindow.focus();
  } else {
    // Center window on screen
    mainWindow.center();
    mainWindow.show();
  }
}

function showSettingsWindow() {
  createSettingsWindow();
}

function createTrayIcon() {
  // Try to load from file first
  let iconPath;
  if (process.platform === 'darwin') {
    iconPath = path.join(__dirname, '../assets/tray-iconTemplate.png');
  } else {
    iconPath = path.join(__dirname, '../assets/tray-icon.png');
  }

  try {
    const fileIcon = nativeImage.createFromPath(iconPath);
    if (!fileIcon.isEmpty()) {
      // Ensure proper size for menu bar
      const size = process.platform === 'darwin' ? 22 : 16;
      const currentSize = fileIcon.getSize();
      let finalIcon = fileIcon;
      
      if (currentSize.width !== size || currentSize.height !== size) {
        finalIcon = fileIcon.resize({ width: size, height: size });
      }
      
      if (process.platform === 'darwin') {
        finalIcon.setTemplateImage(true);
      }
      return finalIcon;
    }
  } catch (error) {
    // File doesn't exist, will use fallback
  }

  // Create a simple visible fallback icon
  // Use a simple white square/circle that's visible in menu bar
  const size = process.platform === 'darwin' ? 22 : 16;
  
  // Create a minimal visible icon using a solid color rectangle
  // This will be at least visible in the menu bar
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
    <rect width="${size}" height="${size}" fill="white"/>
  </svg>`;
  
  try {
    // Use encodeURIComponent instead of base64 for better compatibility
    const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    const icon = nativeImage.createFromDataURL(dataUrl);
    if (!icon.isEmpty()) {
      // Resize to ensure correct size
      const resized = icon.resize({ width: size, height: size });
      if (process.platform === 'darwin') {
        resized.setTemplateImage(true);
      }
      return resized;
    }
  } catch (error) {
    // SVG creation failed
  }
  
  // Ultimate fallback: empty icon (menu will still work)
  return nativeImage.createEmpty();
}

function createTray() {
  const icon = createTrayIcon();

  tray = new Tray(icon);
  
  // Ensure template mode for macOS if not already set
  if (!icon.isEmpty() && process.platform === 'darwin') {
    // Template mode should already be set in createTrayIcon, but ensure it here too
    try {
      icon.setTemplateImage(true);
    } catch (error) {
      // Icon might not support template mode
    }
  }

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Telemetry',
      click: showTelemetryWindow,
    },
    {
      label: 'Settings',
      click: showSettingsWindow,
    },
    {
      type: 'separator',
    },
    {
      label: 'Quit',
      click: () => {
        app.isQuitting = true;
        if (sensorManager) {
          sensorManager.stop();
        }
        app.quit();
      },
    },
  ]);

  tray.setContextMenu(contextMenu);
  tray.setToolTip('Sentinel Sensor');
  
  // Don't open window on tray icon click - only show menu
  // Menu will appear automatically on click (native macOS behavior)
}

// Initialize sensor manager
app.whenReady().then(() => {
  // Hide dock icon on macOS (menu bar only)
  if (process.platform === 'darwin') {
    app.dock.hide();
  }

  // Create tray icon first
  createTray();
  
  // Create window but keep it hidden
  createWindow();
  
  // Get HQ server URL from environment or use default
  const hqServerUrl = process.env.HQ_SERVER_URL || 'http://localhost:3000';
  
  // Initialize sensor manager
  sensorManager = new SensorManager(hqServerUrl);
  sensorManager.start();

  // Prevent app activation from showing window
  app.on('activate', () => {
    // On macOS, clicking dock icon shouldn't show window (we're menu bar only)
    // But we can show telemetry if user explicitly activates
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  // Don't quit on window close - keep running in menu bar
  // Only quit explicitly via Quit menu item
});

app.on('before-quit', () => {
  app.isQuitting = true;
  if (sensorManager) {
    sensorManager.stop();
  }
});

// IPC handlers for sensor data
ipcMain.handle('get-sensor-status', () => {
  return sensorManager ? sensorManager.getStatus() : null;
});

ipcMain.handle('get-sensor-id', () => {
  return sensorManager ? sensorManager.getSensorId() : null;
});

ipcMain.handle('get-hq-server-url', () => {
  return sensorManager ? sensorManager.getHqServerUrl() : null;
});

ipcMain.handle('update-hq-server-url', (event, url) => {
  if (sensorManager) {
    sensorManager.updateHqServerUrl(url);
    return true;
  }
  return false;
});
