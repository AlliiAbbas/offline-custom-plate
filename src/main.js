import { app, BrowserWindow } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      devTools: true, // Disable DevTools in production
      // Add these configurations to handle cache issues
      partition: 'persist:main',
      webSecurity: true,
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Load the app
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    // Load the dev server URL in development
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    // Only open DevTools in development
    mainWindow.webContents.openDevTools();
  } else {
    // In production, we need to load from the correct path
    const indexPath = path.join(__dirname, '../dist/index.html');
    console.log('Loading index.html from:', indexPath);
    
    // Set the correct base URL for assets
    const baseUrl = path.join(__dirname, '../dist');
    console.log('Base URL for assets:', baseUrl);
    
    mainWindow.loadFile(indexPath).catch(err => {
      console.error('Failed to load index.html:', err);
      // Try alternative path
      const altPath = path.join(process.resourcesPath, 'dist/index.html');
      console.log('Trying alternative path:', altPath);
      
      mainWindow.loadFile(altPath).catch(err2 => {
        console.error('Failed to load from alternative path:', err2);
        // Show error in window
        mainWindow.loadURL(`data:text/html,
          <html>
            <body style="font-family: Arial, sans-serif; padding: 20px;">
              <h1>Error Loading Application</h1>
              <p>Failed to load the application. Please check the console for details.</p>
              <p>Error 1: ${err.message}</p>
              <p>Error 2: ${err2.message}</p>
            </body>
          </html>
        `);
      });
    });
  }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set cache directory before creating window
  app.setPath('userData', path.join(app.getPath('appData'), 'YourAppName'));
  
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
