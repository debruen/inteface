
const Events = require('events')

class Select extends Events{

  constructor(options, div) {
    super()

    this.data

    options = options

    this.div = document.createElement('DIV')
    this.div.style.display = 'inline-block'
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

    this.label.innerHTML = data.label + ':'
    this.label.for = data.label

    this.select.name = data.label
    for (var i = 0; i < data.options.length; i++) {
      let option = document.createElement("option")
      option.text = data.options[i]
      option.value = data.options[i]
      this.select.add(option)
    }

    this.update()

    this.listener()
  } // init

  update(data = this.data) {

    this.data = data

    this.select.value = this.data.value

  } // update

  listener() {

    let timeout = false   // holder for timeout id
    const delay = Math.floor(Math.random() * 10)     // delay after event is "complete" to run callback

    this.select.addEventListener("change", () => {
      this.data.value = this.select.value

      clearTimeout(timeout)
      timeout = setTimeout(() => {
        console.log(this.data.label + ' update')
        this.emit('update', this.data)
      }, delay)
    })

  } // listener

} // Select

module.exports = Select
