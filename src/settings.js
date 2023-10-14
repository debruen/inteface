
const Extend = require('./extend.js')

const Select = require('./extend/select.js')
const Range  = require('./extend/range.js')

class Settings extends Extend{

  constructor(options) {
    super()

    this.id            = 'settings'
    this.name          = 'settings'
    this.settingsWidth = options.settingsWidth
    this.margin        = options.margin

    this.div      = this.mainDiv()
    this.headline = this.headDiv()

    this.options = options

    this.data

    this.array = []
  } // constructor END

  init(data) {

    this.data = data

    this.data.forEach((d, i) => {
      if(d.form == "select") {
        this.array.push(new Select(this.options, this.div))
        this.array[i].init(d)
      }
      if(d.form == "range") {
        this.array.push(new Range(this.options, this.div))
        this.array[i].init(d)
      }
    })

    this.comline()
    this.send()
  } // init END

  update(data = this.data) {

    this.data = data

    this.data.forEach((d) => {
      this.update_array(d);
    })

  } // update END

  comline() {

    this.array.forEach((a) => {
      a.on('update', (d) => {
        this.update_data(d);
        this.send()
      })
    })

    /// window resize event
    let resizeTimeout = false                               // holder for timeout id
    const resizeDelay = Math.floor(Math.random() * 51) + 50 // delay after event is "complete" to run callback

    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        this.send()
      }, resizeDelay)
    })

  } // comline END

  send() {

    this.compute_size('preview')
    this.emit('update', this.data)

  } // send END

} // Settings END

module.exports = Settings
