
const Extend = require('../extend.js')

class Sine extends Extend{

  constructor(options, parent) {
    super()

    this.name          = 'sine'
    this.settingsWidth = options.settingsWidth
    this.margin        = options.margin
    this.audio         = options.audio
    this.parent        = parent

    const width       = options.settingsWidth - options.margin
    const height      = options.audio / 3 * 2
    const inputWidth  = Math.floor(width / 3) - options.margin / 4

    const labelWidth  = '60px'
    const valueWidth  = '40px'
    const rangeWidth  = inputWidth - 90 - options.margin - 1 + 'px'

    const smallMargin = options.margin / 2 + 'px'

    this.div    = this.parentDiv()

    this.shapeLabel = document.createElement('LABEL')
    this.shapeLabel.style.marginRight = smallMargin + 'px'

    this.shapeSelect = document.createElement('SELECT')

    this.div.appendChild(this.shapeLabel)
    this.div.appendChild(this.shapeSelect)

    this.canvas = this.canvasForm()

    this.div.appendChild(this.canvas)

    this.labelA = document.createElement('LABEL')
    this.labelA.style.marginRight = smallMargin

    this.rangeA = document.createElement('INPUT')
    this.rangeA.type = 'range'
    this.rangeA.style.width = rangeWidth
    this.rangeA.style.marginRight = smallMargin
    this.rangeA.min = 0
    this.rangeA.max = 1
    this.rangeA.step = 0.0001

    this.valueA = document.createElement('SPAN')
    this.valueA.style.display = 'inline-block'
    this.valueA.style.textAlign = 'right'
    this.valueA.style.width = valueWidth
    this.valueA.style.paddingRight = smallMargin

    this.div.appendChild(this.labelA)
    this.div.appendChild(this.rangeA)
    this.div.appendChild(this.valueA)

    this.labelB = document.createElement('LABEL')
    this.labelB.style.marginRight = smallMargin

    this.rangeB = document.createElement('INPUT')
    this.rangeB.type = 'range'
    this.rangeB.style.width = rangeWidth
    this.rangeB.style.marginRight = smallMargin
    this.rangeB.min = 0
    this.rangeB.max = 1
    this.rangeB.step = 0.0001

    this.valueB = document.createElement('SPAN')
    this.valueB.style.display = 'inline-block'
    this.valueB.style.textAlign = 'right'
    this.valueB.style.width = '30px'
    this.valueB.style.paddingRight = smallMargin

    this.div.appendChild(this.labelB)
    this.div.appendChild(this.rangeB)
    this.div.appendChild(this.valueB)

    this.labelC = document.createElement('LABEL')
    this.labelC.style.marginRight = smallMargin

    this.rangeC = document.createElement('INPUT')
    this.rangeC.type = 'range'
    this.rangeC.style.width = rangeWidth
    this.rangeC.style.marginRight = smallMargin
    this.rangeC.min = 0
    this.rangeC.max = 1
    this.rangeC.step = 0.0001

    this.valueC = document.createElement('SPAN')
    this.valueC.style.display = 'inline-block'
    this.valueC.style.textAlign = 'right'
    this.valueC.style.width = '20px'
    this.valueC.style.paddingRight = smallMargin

    this.div.appendChild(this.labelC)
    this.div.appendChild(this.rangeC)
    this.div.appendChild(this.valueC)

    parent.appendChild(this.div)

    this.data

  } // constructor

  init(data) {

    this.data = data

    const freqMinMax = this.get_data('audio range')

    this.freqMin = freqMinMax.min
    this.freqMax = freqMinMax.max

    const shape = this.get_data('shape')

    this.shapeLabel.innerHTML = shape.name + ':'
    this.shapeLabel.for = shape.name

    this.shapeSelect.name = shape.name
    for (let i = 0; i < shape.options.length; i++) {
      let option = document.createElement('option')
      option.text = shape.options[i]
      option.value = shape.options[i]
      this.shapeSelect.add(option)
    }

    this.labelA.innerHTML = 'frequency: '
    this.labelA.for = 'frequency'
    this.rangeA.name = 'frequency'

    this.labelB.innerHTML = 'amplitude: '
    this.labelB.for = 'amplitude'
    this.rangeB.name = 'amplitude'

    this.labelC.innerHTML = 'phase: '
    this.labelC.for = 'phase'
    this.rangeC.name = 'phase'

    this.update()

    this.listener()
  } // init

