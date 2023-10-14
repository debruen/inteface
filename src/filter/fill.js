
const Extend = require('../extend.js')

const Select = require('../extend/select.js')
const Range  = require('../extend/range.js')

class Input extends Extend{

  constructor(options, parent) {
    super()

    this.name          = 'fill'
    this.settingsWidth = options.settingsWidth
    this.margin        = options.margin
    this.parent        = parent

    this.div      = this.parentDiv()
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

    window.addEventListener('resize', () => {

      this.send()

    })

  } // comline END

  send() {

    this.compute_size('preview')
    this.emit('update', this.data)

  } // send END

} // Input END

module.exports = Input
