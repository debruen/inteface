
const Events = require('events')

class Button extends Events{

  constructor(options, div) {
    super()

    this.data

    this.div = document.createElement('DIV')
    this.div.style.display = 'inline-block'
    this.div.style.marginRight = options.margin + 'px'
    this.div.style.marginTop = options.margin / 2 + 'px'

    this.button = document.createElement('BUTTON')
    this.button.type = 'button'

    this.div.appendChild(this.button)
    div.appendChild(this.div)

  } // constructor

  init(data) {

    this.data = data

    this.update()

    this.listener()
  } // init

  update(data = this.data) {

    this.data = data

    this.button.innerHTML = data.label

  } // update

  listener() {

    let timeout = false   // holder for timeout id
    const delay = Math.floor(Math.random() * 10)     // delay after event is "complete" to run callback

    this.button.addEventListener("click", () => {
      this.data.value = true

      clearTimeout(timeout)
      timeout = setTimeout(() => {
        console.log(this.data.label + ' update')
        this.emit('update', this.data)
      }, delay)
    })

  } // listener

} // Select

module.exports = Button
