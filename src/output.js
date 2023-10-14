
const Extend = require('./extend.js')

const Select = require('./extend/select.js')
const Range  = require('./extend/range.js')
const Button  = require('./extend/button.js')

class Output extends Extend{

  constructor(options) {
    super()

    this.id            = 'output'
    this.name          = 'output'
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

    let i = 0
    this.data.forEach((d, i) => {
      if(d.form == "select") {
        this.array.push(new Select(this.options, this.div))
        this.array[i].init(d)
        i++
      }
      if(d.form == "range") {
        this.array.push(new Range(this.options, this.div))
        this.array[i].init(d)
        i++
      }
      if(d.form == "button") {
        this.array.push(new Button(this.options, this.div))
        this.array[i].init(d)
        i++
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

        if (this.data[i].name == 'save') {
          this.data[i].value = false
          this.emit('save')
        } else {
          this.data[i].value = data.value
          this.emit('update', this.data)
        }

      })

    })

  } // listener

} // Transform

module.exports = Output
