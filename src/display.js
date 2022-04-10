
const P5 = require('p5')

const Extend = require('./extend.js')

const Select = require('./extend/select.js')
const Range  = require('./extend/range.js')
const Button = require('./extend/button.js')

class Display extends Extend{

  constructor(options) {
    super()

    this.options = options

    this.data

    this.ratio
    this.direction

    this.image

    this.image_width
    this.image_height

    this.newFrame
    this.updated = false

  } // constructor END

  init(data) {
    this.update(data)
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

    const density = window.devicePixelRatio;
    const image = new ArrayBuffer((this.image_width * density) * (this.image_height * density) * 4)
    this.image  = new Uint8ClampedArray(image)

  }


  read() {
    const density = window.devicePixelRatio;
    this.data = {
      width: this.image_width * density,
      height: this.image_height * density,
    }
    this.emit('display', this.data, this.image)
  }

}

module.exports = Display
