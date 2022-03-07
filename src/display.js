
const P5 = require('p5')

const Extend = require('./extend.js')

const Select = require('./extend/select.js')
const Range  = require('./extend/range.js')
const Button = require('./extend/button.js')

class Display extends Extend{

  constructor(options) {
    super()

    this.options = options

    this.control = document.createElement('div')
    this.control.style.display = 'block'
    this.control.style.position = 'absolute'
    this.control.style.left =  this.options.settingsWidth + this.options.margin + 'px'
    this.control.style.height =  this.options.audio + 'px'

    this.play_button = document.createElement('span')
    this.play_button.style.cursor = 'pointer'
    this.play_button.style.marginRight = this.options.margin + 'px'
    this.play_button.innerHTML = "play"

    this.record_button = document.createElement('span')
    this.record_button.style.cursor = 'pointer'
    this.record_button.style.marginRight = this.options.margin + 'px'
    this.record_button.innerHTML = "record"

    this.control.appendChild(this.play_button)
    this.control.appendChild(this.record_button)

    document.body.appendChild(this.control)

    this.data

    this.ratio
    this.time
    this.direction

    this.image

    this.image_width
    this.image_height

    this.play = false
    this.record = false

    this.updated = false

  } // constructor END

  init(data) {
    this.update(data)
    this.comline()
    this.display()
  }

  update(data) {
    const ratio     = data.find(x => x.name == 'ratio')
    const time      = data.find(x => x.name == 'frame time')
    const direction = data.find(x => x.name == 'direction')

    if (this.ratio != ratio.value || this.time != time.value || this.direction != direction.value) {
      this.ratio     = ratio.value
      this.time      = time.value
      this.direction = direction.value

      this.size()
      this.updated = true
    }
  }

  /// start p5 sketch
  display() {

    const p5 = new P5((sketch) => {

      sketch.setup = () => {
        let canvas = sketch.createCanvas(this.image_width, this.image_height)
        canvas.position(this.options.settingsWidth + this.options.margin, this.options.margin)
      }

      sketch.draw = () => {
        if(this.updated) {
          sketch.resizeCanvas(this.image_width, this.image_height)
          this.updated = false
        }
        this.read()
        this.set_controls()

        /// write buffer to canvas
        sketch.loadPixels()
        for (let i = 0; i < this.image.length; i++) {
          sketch.pixels[i] = this.image[i]
        }
        sketch.updatePixels()

        // sketch.background(0,0,255)
      }

      sketch.windowResized = () => {
        this.size()
        sketch.resizeCanvas(this.image_width, this.image_height)
      }

    })

  }

  /// calculating image size
  size() {

    if (this.direction == 'right' || this.direction == 'left') {
      this.image_height = Math.round(window.innerHeight - ( this.options.audio * 3 + this.options.margin * 5 ))
      this.image_width  = Math.round(this.image_height * this.ratio)
    } else {
      this.image_height = Math.round(window.innerHeight - ( this.options.audio + this.options.margin * 3 ))
      this.image_width  = Math.round(this.image_height * this.ratio)
    }

    this.control.style.width = this.image_width + 'px'
    this.control.style.top =  this.image_height + this.options.margin * 2 + 'px'

    const density = window.devicePixelRatio;
    const image = new ArrayBuffer((this.image_width * density) * (this.image_height * density) * 4)
    this.image  = new Uint8ClampedArray(image)

  }

  comline() {

    this.play_button.addEventListener("click", () => {
      if (this.play) {
        this.play = false
      } else {
        this.play = true
      }
      this.set_controls()
    })

    this.record_button.addEventListener("click", () => {
      if (this.record) {
        this.record = false
      } else {
        this.record = true
      }
      this.set_controls()
    })

  }

  set_controls() {

    if (this.play) {
      this.play_button.innerHTML = "pause"
    } else {
      this.play_button.innerHTML = "play"
    }

    if (this.record) {
      this.record_button.innerHTML = "stop recording"
    } else {
      this.record_button.innerHTML = "record"
    }

  }

  /// send display data
  /// read new buffer
  read() {
    const density = window.devicePixelRatio;
    this.data = {
      width: this.image_width * density,
      height: this.image_height * density,
      play: this.play,
      record: this.record
    }
    this.emit('buffer', this.data, this.image)
  }

}

module.exports = Display
