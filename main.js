// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')

let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1300,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nativeWindowOpen: true,
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', async function () {

  if (preview.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main preview
// code. You can also put them in separate files and require them here.

// code

const Program = require('program')

program = new Program

const init_func = async () => {

  const result = program.init()

  mainWindow.webContents.send('oi-init', await result)
}

const update_func = async (data) => {

  const result = await program.update(data)

  mainWindow.webContents.send('oi-update', result)
}

const preview_func = async (images, left, right) => {

  await program.preview(images, left, right)

  mainWindow.webContents.send('oi-preview', images, left, right)
}

const save_func = async () => {

  await program.save()

  mainWindow.webContents.send('oi-save', 'saved')
}

ipcMain.on('io-init', () => {
  init_func()
})

ipcMain.on('io-update', (err, data) => {
  update_func(data)
})

ipcMain.on('io-preview', (err, images, left, right) => {
  preview_func(images, left, right)
})

ipcMain.on('io-save', () => {
  save_func()
})
