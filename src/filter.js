
  const Extend = require('./extend.js')

const Layer = require('./filter/layer.js')

class Filter extends Extend{

  constructor(options) {
    super()

    this.id            = 'filter'
    this.name          = 'filter'
    this.settingsWidth = options.settingsWidth
    this.margin        = options.margin

    this.div      = this.mainDiv()
    this.headline = this.headDiv()

    this.options = options

    this.type
    this.data

    this.array = []
  } // constructor END

  init(data, type) {
    this.type = type
    this.data = data

    this.update()
  } // init END

  update(data = this.data, type = this.type) {
    this.type = type
    this.data = data

    console.log(data)

    const display = this.get_string('display')
    const name = this.get_string('name')

    let div = this.div.querySelectorAll('div')
    for(let i = 1; i < div.length; i++) {
      div[i].parentNode.removeChild(div[i])
    }

  if (display) {

    this.array = []

    if(this.data.length <= 2) {
      this.array.push(new Layer(this.options, this.div))
      this.array[0].init()
    } else {
      let c = 0
      this.data.forEach((item, i) => {
        if (this.isArray(item)) {
          this.array.push(new Layer(this.options, this.div))
          this.array[c].init(item, type)
          c++
        }
      })
    }
  }

    this.comline()
  } // update END

  comline() {

    this.array.forEach((item, i) => {
      item.on('update', (data) => {
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
        this.send()
      })
    })

  } // comline END

  send() {

    this.emit('update', this.data)

  } // send END

} // Filter END

module.exports = Filter
