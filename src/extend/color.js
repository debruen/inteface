
const Events = require('events')

class Color extends Events{

  constructor(options, div) {
    super()

    this.data
    this.colorspace

    const width       = options.width - options.margin
    const height      = options.audio / 3 * 2
    const colorWidth  = Math.floor(width / 3) - options.margin / 4
    const colorHeight = options.audio / 3

    const labelWidth  = '8px'
    const valueWidth  = '34px'
    const rangeWidth  = colorWidth - 42 - options.margin - 1 + 'px'

    const smallMargin = options.margin / 2 + 'px'

    this.div = document.createElement('DIV')
    this.div.style.display = 'inline-block'
    this.div.style.marginTop = smallMargin

    this.canvas = document.createElement('CANVAS')
    this.canvas.style.display = 'inline-block'
    this.canvas.width = width
    this.canvas.height = height

    this.div.appendChild(this.canvas)

    this.canvasA = document.createElement('CANVAS')
    this.canvasA.style.display = 'inline-block'
    this.canvasA.style.marginRight = smallMargin
    this.canvasA.width = colorWidth
    this.canvasA.height = colorHeight

    this.div.appendChild(this.canvasA)

    this.canvasB = document.createElement('CANVAS')
    this.canvasB.style.display = 'inline-block'
    this.canvasB.style.marginRight = smallMargin
    this.canvasB.width = colorWidth
    this.canvasB.height = colorHeight

    this.div.appendChild(this.canvasB)

    this.canvasC = document.createElement('CANVAS')
    this.canvasC.style.display = 'inline-block'
    this.canvasC.width = colorWidth
    this.canvasC.height = colorHeight

    this.div.appendChild(this.canvasC)

    this.labelA = document.createElement('LABEL')
    this.labelA.style.display = 'inline-block'
    this.labelA.style.marginRight = smallMargin
    this.labelA.style.width = labelWidth

    this.rangeA = document.createElement('INPUT')
    this.rangeA.type = 'range'
    this.rangeA.style.width = rangeWidth
    this.rangeA.style.marginRight = smallMargin

    this.valueA = document.createElement('SPAN')
    this.valueA.style.display = 'inline-block'
    this.valueA.style.textAlign = 'right'
    this.valueA.style.width = valueWidth
    this.valueA.style.paddingRight = smallMargin

    this.div.appendChild(this.labelA)
    this.div.appendChild(this.rangeA)
    this.div.appendChild(this.valueA)

    this.labelB = document.createElement('LABEL')
    this.labelB.style.display = 'inline-block'
    this.labelB.style.marginRight = smallMargin
    this.labelB.style.width = labelWidth

    this.rangeB = document.createElement('INPUT')
    this.rangeB.type = 'range'
    this.rangeB.style.width = rangeWidth
    this.rangeB.style.marginRight = smallMargin

    this.valueB = document.createElement('SPAN')
    this.valueB.style.display = 'inline-block'
    this.valueB.style.textAlign = 'right'
    this.valueB.style.width = valueWidth
    this.valueB.style.paddingRight = smallMargin

    this.div.appendChild(this.labelB)
    this.div.appendChild(this.rangeB)
    this.div.appendChild(this.valueB)

    this.labelC = document.createElement('LABEL')
    this.labelC.style.display = 'inline-block'
    this.labelC.style.marginRight = smallMargin
    this.labelC.style.width = labelWidth

    this.rangeC = document.createElement('INPUT')
    this.rangeC.type = 'range'
    this.rangeC.style.width = rangeWidth
    this.rangeC.style.marginRight = smallMargin

    this.valueC = document.createElement('SPAN')
    this.valueC.style.display = 'inline-block'
    this.valueC.style.textAlign = 'right'
    this.valueC.style.width = parseInt(valueWidth) - 2 + 'px'
    // this.valueC.style.paddingRight = smallMargin

    this.div.appendChild(this.labelC)
    this.div.appendChild(this.rangeC)
    this.div.appendChild(this.valueC)

    div.appendChild(this.div)

  } // constructor

  init(data, colorspace) {

    this.data = data

    this.colorspace = colorspace

    this.labelA.for = 'channelA'
    this.rangeA.name = 'channelA'

    this.rangeA.min = this.data.min
    this.rangeA.max = this.data.max
    this.rangeA.step = 0.001

    this.labelB.for = 'channelB'
    this.rangeB.name = 'channelB'

    this.rangeB.min = this.data.min
    this.rangeB.max = this.data.max
    this.rangeB.step = 0.001

    this.labelC.for = 'channelC'
    this.rangeC.name = 'channelC'

    this.rangeC.min = this.data.min
    this.rangeC.max = this.data.max
    this.rangeC.step = 0.001

    this.update(this.data, colorspace)

    this.listener()
  } // init

  update(data, colorspace) {

    this.data = data
    this.colorspace = colorspace

    this.rangeA.value = this.data.a
    this.rangeB.value = this.data.b
    this.rangeC.value = this.data.c

    if(this.colorspace == 'HSL') {
      this.labelA.innerHTML = 'H'
      this.labelB.innerHTML = 'S'
      this.labelC.innerHTML = 'L'
    }
    if(this.colorspace == 'RGB') {
      this.labelA.innerHTML = 'R'
      this.labelB.innerHTML = 'G'
      this.labelC.innerHTML = 'B'
    }
    if(this.colorspace == 'Lab') {
      this.labelA.innerHTML = 'L'
      this.labelB.innerHTML = 'a'
      this.labelC.innerHTML = 'b'
    }
    if(this.colorspace == 'LCh') {
      this.labelA.innerHTML = 'L'
      this.labelB.innerHTML = 'C'
      this.labelC.innerHTML = 'h'
    }

    this.draw()
  } // update

