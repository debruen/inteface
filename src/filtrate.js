
const Filter = require('./filter/filter.js')

const Events = require('events')

class Filtrate extends Events{

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
    this.headline.innerHTML = "filter"
    this.div.appendChild(this.headline)

    this.options = options

    this.data // the filter data array

    this.array = []

  } // constructor

  init(data) {

    this.update(data)
  } // init

  update(data) {

    this.data = data.filter

    let div = this.div.querySelectorAll('div')
    for(let i = 1; i < div.length; i++) {
      div[i].parentNode.removeChild(div[i])
    }

    this.array = []

    this.data.forEach((item, i) => {
      this.array.push(new Filter(this.options, this.div))
      this.array[i].init(item)
    })

    if(this.data.length == 0) {
      this.array.push(new Filter(this.options, this.div))
      this.array[0].init()
    }
    this.listener()
  } // init

  listener() {

    this.array.forEach((item, i) => {
      item.on('update', (data) => {
        console.log(data)
        console.log(this.data)
        if (data == 'add') {
          if (this.data.length == 0) {
            this.data.push(data)
          } else {
            this.data.splice(i + 1, 0, data)
          }

        } else if (data == 'rmv') {
          this.data.splice(i, 1)
        } else {
          this.data[i] = data
        }
        console.log(this.data)
        this.emit('update', this.data)
      })
    })

  } // send

} // Layer

module.exports = Filtrate
