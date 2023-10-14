
const Events = require('events')

class AudioFilter extends Events {

  constructor(data) {
    super()

    console.log('Filter ->')
    console.log(data)

    this.data = data

    this.container = document.getElementById('in')

    // this.filterID = 'process' + this.data.process_index.toString()

    this.timeout = false // holder for timeout id
    this.delay = 333 // delay after event is "complete" to run callback

    this.init()
  } // constructor

  init() {

    const raw = document.querySelector('#template_audio_filter').content.querySelector('div')
    const template = document.importNode(raw, true)
    // template.id = this.filterID

    this.select = template.getElementsByClassName('select')
    this.slider = template.getElementsByClassName('slider')
    this.title = template.getElementsByClassName('title')
    this.value = template.getElementsByClassName('value')
    this.link = template.getElementsByClassName('link')
    this.br = template.getElementsByTagName('br')

    template.style.borderBottom = '1px solid rgba(64, 64, 64, 0.5)'

    if(this.data.index < this.data.total - 1) { // for filter below
      for (let i = 0; i < this.link.length; i++) {
        this.link[i].style.display = 'none'
      }
    }

    this.select[0].value = this.data.type

    this.slider[0].value = this.data.arg[0]
    this.value[0].innerHTML = this.data.arg[0]
    this.slider[1].value = this.data.arg[1]
    this.value[1].innerHTML = this.data.arg[1]
    this.slider[2].value = this.data.arg[2]
    this.value[2].innerHTML = this.data.arg[2]

    this.container.insertBefore(template, this.container.firstChild)

    this.comline()
  } // init

  comline() {

    for (let i = 0; i < this.select.length; i++) {
      this.select[i].addEventListener("change", () => {
        this.set_data()
        this.send()
      }, false)
    }

    for (let i = 0; i < this.slider.length; i++) {
      this.slider[i].addEventListener("input", () => {
        this.value[i].innerHTML = this.slider[i].value
      }, false)
      this.slider[i].addEventListener("change", () => {
        this.set_data()
        this.send()
      }, false)
    }

    this.link[0].addEventListener('click', () => {
      this.manage('track')
    })

    this.link[1].addEventListener('click', () => {
      this.manage('filter')
    })

    this.link[2].addEventListener('click', () => {
      this.manage('rmv_filter')
    })

  } // comline


  set_data() {
    const arg = []
    for (var i = 0; i < this.slider.length; i++) {
      arg.push( parseFloat(this.slider[i].value) )
    }

    this.data.type = this.select[0].value
    this.data.arg = arg

  } // set_data

  send() {
    clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {

      this.emit('set', this.data)

    }, this.delay)
  } // send

  manage(option) {

    this.emit('manage', option)

  } // manage

} // AudioFilter

module.exports = AudioFilter