  draw() {

    const ctx = this.canvas.getContext('2d')

    const ctxA = this.canvasA.getContext('2d')
    const ctxB = this.canvasB.getContext('2d')
    const ctxC = this.canvasC.getContext('2d')

    const gradientA = ctxA.createLinearGradient(0, 0, this.canvasA.width, 0)
    const gradientB = ctxB.createLinearGradient(0, 0, this.canvasB.width, 0)
    const gradientC = ctxC.createLinearGradient(0, 0, this.canvasC.width, 0)

    if(this.colorspace == 'HSL') {
      const h = Math.round(this.rangeA.value * 360 * 10) / 10
      const s = Math.round(this.rangeB.value * 100 * 10) / 10
      const l = Math.round(this.rangeC.value * 100 * 10) / 10
      this.valueA.innerHTML = h + '°'
      this.valueB.innerHTML = s + '%'
      this.valueC.innerHTML = l + '%'
      ctx.fillStyle = 'hsl(' + h + ', ' + s + '%, ' + l + '%)'

      for (let i = 0; i <= 360; i++) {
        gradientA.addColorStop(i / 360, 'hsl(' + i + ', ' + s + '%, ' + l + '%)')
      }

      gradientB.addColorStop(0, 'hsl(' + h + ', 0%, ' + l + '%)')
      gradientB.addColorStop(1, 'hsl(' + h + ', 100%, ' + l + '%)')

      gradientC.addColorStop(0, 'hsl(' + h + ', ' + s + '%, 0%)')
      gradientC.addColorStop(1, 'hsl(' + h + ', ' + s + '%, 100%)')

    }
    if(this.colorspace == 'RGB') {
      const r = Math.round(this.rangeA.value * 255)
      const g = Math.round(this.rangeB.value * 255)
      const b = Math.round(this.rangeC.value * 255)
      this.valueA.innerHTML = r
      this.valueB.innerHTML = g
      this.valueC.innerHTML = b
      ctx.fillStyle = 'rgb(' + r + ', ' + g + ', ' + b + ')'

      gradientA.addColorStop(0, 'rgb(0, ' + g + ', ' + b + ')')
      gradientA.addColorStop(1, 'rgb(255, ' + g + ', ' + b + ')')

      gradientB.addColorStop(0, 'rgb(' + r + ', 0, ' + b + ')')
      gradientB.addColorStop(1, 'rgb(' + r + ', 255, ' + b + ')')

      gradientC.addColorStop(0, 'rgb(' + r + ', ' + g + ', 0)')
      gradientC.addColorStop(1, 'rgb(' + r + ', ' + g + ', 255)')
    }
    if(this.colorspace == 'Lab') {
      const l = this.rangeA.value * 100
      const a = this.rangeB.value * 320 - 160
      const b = this.rangeC.value * 320 - 160
      this.valueA.innerHTML = Math.round(l * 100) / 100
      this.valueB.innerHTML = Math.round(a * 100) / 100
      this.valueC.innerHTML = Math.round(b * 100) / 100

      ctx.fillStyle = 'lab(' + l + '% , ' + a + ', ' + b + ')'

      gradientA.addColorStop(0, 'lab(0%, ' + a + ', ' + b + ')')
      gradientA.addColorStop(1, 'lab(100%, ' + a + ', ' + b + ')')

      gradientB.addColorStop(0, 'lab(' + l + '% , -160, ' + b + ')')
      gradientB.addColorStop(1, 'lab(' + l + '% , +160, ' + b + ')')

      gradientC.addColorStop(0, 'lab(' + l + '% , ' + a + ', -160)')
      gradientC.addColorStop(1, 'lab(' + l + '% , ' + a + ', +160)')

    }
    if(this.colorspace == 'LCh') {
      const l = Math.round(this.rangeA.value * 100 * 10000) / 10000
      const c = Math.round((this.rangeB.value * 200) * 10000) / 10000
      const h = Math.round(this.rangeC.value * 360 * 10000) / 10000
      this.valueA.innerHTML = l
      this.valueB.innerHTML = c
      this.valueC.innerHTML = h + '°'
      ctx.fillStyle = 'lch(' + l + ', ' + c + ', ' + h + ')'
    }

    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    ctxA.fillStyle = gradientA
    ctxB.fillStyle = gradientB
    ctxC.fillStyle = gradientC

    ctxA.fillRect(0, 0, this.canvasA.width, this.canvasA.height)
    ctxB.fillRect(0, 0, this.canvasB.width, this.canvasB.height)
    ctxC.fillRect(0, 0, this.canvasC.width, this.canvasC.height)
  } // draw

  listener() {

    let timeout = false   // holder for timeout id
    const delay = Math.floor(Math.random() * 10)     // delay after event is 'complete' to run callback
    //
    this.rangeA.addEventListener('input', () => {
       this.draw()
    }, false)
    this.rangeB.addEventListener('input', () => {
       this.draw()
    }, false)
    this.rangeC.addEventListener('input', () => {
       this.draw()
    }, false)

    this.rangeA.addEventListener('change', () => {

      this.data.a = parseFloat(this.rangeA.value)

      clearTimeout(timeout)
      timeout = setTimeout(() => {
        this.emit('update', this.data)
      }, delay)

    }, false)

    this.rangeB.addEventListener('change', () => {

      this.data.b = parseFloat(this.rangeB.value)

      clearTimeout(timeout)
      timeout = setTimeout(() => {
        this.emit('update', this.data)
      }, delay)

    }, false)

    this.rangeC.addEventListener('change', () => {

      this.data.c = parseFloat(this.rangeC.value)

      clearTimeout(timeout)
      timeout = setTimeout(() => {
        this.emit('update', this.data)
      }, delay)

    }, false)

  } // listener

} // Color

module.exports = Color
