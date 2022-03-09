
const { ipcRenderer } = require('electron')

const Extend = require('./extend.js')

const Settings = require('./settings.js')
const Filter   = require('./filter.js')
const Output   = require('./output.js')
// const Preview  = require('./preview.js')
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
    // this.preview  = new Preview(this.options)

    this.display  = new Display(this.options)

    this.data

    this.comline()

    ipcRenderer.send('data')
  }

  update() {
    ipcRenderer.send('update', this.data)
  }

  // read() {
  //   ipcRenderer.send('read', this.preview.image, this.preview.left, this.preview.right, this.preview.frame)
  // }
  //
  // next() {
  //   ipcRenderer.send('next', this.preview.image, this.preview.left, this.preview.right, this.preview.frame)
  // }

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

      // this.preview.update(this.data['settings']);

      this.display.update(this.data['settings'])

      // this.read()
    })

    // read received
    ipcRenderer.on('buffer', (event, data, image) => {

      this.display.controls(data)
      this.display.image = image

      // update buffer (image and audio)
    })

    // // read received
    // ipcRenderer.on('read', (event, image, left, right) => {
    //
    //   this.data['settings'] = this.data_update(this.data['settings'], "frame", this.preview.frame)
    //   this.settings.update(this.data['settings'])
    //
    //   console.log("read frames: " + this.preview.frame)
    //
    //   this.preview.image = image
    //   this.preview.left = left
    //   this.preview.right = right
    //
    //   this.preview.draw()
    //
    //   // update buffer (image and audio)
    // })

    // // read received
    // ipcRenderer.on('next', (event, image, left, right) => {
    //
    //   this.data['settings'] = this.data_update(this.data['settings'], "frame", this.preview.frame)
    //   this.settings.update(this.data['settings'])
    //
    //   console.log("next frames: " + this.preview.frame)
    //
    //   this.preview.image = image
    //   this.preview.left = left
    //   this.preview.right = right
    //
    //   // update buffer (image and audio)
    // })

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

    // this.preview.on('play', () => {
    //   this.next()
    // })
    //
    // this.preview.on('pause', () => {
    //   // this.next()
    // })

    // this.output.on('save', () => {
    //   this.save()
    // })

    // // preview
    // ipcRenderer.on('oi-preview', (event, images, left, right) => {
    //
    //   this.preview.images = images
    //   this.preview.left = left
    //   this.preview.right = right
    //
    //   this.preview.draw()
    //
    //   // update buffer (image and audio)
    // })
    //
    // // save
    // ipcRenderer.on('oi-save', (event, result) => {
    //   console.log(result)
    // })
  } // comline

} // Gui

module.exports = Gui
