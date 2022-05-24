
const Extend = require('../extend.js')

const Spectrum = require('../extend/spectrum.js')
const Sine     = require('../extend/sine.js')

class Film extends Extend {

  constructor(options, parent) {
    super()

    this.name          = 'film'
    this.settingsWidth = options.settingsWidth
    this.margin        = options.margin
    this.parent        = parent

    this.div      = this.parentDiv()
    this.headline = this.headSmall()

    this.options = options

    this.type
    this.data

    this.film
  }

  init(data, type) {

    this.type = type
    this.data = data

    // this.array = []

    if(this.type == 'image') {
      this.film = new Spectrum(this.options, this.div)
      this.film.init(this.data)

    } else {
      this.film = new Sine(this.options, this.div)
      this.film.init(this.data)
    }

    this.comline()
  }

  comline() {

    this.film.on('update', (d) => {
      this.data = d
      this.emit('update', this.data)
    })

  }

}

module.exports = Film