  update(data = this.data) {

    this.data = data

    this.shapeSelect.value = this.get_string('shape')
    this.rangeA.value      = this.get_num('frequency')
    this.rangeB.value      = this.get_num('amplitude')
    this.rangeC.value      = this.get_num('phase')

    this.draw()
  } // update

  draw() {

    const shape = this.shapeSelect.value

    const freqGamma = this.get_num('frequency gamma')
    let frequency = Math.pow(this.rangeA.value, freqGamma) * (this.freqMax - this.freqMin) + this.freqMin

    if (frequency < 10) {
      frequency = Math.round(frequency * 10000) / 10000
    } else if (frequency < 100) {
      frequency = Math.round(frequency * 1000) / 1000
    } else if (frequency < 1000) {
      frequency = Math.round(frequency * 100) / 100
    } else if (frequency < 10000) {
      frequency = Math.round(frequency * 10) / 10
    } else {
      frequency = Math.round(frequency)
    }

    const amplitude = this.rangeB.value

    const phase = Math.round((this.rangeC.value) * 100) / 100

    this.valueA.innerHTML = frequency
    this.valueB.innerHTML = amplitude
    this.valueC.innerHTML = phase

    this.plotSine(shape, frequency, amplitude, phase)

  } // draw

  plotSine(shape, frequency, amplitude, phase) {

    const ctx = this.canvas.getContext('2d')

    ctx.fillStyle = 'rgba(255, 255, 255, 1)'
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    ctx.fillStyle = 'rgba(0, 0, 0, 0.9)'
    ctx.fillRect(0, this.canvas.height / 2, this.canvas.width, 1)

    const frame = 1
    const width = ctx.canvas.width
    const height = ctx.canvas.height - frame * 2

    ctx.beginPath()
    ctx.lineWidth = 0.5
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.9)'

    let x = 0
    let y = 0
    var freq = (width / (2 * Math.PI)) / frequency
    var apli = height / 2 * amplitude
    var phse = width / frequency * phase * (-1)

    let prev, temp_signal

    while (x < width) {

      let sine = Math.sin((x + phse) / freq) * (-1)

      if (shape == "square") {
        if (sine >= 0) {
          sine = 1
        } else {
          sine = -1
        }
      }

      if (shape == "triangle") {
        sine = Math.acos(sine) / (Math.PI / 2) - 1
      }

      if (shape == "saw") {

        sine = Math.acos(sine) / (Math.PI / 2) - 1

        if(sine <= prev) {
          temp_signal = sine / 2 - 0.5
        } else {
          temp_signal = sine * (-1) / 2 + 0.5
        }
        prev = sine
        sine = temp_signal
      }

      y = sine * apli + height / 2
      ctx.lineTo(x, y + frame)
      x = x + 1
    }

    ctx.stroke()
  }

  listener() {

    this.shapeSelect.addEventListener('input', () => {
      this.draw()
    }, false)
    this.rangeA.addEventListener('input', () => {
       this.draw()
    }, false)
    this.rangeB.addEventListener('input', () => {
       this.draw()
    }, false)
    this.rangeC.addEventListener('input', () => {
       this.draw()
    }, false)

    this.shapeSelect.addEventListener("change", () => {

      const data = this.get_data('shape')
      data.value = this.shapeSelect.value

      this.update_data(data)
      this.emit('update', this.data)

    })

    this.rangeA.addEventListener('change', () => {

      const data = this.get_data('frequency')
      data.value = parseFloat(this.rangeA.value)

      this.update_data(data)
      this.emit('update', this.data)

    }, false)

    this.rangeB.addEventListener('change', () => {

      const data = this.get_data('amplitude')
      data.value = parseFloat(this.rangeB.value)

      this.update_data(data)
      this.emit('update', this.data)

    }, false)

    this.rangeC.addEventListener('change', () => {

      const data = this.get_data('phase')
      data.value = parseFloat(this.rangeC.value)

      this.update_data(data)
      this.emit('update', this.data)

    }, false)

  } // listener

} // Sine

module.exports = Sine
