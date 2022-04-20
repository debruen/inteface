
const { ipcRenderer } = require('electron')

const Extend = require('./extend.js')

const Synthesis = require('./synthesis.js')

const Control = require('./control.js')

const Display  = require('./display.js')

class Gui extends Extend{

  constructor() {
    super()

    const global_data = {
      settingsWidth: 600,
      column: 600,
      margin: 10,
      audio: 60,
      ratio: 0.5,
      direction: 'up',
      font: parseFloat(window.getComputedStyle(document.body).fontSize)
    }

    this.synthesis = new Synthesis(global_data)
    this.control = new Control(global_data)
    this.display = new Display(global_data)

    this.comline()

    // ipcRenderer.send('init-synthesis')
    // ipcRenderer.send('init-control')

  }

  // async init() {
  //   console.log('init');
  //   const synth_data = await ipcRenderer.invoke('init-synthesis')
  //   console.log('init-synthesis')
  //   await this.synthesis.init(synth_data)
  //   await this.display.init()
  //
  //   const control_data = await ipcRenderer.invoke('init-control')
  //   console.log('init-control')
  //   await this.control.init(control_data)
  // }

  comline() {

    // --- synthesis
    ipcRenderer.send('init-synthesis')

    ipcRenderer.on('init-synthesis', (event, data) => {
      console.log('gui init-synthesis')
      this.synthesis.init(data)
      this.display.draw()
    })

    this.synthesis.on('data-synthesis', async (data) => {
      ipcRenderer.send('data-synthesis', data)
    })

    ipcRenderer.on('data-synthesis', (event, data) => {
      console.log('gui data-synthesis')
      this.synthesis.update(data)
      this.display.draw()
    })

    ipcRenderer.send('init-control')

    ipcRenderer.on('init-control', (event, data) => {
      this.control.init(data)
    })

    this.control.on('data-control', async (data) => {
      ipcRenderer.send('data-control', data)
    })

    ipcRenderer.on('data-control', (event, data) => {
      this.control.update(data)
    })

  }

}

module.exports = Gui
