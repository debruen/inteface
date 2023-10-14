
const Extend = require('../extend.js')

class Select extends Extend{

  constructor(options, div) {
    super()

    this.data

    options = options

    this.div = document.createElement('DIV')
    this.div.style.display = 'block'
    this.div.style.marginRight = options.margin + 'px'
    this.div.style.marginTop = options.margin / 2 + 'px'

    this.label = document.createElement('LABEL')
    this.label.style.marginRight = options.margin / 2 + 'px'

    this.select = document.createElement('SELECT')

    this.div.appendChild(this.label)
    this.div.appendChild(this.select)

    div.appendChild(this.div)

  } // constructor

  init(data) {

    this.data = data

    this.label.innerHTML = data.name + ':'
    this.label.for = data.name

    this.select.name = data.name
    for (var i = 0; i < data.options.length; i++) {
      let option = document.createElement("option")
      option.text = data.options[i]
      option.value = data.options[i]
      this.select.add(option)
    }

    this.update()

    this.comline()
  } // init

  update(data = this.data) {

    this.data = data

    this.select.value = this.data.value

  } // update

  comline() {

    this.select.addEventListener("change", () => {
      this.data.value = this.select.value

        this.emit('update', this.data)

    })

  } // comline

} // Select

module.exports = Select
