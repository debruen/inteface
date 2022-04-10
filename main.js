// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')


// --- --- --- --- --- --- * --- --- --- --- --- ---


const Program = require('program')
const program = new Program


// --- --- --- --- --- --- * --- --- --- --- --- ---


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
  mainWindow.webContents.openDevTools()
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
app.on('window-all-closed', async () => {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


// --- --- --- --- --- --- * --- --- --- --- --- ---

let r = true

ipcMain.on('init-synthesis', async () => {
  if(r) {
    const data = await program.initSynthesis()
    mainWindow.webContents.send('init-synthesis', data)
  }
})

ipcMain.on('data-synthesis', async (err, data) => {
  if(r) {
    const result = await program.dataSynthesis(data)
    mainWindow.webContents.send('data-synthesis', result)
  }
})

ipcMain.on('init-control', async () => {
  if(r) {
    const data = await program.initControl()
    mainWindow.webContents.send('init-control', data)
  }
})

ipcMain.on('data-control', async (err, data) => {
  if(r) {
    const result = await program.dataControl(data)
    mainWindow.webContents.send('data-control', result)
  }
})


ipcMain.on('new-frame', async (err) => {
  if(r) {
    const result = await program.dispnewFramelay()
    mainWindow.webContents.send('new-frame', result)
  }
})

ipcMain.on('display', async (err, data, image) => {
  if(r) {
    const result = await program.display(data, image)

    mainWindow.webContents.send('display', image)
  }
})

app.on('will-quit', async () => {
  r = false
  const result = await program.quit()
  await console.log(result)
})
