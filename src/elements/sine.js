
const Events = require('events')

class Sine extends Events{

  constructor(options, div) {
    super()

    this.data
    this.waveform

    const width       = options.width - options.margin
    const height      = options.audio / 3 * 2
    const inputWidth  = Math.floor(width / 3) - options.margin / 4
    // const colorHeight = options.audio / 3

    const labelWidth  = '50px'
    const valueWidth  = '40px'
    const rangeWidth  = inputWidth - 90 - options.margin - 1 + 'px'

    const smallMargin = options.margin / 2 + 'px'

    this.div = document.createElement('DIV')
    this.div.style.display = 'inline-block'
    this.div.style.marginTop = smallMargin

    this.canvas = document.createElement('CANVAS')
    this.canvas.style.display = 'inline-block'
    this.canvas.width = width
    this.canvas.height = height

    this.div.appendChild(this.canvas)

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

  init(data, waveform) {

    this.data = data

    this.waveform = waveform

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

    this.update(this.data, waveform)

    this.listener()
  } // init

  update(data, waveform) {

    this.data = data
    this.waveform = waveform

    this.rangeA.value = this.data.a
    this.rangeB.value = this.data.b
    this.rangeC.value = this.data.c

    this.labelA.innerHTML = 'frequency'
    this.labelB.innerHTML = 'amplitude'
    this.labelC.innerHTML = 'phase'

    this.draw()
  } // update

  draw() {

    let frequency = Math.pow(this.rangeA.value, 6) * (21000 - 16) + 16

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

    let amplitude = Math.round(this.rangeB.value * 100) / 100
    let phase = Math.round((this.rangeC.value * 2 - 1) * 100) / 100

    this.valueA.innerHTML = frequency
    this.valueB.innerHTML = amplitude
    this.valueC.innerHTML = phase

    const ctx = this.canvas.getContext('2d')

    ctx.fillStyle = 'rgba(255, 255, 255, 1)'
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    ctx.fillStyle = 'rgba(0, 0, 0, 0.9)'
    ctx.fillRect(0, this.canvas.height / 2, this.canvas.width, 1)

    this.plotSine(ctx, frequency, amplitude, phase)

  } // draw

  plotSine(ctx, frequency, amplitude, phase) {

    const frame = 1
    const width = ctx.canvas.width;
    const height = ctx.canvas.height - frame * 2

    ctx.beginPath();
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = "rgba(0, 0, 0, 0.9)";

    var x = 0;
    var y = 0;
    var freq = (width / (2 * Math.PI)) / frequency;
    var apli = height / 2 * amplitude;
    var phse = width / frequency * phase * (-1);

    console.log('frequency: ' + freq);

    let prev, temp_signal

    while (x < width) {

      let sine = Math.sin((x + phse) / freq) * (-1)

      if (this.waveform == "Square") {
        if (sine >= 0) {
          sine = 1
        } else {
          sine = -1
        }
      }

      if (this.waveform == "Triangle") {
        sine = Math.acos(sine) / (Math.PI / 2) - 1
      }

      if (this.waveform == "Sawtooth") {

        sine = Math.acos(sine) / (Math.PI / 2) - 1;

        if(sine <= prev) {
          temp_signal = sine / 2 - 0.5;
        } else {
          temp_signal = sine * (-1) / 2 + 0.5;
        }
        prev = sine;
        sine = temp_signal;
      }

      y = sine * apli + height / 2;
      ctx.lineTo(x, y + frame);
      x = x + 1;
    }

    ctx.stroke();
  }

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
        console.log(this.data.label + ' update')
        this.emit('update', this.data)
      }, delay)

    }, false)

    this.rangeB.addEventListener('change', () => {

      this.data.b = parseFloat(this.rangeB.value)

      clearTimeout(timeout)
      timeout = setTimeout(() => {
        console.log(this.data.label + ' update')
        this.emit('update', this.data)
      }, delay)

    }, false)

    this.rangeC.addEventListener('change', () => {

      this.data.c = parseFloat(this.rangeC.value)

      clearTimeout(timeout)
      timeout = setTimeout(() => {
        console.log(this.data.label + ' update')
        this.emit('update', this.data)
      }, delay)

    }, false)

  } // listener

} // Sine

module.exports = Sine
