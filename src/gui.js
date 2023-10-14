
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
      stereo: 'lr',
      font: parseFloat(window.getComputedStyle(document.body).fontSize)
    }

    this.synthesis = new Synthesis(global_data)
    this.control = new Control(global_data)
    this.display = new Display(global_data)

    this.comline()

  }

  comline() {

    // --- synthesis
    ipcRenderer.send('init-synthesis')

    ipcRenderer.on('init-synthesis', (event, data) => {
      this.synthesis.init(data)
      this.display.draw()
    })

    this.synthesis.on('data-synthesis', async (data) => {
      ipcRenderer.send('data-synthesis', data)
    })

    ipcRenderer.on('data-synthesis', (event, data) => {
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

    this.display.on('done', async (data) => {
      console.log('done')
      this.control.data.play = false
      this.control.controls()
    })

  }

}

module.exports = Gui
