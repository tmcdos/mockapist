'use strict'

import { app, BrowserWindow } from 'electron'
import { productName, version, description } from '../../package.json' // TMCDOS

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development')
{
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}
else
{
  // TMCDOS - in dev mode Electron does not read package.json, so it uses \AppData\Roaming\Electron
  // instead of \AppData\Roaming\mockAPIst
  const originalUserData = app.getPath('userData');
  app.setPath('userData', require('path').join(originalUserData, '../' + productName));
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow ()
{
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 600,
    useContentSize: true,
    width: 1000
  })

  mainWindow.webContents.openDevTools();
  mainWindow.loadURL(winURL)

  // TMCDOS - show application name and version
  mainWindow.webContents.on('did-finish-load', () =>
  {
    global.appTitle = productName + ' - ' + description + ' - ' + version;
    mainWindow.setTitle(global.appTitle);
  });

  mainWindow.on('closed', () =>
  {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () =>
{
  if (process.platform !== 'darwin')
  {
    app.quit()
  }
})

app.on('activate', () =>
{
  if (mainWindow === null)
  {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
