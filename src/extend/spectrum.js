
const Extend = require('../extend.js')

class Spectrum extends Extend {

  constructor(options, parent) {
    super()

    this.name          = 'spectrum'
    this.settingsWidth = options.settingsWidth
    this.margin        = options.margin
    this.audio         = options.audio
    this.parent        = parent

    const width       = options.settingsWidth - options.margin
    const height      = options.audio / 3 * 2
    const inputWidth  = Math.floor(width / 3) - options.margin / 4
    // const colorHeight = options.audio / 3

    const labelWidth  = '60px'
    const valueWidth  = '40px'
    const rangeWidth  = inputWidth - 90 - options.margin - 1 + 'px'

    const smallMargin = options.margin / 2 + 'px'

    this.div    = this.parentDiv()
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
    this.rangeA.step = 0.001

    this.valueA = document.createElement('SPAN')
    this.valueA.style.textAlign = 'right'
    this.valueA.style.width = '60px'
    this.valueA.style.paddingRight = smallMargin

    this.div.appendChild(this.labelA)
    this.div.appendChild(this.rangeA)
    this.div.appendChild(this.valueA)

    this.data
    this.frqMin
    this.frqMax

    this.array

  } // constructor

  init(data) {

    this.data = data

    const frqMinMax = this.get_data('color range')

    this.frqMin = frqMinMax.min
    this.frqMax = frqMinMax.max

    this.labelA.innerHTML = 'wavelength: '
    this.labelA.for = 'wavelength'
    this.rangeA.name = 'wavelength'

    const values = this.get_data('rgb')
    const rgb = [...values.values]
    rgb.reverse()

    const ctx = this.canvas.getContext('2d')

    const l = rgb.length - 1
    const w = this.canvas.width - 1

    for (let i = 0; i < this.canvas.width; i++) {

      let index = Math.round((w - i) / w * l)

      ctx.fillStyle = 'rgb(' + rgb[index][0] + ', ' + rgb[index][1] + ', ' + rgb[index][2] + ')'

      ctx.fillRect(i, 0, i+1, this.canvas.height)
    }

    this.update()

    this.comline()
  } // init

  update(data = this.data) {

    this.data = data

    const valueA = this.get_num('frequency')
    this.rangeA.value = valueA

    this.draw()
  } // update

  draw() {

    this.valueA.innerHTML = Math.round(this.project(this.frqMin, this.frqMax, 1 - this.rangeA.value)) + ' nm'
  }

  comline() {

    this.rangeA.addEventListener('input', () => {
      this.draw()
    }, false)

    this.rangeA.addEventListener('change', () => {

      const data = this.get_data('frequency')
      data.value = parseFloat(this.rangeA.value)

      this.update_data(data)
      this.emit('update', this.data)

    }, false)

  }
}

module.exports = Spectrum
