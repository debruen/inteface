
const { ipcRenderer } = require('electron')

const Extend = require('./extend.js')

const Settings = require('./settings.js')
const Filter   = require('./filter.js')
const Output   = require('./output.js')

const Control = require('./control.js')

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

    this.control  = new Control(this.options)

    this.display  = new Display(this.options)

    this.data

    this.comline()

    // send data
    ipcRenderer.send('init-synthesis')
    ipcRenderer.send('init-control')
  }

  dataSynthesis() {
    ipcRenderer.send('data-synthesis', this.data)
  }

  dataControl(data) {
    ipcRenderer.send('data-control', data)
  }

  newFrame() {
    ipcRenderer.send('new-frame')
  }

  display_func(data, image) {
    ipcRenderer.send('display', data, image)
  }


  comline() {

    // data received
    ipcRenderer.on('init-synthesis', (event, data) => {
      this.data = data
      const type = this.get_string('type', this.data['settings'])

      this.settings.init(this.data['settings'])
      this.filter.init(this.data['filter'], type)
      this.output.init(this.data['output'])

      this.display.init(this.data['settings'])
    })

    // update received
    ipcRenderer.on('data-synthesis', (event, data) => {
      this.data = data
      const type = this.get_string('type', this.data['settings'])

      this.settings.update(this.data['settings'])
      this.filter.update(this.data['filter'], type)
      this.output.update(this.data['output'])

      this.display.update(this.data['settings'])
    })

    ipcRenderer.on('init-control', (event, data) => {
      this.control.init(data)
    })

    ipcRenderer.on('data-control', (event, data) => {
      this.control.update(data)
    })

    // read received
    ipcRenderer.on('new-frame', (event, data) => {
      this.display.newFrame = data
    })

    // read received
    ipcRenderer.on('display', (event, data, image) => {
      this.display.image = image
    })

    this.settings.on('update', (data) => {
      this.data.settings = data;
      this.dataSynthesis()
    })

    this.filter.on('update', (data) => {
      this.data.filter = data;
      this.dataSynthesis()
    })

    this.output.on('update', (data) => {
      this.data.output = data;
      this.dataSynthesis()
    })

    this.control.on('control', (data) => {
      this.dataControl(data)
    })

    this.display.on('display', (data, image) => {
      this.display_func(data, image)
    })

  } // comline

} // Gui

module.exports = Gui
