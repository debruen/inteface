
const Events = require('events')

class Range extends Events{

  constructor(options, div) {
    super()

    this.data

    this.div = document.createElement('DIV')
    this.div.style.display = 'inline-block'
    this.div.style.marginRight = options.margin + 'px'
    this.div.style.marginTop = options.margin / 2 + 'px'

    this.label = document.createElement('LABEL')
    this.label.style.marginRight = options.margin / 2 + 'px'

    this.range = document.createElement('INPUT')
    this.range.type = 'range'
    this.range.style.marginRight = options.margin / 2 + 'px'

    this.value = document.createElement('SPAN')
    this.value.style.display = 'inline-block'
    this.value.style.textAlign = 'right'

    this.div.appendChild(this.label)
    this.div.appendChild(this.range)
    this.div.appendChild(this.value)

    div.appendChild(this.div)

  } // constructor

  init(data) {

    this.data = data

    this.label.innerHTML = data.label + ':'
    this.label.for = data.label

    this.range.name = data.label

    this.range.min = data.min
    this.range.max = data.max

    if(data.type == 'int') {
      this.range.step = 1
      this.value.style.width = '14px'
    } else if(data.type == 'time') {
      this.range.step = 250
      this.value.style.width = '64px'
    } else {
      this.value.style.width = '22px'
      this.range.step = 0.00001
    }

    this.update()

    this.listener()
  } // init

  update(data = this.data) {

    this.data = data

    this.range.value = data.value

    if (this.data.display == 'value') {
      this.range.style.display = 'none'
    } else {
      this.range.style.display = 'inline'
    }

    this.draw()
  } // update

  draw() {

    if(this.data.type == 'int') {
      this.value.innerHTML = this.range.value
    } else if(this.data.type == 'time') {
      function msToTime(s) {

        // Pad to 2 or 3 digits, default is 2
        function pad(n, z) {
          z = z || 2;
          return ('00' + n).slice(-z);
        }

        var ms = s % 1000;
        s = (s - ms) / 1000;
        var secs = s % 60;
        s = (s - secs) / 60;
        var mins = s % 60;
        var hrs = (s - mins) / 60;

        return pad(hrs) + ':' + pad(mins) + ':' + pad(secs) + '.' + pad(ms, 3);
      }
      this.value.innerHTML = msToTime(this.range.value)
    } else if (this.data.type == 'float') {
      this.value.innerHTML = Math.round(this.range.value * 1000) / 1000
    }

  } // draw

  listener() {

    let timeout = false   // holder for timeout id
    const delay = Math.floor(Math.random() * 10)     // delay after event is "complete" to run callback

    this.range.addEventListener("input", () => {
      this.draw()
    }, false)

    this.range.addEventListener("change", () => {

      if(this.data.type == 'int' || this.data.type == 'time') {
        this.data.value = parseInt(this.range.value)
      } else {
        this.data.value = parseFloat(this.range.value)
      }

      clearTimeout(timeout)
      timeout = setTimeout(() => {
        console.log(this.data.label + ' update')
        this.emit('update', this.data)
      }, delay)

    }, false)

  } // listener

} // Range

module.exports = Range
