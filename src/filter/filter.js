
const Events = require('events')

const Select = require('../elements/select.js')
const Range  = require('../elements/range.js')
const Files  = require('../elements/files.js')
const Color  = require('../elements/color.js')
const Sine   = require('../elements/sine.js')
const Link   = require('../elements/link.js')

class Filter extends Events{

  constructor(options, div) {
    super()

    this.div = document.createElement('div')
    this.div.style.display = 'block'
    this.div.style.overflow = 'hidden'
    this.div.style.width = options.width - options.margin + 'px'
    this.div.style.borderBottom = '1px solid #000'

    div.appendChild(this.div)

    this.options = options
    this.data
    this.array = []

    this.add
    this.rmv
  } // constructor

  init(data) {

    this.data = data

    this.update()
    this.listener()
  } // init

  update(data = this.data) {

    this.data = data
    // this.array = []

    if (this.data) {
      this.data.forEach((d, i) => {
        if(d.select == "select") {
          this.array.push(new Select(this.options, this.div))
          this.array[i].init(d)
        }
        if(d.select == "range") {
          this.array.push(new Range(this.options, this.div))
          this.array[i].init(d)
        }
        if(d.select == "color") {
          this.array.push(new Color(this.options, this.div))
          this.array[i].init(d, this.data[3].value)
        }
        if(d.select == "sine") {
          this.array.push(new Sine(this.options, this.div))
          this.array[i].init(d, this.data[3].value)
        }
      })
    }

    const add = {
      label: 'add filter',
      color: 'green',
      display: 'select',
      value: 'add'
    }
    this.add = new Link(this.options, this.div)
    this.add.init(add)

    let displayRemove = 'hidden'
    if(this.data) displayRemove = 'select'

    const rmv = {
      label: 'remove filter',
      color: 'red',
      display: displayRemove,
      value: 'rmv'
    }
    this.rmv = new Link(this.options, this.div)
    this.rmv.init(rmv)

  } // update

  listener() {

    if (this.data) {
      this.array.forEach((item, i) => {
        item.on('update', (data) => {
          this.data[i] = data

          this.emit('update', this.data)
        })
      })
    }

    this.add.on('update', (data) => {
      this.emit('update', data)
    })

    this.rmv.on('update', (data) => {
      this.emit('update', data)
    })

  } // listener END

} // Layer

module.exports = Filter
