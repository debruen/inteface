
const Select = require('./elements/select.js')
const Range  = require('./elements/range.js')
const Button  = require('./elements/button.js')

const Events = require('events')

class Output extends Events{

  constructor(options) {
    super()

    this.div = document.createElement('DIV')
    this.div.style.display = 'block'
    this.div.style.width = options.width - options.margin + 'px'
    this.div.style.margin = options.margin + 'px'
    document.body.appendChild(this.div)

    this.headline = document.createElement('div')
    this.headline.style.display = 'block'
    this.headline.style.width = '100%'
    this.headline.style.fontWeight = 'bold'
    // this.headline.style.marginBottom = options.margin + 'px'
    this.headline.style.borderBottom = '1px solid currentcolor'
    this.headline.innerHTML = "output"
    this.div.appendChild(this.headline)

    this.options = options

    this.data

    this.array = []

  } // constructor END

  init(data) {

    this.data = data

    this.data.forEach((d, i) => {
      if(d.select == "select") {
        this.array.push(new Select(this.options, this.div))
        this.array[i].init(d)
      }
      if(d.select == "range") {
        this.array.push(new Range(this.options, this.div))
        this.array[i].init(d)
      }
      if(d.select == "button") {
        this.array.push(new Button(this.options, this.div))
        this.array[i].init(d)
      }
    })

    this.listener()
  } // init

  update(data = this.data) {

    this.data = data

    this.data.forEach((d, i) => {
      this.array[i].update(d)
    })

  } // draw

  listener() {

    this.data.forEach((d, i) => {

      this.array[i].on('update', (data) => {
        this.data[i].value = data.value
        this.emit('update', this.data)
      })

    })

  } // listener

} // Transform

module.exports = Output
