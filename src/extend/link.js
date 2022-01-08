
const Events = require('events')

class Link extends Events{

  constructor(options, div) {
    super()

    this.data

    this.div = document.createElement('span')
    this.div.style.position = 'relative'
    this.div.style.marginRight = options.margin + "px"

    this.span = document.createElement('span')
    this.span.style.fontSize = 'smaller'
    this.span.style.cursor = 'pointer'

    this.div.appendChild(this.span)

    div.appendChild(this.div)

  } // constructor

  init(data) {

    this.data = data

    this.span.innerHTML = data.label
    this.span.style.color = this.data.color

    this.update()

    this.listener()
  } // init

  update(data = this.data) {

    this.data = data

    if (this.data.display == 'select') {
      this.span.style.visibility = 'visible'
    } else {
      this.span.style.visibility = 'hidden'
    }

  } // update

  listener() {

    this.span.addEventListener("click", () => {

      this.emit('update', this.data.value)
    })

  } // listener

} // Range

module.exports = Link
