
const Select = require('./elements/select.js')
const Range  = require('./elements/range.js')
const Files  = require('./elements/files.js')

const Events = require('events')

class Input extends Events{

  constructor(options) {
    super()

    this.div = document.createElement('div')
    this.div.style.display = 'block'
    this.div.style.width = options.width - options.margin + 'px'
    this.div.style.margin = options.margin + 'px'
    document.body.appendChild(this.div)

    this.headline = document.createElement('div')
    this.headline.style.display = 'block'
    this.headline.style.width = '100%'
    this.headline.style.fontWeight = 'bold'
    this.headline.style.borderBottom = '1px solid currentcolor'
    this.headline.innerHTML = "input"
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
      if(Array.isArray(d)) {
        this.array.push(new Files(this.options, this.div))
        this.array[i].init(this.data)
      }
    })

    this.listener()
  } // init END

  update(data = this.data) {

    this.data = data

    this.data.forEach((d, i) => {
      if(d.select == "select" || d.select == "range") {
        this.array[i].update(d)
      }
      if(Array.isArray(d)) {
        this.array[i].update(this.data)
      }
    })

  } // update END

  listener() {

    this.data.forEach((d, i) => {
      if(d.select == "select" || d.select == "range") {

        this.array[i].on('update', (data) => {
          this.data[i].value = data.value
          this.emit('update', this.data)
        })
      }
      if(Array.isArray(d)) {

        this.array[i].on('update', (data) => {
          this.data[6] = data
          this.emit('update', this.data)
        })
      }
    })

  } // listener END

} // Input END

module.exports = Input
