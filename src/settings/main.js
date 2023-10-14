
const Events = require('events')

class Main extends Events {

  constructor(data) {
    super()

    console.log('Main ->')
    console.log(data)

    this.data = data

    this.timeout = false // delay for save button
    this.delay = 333

    this.init()
  } // constructor

  init() {
    // clear container
    const container = document.getElementById('main')
    let x = container.querySelectorAll('div')
    for(let i = 0; i < x.length; i++) x[i].parentNode.removeChild(x[i])

    // get template
    const raw = document.querySelector('#template_main').content.querySelector('div')
    const template = document.importNode(raw, true)

    // get input elements
    this.select = template.getElementsByClassName('select')
    this.button = template.getElementsByClassName('button')
    this.loader = template.getElementsByClassName('loader')

    // set input values
    this.select[0].value = this.data.mode

    // set styles
    this.loader[0].style.display = 'none'

    // insert settings
    container.insertBefore(template, container.firstChild)

    this.comline()
  } // init

  comline() {

    this.select[0].addEventListener("change", () => {
      this.data.mode = this.select[0].value

      this.emit('set_main', this.data)
    }, false)

    this.button[0].addEventListener('click', () => {
      this.button[0].style.display = 'none'
      this.loader[0].style.display = 'inline-block'
      this.save()
    }, false)

  } // comline

  save() {
    clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {
      this.emit('save')
    }, this.delay)
  } // save

} // Main

module.exports = Main
