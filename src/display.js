
const { ipcRenderer } = require('electron')

const Extend = require('./extend.js')

const P5 = require('p5')

class Display extends Extend{

  constructor(global_data) {
    super()

    // read .column
    // read .margin
    // read .audio
    // read .ratio
    // read .direction
    this.global_data = global_data

    this.canvas = document.createElement('CANVAS')
    this.canvas.style.position = 'absolute'
    document.body.appendChild(this.canvas)

    this.outLeft = document.createElement('CANVAS')
    this.outLeft.style.position = 'absolute'

    document.body.appendChild(this.outLeft)

    this.labelLeft = document.createElement('DIV')
    this.labelLeft.style.position = 'absolute'
    this.labelLeft.style.fontSize = this.global_data.font / 1.5 + 'px'
    this.labelLeft.style.lineHeight = 1.5
    document.body.appendChild(this.labelLeft)

    this.outRight = document.createElement('CANVAS')
    this.outRight.style.position = 'absolute'

    document.body.appendChild(this.outRight)

    this.labelRight = document.createElement('DIV')
    this.labelRight.style.position = 'absolute'
    this.labelRight.style.fontSize = this.global_data.font / 1.5 + 'px'
    this.labelRight.style.lineHeight = 1.5
    document.body.appendChild(this.labelRight)

    this.listener()
    this.thread()
  }

  /// start p5 sketch
  thread() {

    const p5 = new P5((sketch) => {

      sketch.setup = () => {
        let canvas = sketch.createCanvas(0, 0)
        canvas.position(0, 0)
      }

      sketch.draw = () => {
        ipcRenderer.send('new-frame')
      }

    })

  }

  draw() {

    let imageWidth, imageHeight, imageLeft, imageTop, audioWidth, audioHeight, leftLeft, leftTop, rightLeft, rightTop

    if (this.global_data.direction == 'right' || this.global_data.direction == 'left') {
      imageHeight = Math.round(window.innerHeight - ( this.global_data.audio * 3 + this.global_data.margin * 5 ))
      imageWidth  = Math.round(imageHeight * this.global_data.ratio)
      audioHeight = this.global_data.audio
      audioWidth  = imageWidth
    } else {
      imageHeight = Math.round(window.innerHeight - ( this.global_data.audio + this.global_data.margin * 3 ))
      imageWidth  = Math.round(imageHeight * this.global_data.ratio)
      audioHeight = imageHeight
      audioWidth  = this.global_data.audio
    }

    if (this.global_data.stereo == 'lr') {
      imageLeft = this.global_data.column + this.global_data.margin
      imageTop  = this.global_data.margin
      if (this.global_data.direction == 'right' || this.global_data.direction == 'left') {
        leftLeft  = imageLeft
        leftTop   = imageTop + imageHeight + this.global_data.margin
        rightLeft = imageLeft
        rightTop  = leftTop + this.global_data.audio + this.global_data.margin
      } else {
        leftLeft  = imageLeft + imageWidth + this.global_data.margin
        leftTop   = this.global_data.margin
        rightLeft = leftLeft + this.global_data.audio + this.global_data.margin
        rightTop  = this.global_data.margin
      }
    } else if (this.global_data.direction == 'up' || this.global_data.direction == 'down') {
      leftLeft  = this.global_data.column + this.global_data.margin
      leftTop   = this.global_data.margin
      rightLeft = leftLeft + this.global_data.audio + this.global_data.margin
      rightTop  = this.global_data.margin

      imageLeft = rightLeft + this.global_data.audio + this.global_data.margin
      imageTop  = this.global_data.margin
    } else {
      leftLeft  = this.global_data.column + this.global_data.margin
      leftTop   = this.global_data.margin
      rightLeft = this.global_data.column + this.global_data.margin
      rightTop  = leftTop + this.global_data.audio + this.global_data.margin

      imageLeft = this.global_data.column + this.global_data.margin
      imageTop  = rightTop + this.global_data.audio + this.global_data.margin
    }

    this.canvas.style.left   = imageLeft + 'px'
    this.canvas.style.top    = imageTop + 'px'

    this.outLeft.style.left  = leftLeft + 'px'
    this.outLeft.style.top   = leftTop + 'px'
    this.outRight.style.left = rightLeft + 'px'
    this.outRight.style.top  = rightTop + 'px'

    this.canvas.width    = imageWidth
    this.canvas.height   = imageHeight

    this.outLeft.width   = audioWidth
    this.outLeft.height  = audioHeight
    this.outRight.width  = audioWidth
    this.outRight.height = audioHeight

    const density = window.devicePixelRatio;
    const imageBuffer = new ArrayBuffer((imageWidth) * (imageHeight) * 4)
    const image = new Uint8ClampedArray(imageBuffer)

    const leftBuffer = new ArrayBuffer((audioWidth) * (audioHeight) * 4)
    const left = new Uint8ClampedArray(leftBuffer)

    const rightBuffer = new ArrayBuffer((audioWidth) * (audioHeight) * 4)
    const right = new Uint8ClampedArray(rightBuffer)

    const data = {
      imageWidth: imageWidth,
      imageHeight: imageHeight,
      audioWidth: audioWidth,
      audioHeight: audioHeight,
    };

    (async () => {
      const frame = await ipcRenderer.invoke('display', data, image, left, right)

      console.log(data)

      const imageData = await new ImageData(frame.image, imageWidth, imageHeight)
      const imageCtx = await this.canvas.getContext("2d")
      imageCtx.putImageData(imageData, 0, 0)

      const leftData = await new ImageData(frame.left, audioWidth, audioHeight)
      const leftCtx = await this.outLeft.getContext("2d")
      leftCtx.putImageData(leftData, 0, 0)

      const rightData = await new ImageData(frame.right, audioWidth, audioHeight)
      const rightCtx = await this.outRight.getContext("2d")
      rightCtx.putImageData(rightData, 0, 0)

    })()

  }

  listener() {
    window.addEventListener('resize', () => {
      this.draw()
    })

    ipcRenderer.on('new-frame', (event, data) => {
      if (data.done) {
        this.emit('done', data.done)
      }
      if (data.new) this.draw()
    })

    // ipcRenderer.on('quit-display', (event) => {
    //   this.quit = true
    // })
  }

}

module.exports = Display
