
const Program  = require('program')

const Input    = require('./input.js')
const Filtrate = require('./filtrate.js')
const Output   = require('./output.js')
const Display  = require('./display.js')

class Interface {

  constructor() {

    this.options = {
      width: 600,
      margin: 10,
      audio: 60,
      font: parseFloat(window.getComputedStyle(document.body).fontSize)
    }

    this.program = new Program()

    this.input   = new Input(this.options)
    this.filter  = new Filtrate(this.options)
    this.output  = new Output(this.options)
    this.display = new Display(this.options)

    this.data

  } // constructor END

  init() {

    this.data = this.program.data()

    this.size()

    this.data = this.program.data(this.data)

    this.input.init(this.data.input)

    this.filter.init(this.data)

    this.output.init(this.data.output)

    console.log(this.data)

    this.preview()

    this.listener()

  } // init END

  listener() {

    /// window resize event
    let resizeTimeout = false                               // holder for timeout id
    const resizeDelay = Math.floor(Math.random() * 51) + 50 // delay after event is "complete" to run callback

    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {

        this.size()

        this.data = this.program.data(this.data)

        this.preview()
      }, resizeDelay)
    })

    /// input receiver
    this.input.on('update', (data) => {

      this.data.input = data
      this.data = this.program.data(this.data)
      this.filter.update(this.data)
      this.output.update(this.data.output)

      this.size()
      this.data = this.program.data(this.data)
      this.input.update(this.data.input)
      this.filter.update(this.data)
      this.output.update(this.data.output)

      console.log(this.data)

      this.preview()
    })

    /// filter receiver
    this.filter.on('update', (data) => {

      this.data.filter = data
      this.data = this.program.data(this.data)
      this.filter.update(this.data)
      this.output.update(this.data.output)

      console.log(this.data)

      this.preview()

    })

    /// output receiver
    this.output.on('update', (data) => {

      if (data[7].value) {
        this.save()

      } else {
        this.data.output = data
        this.data = this.program.data(this.data)
        this.output.update(this.data.output)

        console.log(this.data)

        this.preview()
      }
    })

  } // listener END

  save() {

    this.program.process()
  }

  preview() {
    this.display.buffer(this.data)

    this.program.process(this.display.imageBuffer, this.display.audioBufferL, this.display.audioBufferR)

    this.display.draw()

  } // preview END

  size() {

    let width, height

    /// calculating display dimensions
    if (this.data.input[4].value == 'right' || this.data.input[4].value == 'left') {
      height = Math.round(window.innerHeight - ( this.options.audio * 3 + this.options.margin * 5 ))
      width  = Math.round(height * this.data.input[3].value)
    } else {
      height = Math.round(window.innerHeight - ( this.options.audio + this.options.margin * 3 ))
      width  = Math.round(height * this.data.input[3].value)
    }

    /// writing display dimensions to data
    this.data.width  = width
    this.data.height = height

  } // size END

} // Interface END

module.exports = Interface
