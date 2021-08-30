import { app, BrowserWindow, screen, Tray, ipcMain, Menu, remote } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import * as url from 'url';

// Initialize remote module
require('@electron/remote/main').initialize();

const args = process.argv.slice(1),
  serve = args.some(val => val === '--serve');

let mainTray: Tray | undefined;
let trayWindow: BrowserWindow | undefined;
let mainWindow: BrowserWindow | undefined;

const TRAY_WINDOW_SIZE_DEFAULTS = {
  width: 350,
  height: 550,
  margin: {
    x: 0,
    y: 0
  }
};

const MAIN_WINDOW_SIZE_DEFAULTS = {
  width: 550,
  height: 800,
  margin: {
    x: 0,
    y: 0
  }
};

function handleOnTrayQuitClicked() {
  if(!app)return;
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    if (mainWindow){
      mainWindow.close();
    }
    if(trayWindow) {
      trayWindow.close();
    }
    app.quit();
    mainTray.destroy();
    mainTray = null;
    trayWindow = null;
    mainWindow = null;
  }
}

function handleOnTrayOpenMainWindowClicked() {
  if(!mainWindow) mainWindow = createWindow();

  mainWindow.show();
}

function initTray() {
  mainTray = new Tray(path.join('C:\\Users\\samuel.knoch\\Downloads', 'diagramm_intel_tonemapper_benchmark.jpg'));
  trayWindow = createTrayWindow();

  const _handleOnTrayQuitClicked = handleOnTrayQuitClicked;
  const _handleOnTrayOpenMainWindowClicked = handleOnTrayOpenMainWindowClicked;
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Open MainWindow', type: 'normal', click: () => handleOnTrayOpenMainWindowClicked()},
    { label: '', type: 'separator' },
    { label: 'Quit', type: 'normal', click: ()=> handleOnTrayQuitClicked()}
  ]);

  mainTray.setToolTip('RGB Controller');
  mainTray.setContextMenu(contextMenu);

  mainTray.on("click", function(event) {
      ipcMain.emit("tray-window-clicked", { window: trayWindow, tray: mainTray});
      toggleTrayWindow();
  });

  alignWindow();

  ipcMain.emit("tray-window-ready", { window: trayWindow, tray: mainTray});

  if (serve) {
    trayWindow.webContents.openDevTools();
  }
  trayWindow.webContents.openDevTools();
}

function alignWindow() {
  if(!trayWindow) return;

  const position = calculateWindowPosition();
  if(!position) return;

  trayWindow.setBounds({
    width: TRAY_WINDOW_SIZE_DEFAULTS.width,
    height: TRAY_WINDOW_SIZE_DEFAULTS.height,
    x: position.x,
    y: position.y
  });
}

function calculateWindowPosition() {
  // Currently just for windows, TODO: Linux and Mac support
  const size = screen.getPrimaryDisplay();


  const x = size.bounds.width - TRAY_WINDOW_SIZE_DEFAULTS.width - 100;
  const y = size.workArea.height - TRAY_WINDOW_SIZE_DEFAULTS.height;

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

function createTrayWindow(): BrowserWindow {

  const win = new BrowserWindow({
    x: 0,
    y: 0,
    width: TRAY_WINDOW_SIZE_DEFAULTS.width,
    height: TRAY_WINDOW_SIZE_DEFAULTS.height,
    maxWidth: TRAY_WINDOW_SIZE_DEFAULTS.width,
    maxHeight: TRAY_WINDOW_SIZE_DEFAULTS.height,
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
  win.hide();

  if (serve) {
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
      slashes: true,
      query: {redirect: 'traywindow'}
    }));
  }

  win.on("blur", () => {
    if(!trayWindow) return;

    if(!trayWindow.webContents.isDevToolsOpened()) {
      trayWindow.hide();
      ipcMain.emit("tray-window-hidden", { window: trayWindow, tray: mainTray });
    }
  });

  win.on('close', (event) => {
    event.preventDefault();
    if(!trayWindow) return;
    trayWindow.hide();
  });

  return win;
}

function createWindow(): BrowserWindow {
  // Create the browser window.
  const win = new BrowserWindow({
    x: 0,
    y: 0,
    width: MAIN_WINDOW_SIZE_DEFAULTS.width,
    height: MAIN_WINDOW_SIZE_DEFAULTS.height,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: (serve) ? true : false,
      contextIsolation: false,  // false if you want to run e2e test with Spectron
      enableRemoteModule : true // true if you want to run e2e test with Spectron or use remote module in renderer context (ie. Angular)
    },
  });

  win.webContents.openDevTools();
  if (serve) {
    require('electron-reload')(__dirname, {
      electron: require(path.join(__dirname, '/../node_modules/electron'))
    });
    win.loadURL('http://localhost:4200/home');
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
      slashes: true,
      query: {redirect: 'home'}
    }));
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  return win;
}

try {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  // Added 400 ms to fix the black background issue while using transparent window. More details at https://github.com/electron/electron/issues/15947
  app.on('ready', () => setTimeout(initTray, 400));

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      if(!mainTray) app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
      // createWindow();
    }
  });

} catch (e) {
  // Catch Error
  // throw e;
}
