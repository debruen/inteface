
const Extend = require('../extend.js')

class Gradient extends Extend{

  constructor(options, parent) {
    super()

    this.name          = 'gradient'
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

    this.freqLabel = document.createElement('LABEL')
    this.freqLabel.style.marginRight = smallMargin

    this.freqRange = document.createElement('INPUT')
    this.freqRange.type = 'range'
    this.freqRange.style.width = rangeWidth
    this.freqRange.style.marginRight = smallMargin

    this.freqValue = document.createElement('SPAN')
    this.freqValue.style.display = 'inline-block'
    this.freqValue.style.textAlign = 'right'
    this.freqValue.style.width = valueWidth
    this.freqValue.style.paddingRight = smallMargin

    this.div.appendChild(this.freqLabel)
    this.div.appendChild(this.freqRange)
    this.div.appendChild(this.freqValue)

    this.amplLabel = document.createElement('LABEL')
    this.amplLabel.style.marginRight = smallMargin

    this.amplRange = document.createElement('INPUT')
    this.amplRange.type = 'range'
    this.amplRange.style.width = rangeWidth
    this.amplRange.style.marginRight = smallMargin
    this.amplRange.min = 0
    this.amplRange.max = 1
    this.amplRange.step = 0.001

    this.amplValue = document.createElement('SPAN')
    this.amplValue.style.display = 'inline-block'
    this.amplValue.style.textAlign = 'right'
    this.amplValue.style.width = '30px'
    this.amplValue.style.paddingRight = smallMargin

    this.div.appendChild(this.amplLabel)
    this.div.appendChild(this.amplRange)
    this.div.appendChild(this.amplValue)

    this.phasLabel = document.createElement('LABEL')
    this.phasLabel.style.marginRight = smallMargin

    this.phasRange = document.createElement('INPUT')
    this.phasRange.type = 'range'
    this.phasRange.style.width = rangeWidth
    this.phasRange.style.marginRight = smallMargin
    this.phasRange.min = 0
    this.phasRange.max = 1
    this.phasRange.step = 0.01

    this.phasValue = document.createElement('SPAN')
    this.phasValue.style.display = 'inline-block'
    this.phasValue.style.textAlign = 'right'
    this.phasValue.style.width = '20px'
    this.phasValue.style.paddingRight = smallMargin

    this.div.appendChild(this.phasLabel)
    this.div.appendChild(this.phasRange)
    this.div.appendChild(this.phasValue)

    this.tiltLabel = document.createElement('LABEL')
    this.tiltLabel.style.marginRight = smallMargin

    this.tiltRange = document.createElement('INPUT')
    this.tiltRange.type = 'range'
    this.tiltRange.style.width = rangeWidth
    this.tiltRange.style.marginRight = smallMargin
    this.tiltRange.min = 0
    this.tiltRange.max = 1
    this.tiltRange.step = 0.001

    this.tiltValue = document.createElement('SPAN')
    this.tiltValue.style.display = 'inline-block'
    this.tiltValue.style.textAlign = 'right'
    this.tiltValue.style.width = valueWidth
    this.tiltValue.style.paddingRight = smallMargin

    this.div.appendChild(this.tiltLabel)
    this.div.appendChild(this.tiltRange)
    this.div.appendChild(this.tiltValue)

    this.filterLabel = document.createElement('LABEL')
    this.filterLabel.style.marginRight = smallMargin + 'px'

    this.filterSelect = document.createElement('SELECT')

    this.div.appendChild(this.filterLabel)
    this.div.appendChild(this.filterSelect)

    parent.appendChild(this.div)

    this.data

  } // constructor

  init(data) {

    this.data = data

    const freqMinMax = this.get_data('frequency range')

    this.freqMin = freqMinMax.values[0]
    this.freqMax = freqMinMax.values[1]

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

    const frequency = this.get_data('frequency')

    this.freqLabel.innerHTML = frequency.name + ': '
    this.freqLabel.for = frequency.name
    this.freqRange.name = frequency.name

    this.freqRange.min = frequency.min
    this.freqRange.max = frequency.max
    this.freqRange.step = 0.001

    this.amplLabel.innerHTML = 'amplitude: '
    this.amplLabel.for = 'amplitude'
    this.amplRange.name = 'amplitude'

    this.phasLabel.innerHTML = 'phase: '
    this.phasLabel.for = 'phase'
    this.phasRange.name = 'phase'

    this.tiltLabel.innerHTML = 'tilt: '
    this.tiltLabel.for = 'tilt'
    this.tiltRange.name = 'tilt'

    const filter = this.get_data('filter')

    this.filterLabel.innerHTML = filter.name + ':'
    this.filterLabel.for = filter.name

    this.filterSelect.name = filter.name
    for (let i = 0; i < filter.options.length; i++) {
      let option = document.createElement('option')
      option.text = filter.options[i]
      option.value = filter.options[i]
      this.filterSelect.add(option)
    }

    this.update()

    this.listener()
  } // init

