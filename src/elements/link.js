
const Events = require('events')

class Link extends Events{

  constructor(options, div) {
    super()

    this.data

    this.data

    this.div = document.createElement('div')
    this.div.style.display = 'inline-block'
    this.div.style.marginLeft = options.margin + 'px'
    this.div.style.float = 'right'

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

    let timeout = false   // holder for timeout id
    const delay = Math.floor(Math.random() * 10)     // delay after event is "complete" to run callback

    this.span.addEventListener("click", () => {
      this.data.value


      clearTimeout(timeout)
      timeout = setTimeout(() => {
        this.emit('update', this.data.value)
      }, delay)
    })

  } // listener

} // Range

module.exports = Link
