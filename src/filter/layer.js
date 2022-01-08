
const Extend = require('../extend.js')

const Film   = require('./film.js')
const Mask   = require('./mask.js')
const Link   = require('../extend/link.js')
const Select = require('../extend/select.js')

class Layer extends Extend{

  constructor(options, parent) {
    super()

    this.name          = 'layer'
    this.settingsWidth = options.settingsWidth
    this.margin        = options.margin
    this.parent        = parent
    this.parent        = this.parentDiv()
    this.div           = this.parentBorder()
    this.headline      = this.headSmall()

    this.options = options
    this.data
    this.type

    this.blend
    this.film
    this.masks = []

    this.array = []

    this.add
    this.rmv
  } // constructor

  init(data, type) {

    this.type = type
    this.data = data

    this.array = []

    if (this.data) {

      this.blend = new Select(this.options, this.div);
      this.blend.init(this.data[1][0])

      this.data[1][1].forEach((d, i) => {
        this.masks.push(new Mask(this.options, this.div))
        this.masks[i].init(d)
      })

      this.film = new Film(this.options, this.div);
      this.film.init(this.data[0], this.type)

    } else {
      this.headline.style.display = "none"
      this.div.style.display = "none"
    }

    const add = {
      label: 'add layer',
      color: 'green',
      display: 'select',
      value: 'add'
    }
    this.add = new Link(this.options, this.parent)
    this.add.init(add)

    let displayRemove = 'hidden'
    if(this.data) displayRemove = 'select'

    const rmv = {
      label: 'remove layer',
      color: 'red',
      display: displayRemove,
      value: 'rmv'
    }
    this.rmv = new Link(this.options, this.parent)
    this.rmv.init(rmv)

    this.comline()
  } // update

  comline() {

    if (this.data) {

      this.blend.on('update', (d) => {
        this.data[1][0] = d
        this.emit('update', this.data)
      })

      this.film.on('update', (d) => {
        this.data[0] = d
        this.emit('update', this.data)
      })

      this.masks.forEach((item, i) => {
        item.on('update', (data) => {
          this.data[1][1][i] = data

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

  } // comline END

} // Layer

module.exports = Layer
