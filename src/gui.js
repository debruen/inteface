
const { ipcRenderer } = require('electron')

const Extend = require('./extend.js')

const Settings = require('./settings.js')
const Filter  = require('./filter.js')
const Output  = require('./output.js')
const Preview = require('./preview.js')

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
    this.preview  = new Preview(this.options)

    this.data

    this.comline()

    ipcRenderer.send('data')
  }

  update() {
    ipcRenderer.send('update', this.data)
  }

  read() {
    ipcRenderer.send('read', this.preview.images, this.preview.left, this.preview.right, 0)
  }



  process() {
    ipcRenderer.send('io-preview', this.preview.images, this.preview.left, this.preview.right)
  } // sendBuffer

  save() {
    ipcRenderer.send('io-save')
  }

  comline() {

    // data received
    ipcRenderer.on('data', (event, data) => {
      this.data = data
      const type = this.get_string('type', this.data['settings'])

      this.settings.init(this.data['settings'])
      this.filter.init(this.data['filter'], type)
      this.output.init(this.data['output'])
    })

    // update received
    ipcRenderer.on('update', (event, data) => {
      this.data = data
      const type = this.get_string('type', this.data['settings'])

      this.settings.update(this.data['settings'])
      this.filter.update(this.data['filter'], type)
      this.output.update(this.data['output'])

      this.preview.update(this.data['settings']);

      this.read()
    })

    // read received
    ipcRenderer.on('read', (event, image, left, right) => {

      this.preview.images = image
      this.preview.left = left
      this.preview.right = right

      this.preview.draw()

      // update buffer (image and audio)
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

    this.output.on('save', () => {
      this.save()
    })

    // preview
    ipcRenderer.on('oi-preview', (event, images, left, right) => {

      this.preview.images = images
      this.preview.left = left
      this.preview.right = right

      this.preview.draw()

      // update buffer (image and audio)
    })

    // save
    ipcRenderer.on('oi-save', (event, result) => {
      console.log(result)
    })
  } // comline

} // Gui

module.exports = Gui
