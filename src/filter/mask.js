
const Extend = require('../extend.js')

const Gradient = require('../extend/gradient.js')

class Mask extends Extend {

  constructor(options, parent) {
    super()

    this.name          = 'mask'
    this.settingsWidth = options.settingsWidth
    this.margin        = options.margin
    this.parent        = parent

    this.div      = this.parentDiv()
    this.headline = this.headSmall()

    this.options = options

    this.data

    this.mask
  }

  init(data) {

    this.data = data

    this.mask = new Gradient(this.options, this.div)
    this.mask.init(this.data)

    this.comline()
  }

  comline() {

    this.mask.on('update', (d) => {
      this.data = d
      this.emit('update', this.data)
    })

  }

}

module.exports = Mask
