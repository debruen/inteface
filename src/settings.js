
const Extend = require('./extend.js')

const Select = require('./extend/select.js')
const Range  = require('./extend/range.js')

class Settings extends Extend{

  constructor(options) {
    super()

    this.name = 'settings'
    this.settingsWidth = options.settingsWidth
    this.margin        = options.margin

    this.div      = this.mainDiv()
    this.headline = this.headDiv()

    this.options = options

    this.data

    this.array = []
  }

  init(data) {
    this.data = data
    console.log('synthesis init settings')

    const ratio     = data.find(x => x.name == 'ratio')
    const direction = data.find(x => x.name == 'direction')
    this.options.ratio = ratio.value
    this.options.direction = direction.value

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
    console.log('synthesis data settings')

    const ratio     = data.find(x => x.name == 'ratio')
    const direction = data.find(x => x.name == 'direction')
    this.options.ratio = ratio.value
    this.options.direction = direction.value

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

  } // comline END

  send() {

    this.emit('update', this.data)

  } // send END

} // Settings END

module.exports = Settings
