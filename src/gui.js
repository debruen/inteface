
const { ipcRenderer } = require('electron')

const Extend = require('./extend.js')

const Settings = require('./settings.js')
const Filter   = require('./filter.js')
const Output   = require('./output.js')
const Display  = require('./display.js')

class Gui extends Extend{

  constructor(options) {
    super()

    this.options = {
      settingsWidth: 600,
      margin: 10,
      audio: 60,
      font: parseFloat(window.getComputedStyle(document.body).fontSize)
    }

    this.settings = new Settings(this.options)
    this.filter   = new Filter(this.options)
    this.output   = new Output(this.options)

    this.display  = new Display(this.options)

    this.data

    this.comline()

    ipcRenderer.send('data')
  }

  update() {
    ipcRenderer.send('update', this.data)
  }

  buffer(data, image) {
    ipcRenderer.send('buffer', data, image)
  }

  comline() {

    // data received
    ipcRenderer.on('data', (event, data) => {
      this.data = data
      const type = this.get_string('type', this.data['settings'])

      this.settings.init(this.data['settings'])
      this.filter.init(this.data['filter'], type)
      this.output.init(this.data['output'])

      this.display.init(this.data['settings'])
    })

    // update received
    ipcRenderer.on('update', (event, data) => {
      this.data = data
      const type = this.get_string('type', this.data['settings'])

      this.settings.update(this.data['settings'])
      this.filter.update(this.data['filter'], type)
      this.output.update(this.data['output'])

      this.display.update(this.data['settings'])
    })

    // read received
    ipcRenderer.on('buffer', (event, data, image) => {

      this.display.controls(data)
      this.display.image = image
    })

    this.settings.on('update', (data) => {
      this.data.settings = data;
      this.update()
    })

    this.filter.on('update', (data) => {
      this.data.filter = data;
      this.update()
    })

    this.output.on('update', (data) => {
      this.data.output = data;
      this.update()
    })

    this.display.on('buffer', (data, image) => {
      this.buffer(data, image)
    })

  } // comline

} // Gui

module.exports = Gui