  update(data = this.data) {

    this.data = data

    this.shapeSelect.value = this.get_string('shape')

    this.freqRange.value = this.get_num('frequency')
    this.amplRange.value = this.get_num('amplitude')
    this.phasRange.value = this.get_num('phase')

    this.tiltRange.value = this.get_num('tilt')

    this.filterSelect.value = this.get_string('filter')

    this.draw()
  } // update

  draw() {

    const shape = this.shapeSelect.value

    const freqGamma = this.get_num('frequency gamma')

    let frequency = Math.pow(this.freqRange.value, freqGamma)
    frequency = this.project(this.freqMin, this.freqMax, frequency)

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

    const amplitude = this.amplRange.value

    const phase = this.phasRange.value

    const tilt = this.tiltRange.value * 360 + '°'

    this.freqValue.innerHTML = frequency
    this.amplValue.innerHTML = amplitude
    this.phasValue.innerHTML = phase
    this.tiltValue.innerHTML = tilt

    this.plotSine(shape, frequency, amplitude, phase)

  } // draw

  plotSine(shape, frequency, amplitude, phase) {

    const ctx = this.canvas.getContext('2d')

    ctx.fillStyle = 'rgba(255, 255, 255, 1)'
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    // ctx.fillStyle = 'rgba(0, 0, 0, 0.9)'
    // ctx.fillRect(0, this.canvas.height / 2, this.canvas.width, 1)

    const frame = 1
    const width = ctx.canvas.width
    const height = ctx.canvas.height - frame * 2

    ctx.beginPath()
    ctx.lineWidth = 0.5
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.9)'

    let x = 0
    let y = 0
    let freq = (width / (2 * Math.PI)) / frequency
    let apli = height / 2 * amplitude
    let phse = width / frequency * phase * (-1)

    let ypsi = 2

    let ph_pat = parseFloat((phase - 1 / Math.pow(ypsi, ypsi)).toFixed(10))

    let phse_pat = width / frequency * ph_pat * (-1)

    let prev, temp_signal

    while (x < width) {

      let sine = Math.sin((x + phse) / freq) * (-1)

      let sine_pat = Math.sin((x + phse_pat) / (freq * ypsi)) * (-1)

      sine_pat = (Math.pow(((sine_pat * (-1) + 1) / 2) , Math.pow(ypsi, 2)) * 2 - 1) * (-1)

      // sine = (((sine + 1) / 2) - ((sine_pat + 1) / 2)) * 2 + 1
      // sine = sine_pat

      if(sine > 1) sine = 1

      if (shape == "square") {
        if (sine >= 0) {
          sine = 1
        } else {
          sine = -1
        }
      }

      if (shape == "triangle") {
        sine = Math.acos(sine) / (Math.PI / 2) - 1

        sine = sine * -1
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

        sine = sine * -1
      }

      if (frequency == 0) {
        y = height - apli * 2
      } else {
        y = sine * apli + height / 2 + (height / 2 - apli)
      }

      ctx.lineTo(x, y + frame)
      x = x + 1
    }

    ctx.stroke()
  }

  listener() {

    this.shapeSelect.addEventListener('input', () => {
      this.draw()
    }, false)
    this.freqRange.addEventListener('input', () => {
       this.draw()
    }, false)
    this.amplRange.addEventListener('input', () => {
       this.draw()
    }, false)
    this.phasRange.addEventListener('input', () => {
       this.draw()
    }, false)
    this.tiltRange.addEventListener('input', () => {
       this.draw()
    }, false)
    this.filterSelect.addEventListener('input', () => {
      this.draw()
    }, false)

    this.shapeSelect.addEventListener("change", () => {

      const data = this.get_data('shape')
      data.value = this.shapeSelect.value

      this.update_data(data)
      this.emit('update', this.data)

    })

    this.freqRange.addEventListener('change', () => {

      const data = this.get_data('frequency')
      data.value = parseFloat(this.freqRange.value)

      this.update_data(data)
      this.emit('update', this.data)

    }, false)

    this.amplRange.addEventListener('change', () => {

      const data = this.get_data('amplitude')
      data.value = parseFloat(this.amplRange.value)

      this.update_data(data)
      this.emit('update', this.data)

    }, false)

    this.phasRange.addEventListener('change', () => {

      const data = this.get_data('phase')
      data.value = parseFloat(this.phasRange.value)

      this.update_data(data)
      this.emit('update', this.data)

    }, false)

    this.tiltRange.addEventListener('change', () => {

      const data = this.get_data('tilt')
      data.value = parseFloat(this.tiltRange.value)

      this.update_data(data)
      this.emit('update', this.data)

    }, false)

    this.filterSelect.addEventListener("change", () => {

      const data = this.get_data('filter')
      data.value = this.filterSelect.value

      this.update_data(data)
      this.emit('update', this.data)

    })

  } // listener

} // Gradient

module.exports = Gradient
