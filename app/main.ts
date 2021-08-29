import { app, BrowserWindow, screen, Tray, ipcMain } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import * as url from 'url';

// Initialize remote module
require('@electron/remote/main').initialize();

let win: BrowserWindow = null;
const args = process.argv.slice(1),
  serve = args.some(val => val === '--serve');

let mainTray: Tray | undefined;
let trayWindow: BrowserWindow | undefined;

const WINDOW_SIZE_DEFAULTS = {
  width: 350,
  height: 550,
  margin: {
    x: 0,
    y: 0
  }
};

function initTray() {
  mainTray = new Tray(path.join('C:\\Users\\samuel.knoch\\Downloads', 'diagramm_intel_tonemapper_benchmark.jpg'));
  trayWindow = createWindow();

  mainTray.on("click", function(event) {
      ipcMain.emit("tray-window-clicked", { window: trayWindow, tray: mainTray});
      toggleTrayWindow();
  });

  alignWindow();
  ipcMain.emit("tray-window-ready", { window: trayWindow, tray: mainTray});
}

function alignWindow() {
  if(!trayWindow) return;

  const position = calculateWindowPosition();
  if(!position) return;

  trayWindow.setBounds({
    width: WINDOW_SIZE_DEFAULTS.width,
    height: WINDOW_SIZE_DEFAULTS.height,
    x: position.x,
    y: position.y
  });
}

function calculateWindowPosition() {
  // Currently just for windows, TODO: Linux and Mac support
  const size = screen.getPrimaryDisplay();


  const x = size.bounds.width - WINDOW_SIZE_DEFAULTS.width - 100;
  const y = size.workArea.height - WINDOW_SIZE_DEFAULTS.height;

  console.log(__dirname);
  console.log(size);
  console.log('X: ', x);
  console.log('Y: ', y);

  return { x, y };
}

function toggleTrayWindow() {
  if(!trayWindow) return;
  if (trayWindow.isVisible()) {
    trayWindow.hide();
    ipcMain.emit("tray-window-hidden", { window: trayWindow, tray: mainTray });
  } else {
    trayWindow.show();
  }
}

function createWindow(): BrowserWindow {

  win = new BrowserWindow({
    x: 0,
    y: 0,
    width: WINDOW_SIZE_DEFAULTS.width,
    height: WINDOW_SIZE_DEFAULTS.height,
    maxWidth: WINDOW_SIZE_DEFAULTS.width,
    maxHeight: WINDOW_SIZE_DEFAULTS.height,
    show: false,
    frame: false,
    fullscreenable: false,
    transparent: true,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: (serve) ? true : false,
      contextIsolation: false,  // false if you want to run e2e test with Spectron
      enableRemoteModule : true // true if you want to run e2e test with Spectron or use remote module in renderer context (ie. Angular)
    },
  });

  win.setMenu(null);

  if (serve) {
    //win.webContents.openDevTools();
    require('electron-reload')(__dirname, {
      electron: require(path.join(__dirname, '/../node_modules/electron'))
    });
    win.loadURL('http://localhost:4200/traywindow');
  } else {
    // Path when running electron executable
    let pathIndex = './index.html';

    if (fs.existsSync(path.join(__dirname, '../dist/index.html'))) {
       // Path when running electron in local folder
      pathIndex = '../dist/index.html';
    }

    win.loadURL(url.format({
      pathname: path.join(__dirname, pathIndex),
      protocol: 'file:',
      slashes: true
    }));
  }

  win.hide();

  win.on("blur", () => {
    if(!trayWindow) return;

    if(!trayWindow.webContents.isDevToolsOpened()) {
      trayWindow.hide();
      ipcMain.emit("tray-window-hidden", { window: trayWindow, tray: mainTray });
    }
  });

  // Emitted when the window is closed.
  win.on('close', (event) => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    event.preventDefault();
    if(!trayWindow) return;
    trayWindow.hide();
  });

  return win;
}

try {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
  app.on('ready', () => setTimeout(initTray, 400));

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });

} catch (e) {
  // Catch Error
  // throw e;
}
