//handle setupevents as quickly as possible
const electron = require("electron")

import {SquirrelEvent} from './src/SquirrelEvent';
import { dirname } from 'path';
import { last } from '@angular/router/src/utils/collection';

const events = new SquirrelEvent();
if (events.handleSquirrelEvent(electron.app)) {
  // squirrel event handled and app will exit in 1000ms, so don't do anything else
  process.exit;
}

const app = electron.app
const BrowserWindow = electron.BrowserWindow
const Tray = electron.Tray
var trayIcon = null;
const Menu = electron.Menu
const url = require('url')
const path = require('path')
const ipcMain = electron.ipcMain
// const sqlite3 = require('sqlite3').verbose()

let mainWindow, serve;
let splash
const args = process.argv.slice(1);
serve = args.some(val => val === '--serve');

if (serve) {
  require('electron-reload')(__dirname, {
  });
}

function createWindow(name) {

  const electronScreen = screen;
  // const size = electronScreen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  name = new BrowserWindow({
    // x: 0,
    // y: 0,
    width: 400,
    height: 656
  });

  // and load the index.html of the app.
  name.loadURL(url.format({
    pathname: path.join(__dirname + '/' + name + '.html'),
    protocol: 'file',
    slashes: true,
    icon: __dirname + 'assets/img/icon.ico'
  }))

  // Open the DevTools.
  // if (serve) {
  //   name.webContents.openDevTools();
  // }

  // Emitted when the window is closed.
  name.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    name = null;
  });
}

try {
  
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  // app.on('ready', createWindow);
  app.on('ready', () => {
    let trayImage = ''
    if (process.platform == 'darwin') {  
      trayImage = './assets/tray/osx/icon_tray-normal.png';
    }
    else if (process.platform == 'win32') {  
      trayImage = './assets/tray/win/icon_tray-normal.ico';
    }
    const iconPath = path.join(__dirname, trayImage);
    trayIcon = new Tray(iconPath);
    trayIcon.setToolTip('T-Rec App');


    // if (process.platform == 'darwin') {  
    //   trayIcon.setPressedImage(path.join(__dirname, './assets/tray/osx/icon_tray-clicked.png'))
    // }
    // else if (process.platform == 'win32') {  
      // trayIcon.setPressedImage(path.join(__dirname, './assets/tray/win/icon_tray-clicked.png'))
    // }


    ipcMain.on('trayChange', function(ev, iconPath) {
      trayIcon.setImage(iconPath);
    });

    mainWindow = new BrowserWindow({
      width: 400,
      height: 650,
      title: 'T-Rec App',
      frame: false,
      icon: __dirname + '/assets/trec-logo.png',
      show: false
    })

    splash = new BrowserWindow({
      width: 400,
      height: 420,
      frame: false,
      alwaysOnTop: true
    })
    splash.loadURL(url.format({
      pathname: path.join(__dirname, 'splash.html'),
      protocol: 'file',
      slashes: true,
    }))
    
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true,
        icon: __dirname + '/assets/trec-logo.png'    
    }))    
    splash.once("ready-to-show", () => { splash.show()
    })
    setTimeout(() => {
        splash.destroy()
        mainWindow.show()
      }, 3000)
            

    mainWindow.on('closed', function() {
        app.quit()
    })

    mainWindow.webContents.on('context-menu', (e, props) => {
      const InputMenu = Menu.buildFromTemplate([    
        { label: "Cut", accelerator: "CmdOrCtrl+X", role: "cut" },
        { label: "Copy", accelerator: "CmdOrCtrl+C", role: "copy" },
        { label: "Paste", accelerator: "CmdOrCtrl+V", role: "paste" },
        { label: "Reload", accelerator: "CmdOrCtrl+R", role: "reload"},
        { label: 'Toggle DevTools',
        click() {
            mainWindow.toggleDevTools()
        }},
        {
          label: "Quit app",
          accelerator: process.platform == 'darwin' ? 'Command+Q': 'Ctrl+Q',
          click() {
            app.quit()
          }
        }
      ]);
      const { inputFieldType } = props;
      
        InputMenu.popup(mainWindow, props);
      
    });

    trayIcon.on('click', () => {
      mainWindow.isMinimized() ? mainWindow.show() : mainWindow.minimize()
    })

  });
  
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
    if (mainWindow === null) {
      this.createWindow();
    } else {
      mainWindow.show()
    }
  });

} catch (e) {
  // Catch Error
  // throw e;
}
