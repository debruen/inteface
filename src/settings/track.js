
const Events = require('events')

class track extends Events {

  constructor(data) {
    super()

    console.log('track ->')
    console.log(data)

    this.data = data

    this.container = document.getElementById('in')

    // this.trackID = 'process' + this.data.process_index.toString()

    this.timeout = false // holder for timeout id
    this.delay = 333 // delay after event is "complete" to run callback

    this.init()
  } // constructor

  init() {

    const raw = document.querySelector('#template_audio_track').content.querySelector('div')
    const template = document.importNode(raw, true)
    // template.id = this.trackID

    this.select = template.getElementsByClassName('select')
    this.slider = template.getElementsByClassName('slider')
    this.title = template.getElementsByClassName('title')
    this.value = template.getElementsByClassName('value')
    this.link = template.getElementsByClassName('link')
    this.br = template.getElementsByTagName('br')

    template.style.borderBottom = '1px solid rgba(64, 64, 64, 0.5)'

    if(this.data.index < this.data.total - 1) { // for track below
      for (let i = 0; i < this.link.length; i++) {
        this.link[i].style.display = 'none'
      }
    }

    this.select[0].value = this.data.type
    this.select[1].value = this.data.blend

    this.slider[0].value = this.data.opacity
    this.value[0].innerHTML = this.data.opacity

    this.slider[1].value = this.data.sine[0]
    this.value[1].innerHTML = this.data.sine[0]
    this.slider[2].value = this.data.sine[1]
    this.value[2].innerHTML = this.data.sine[1]
    this.slider[3].value = this.data.sine[2]
    this.value[3].innerHTML = this.data.sine[2]

    this.slider[4].value = this.data.lrfade
    this.value[4].innerHTML = this.data.lrfade

    this.container.insertBefore(template, this.container.firstChild)

    this.comline()
  } // init

  comline() {

    for (let i = 0; i < this.select.length; i++) {
      this.select[i].addEventListener("input", () => {
        this.set_data()

        this.send()
      })
    }

    for (let i = 0; i < this.slider.length; i++) {
      this.slider[i].addEventListener("input", () => {
        this.value[i].innerHTML = this.slider[i].value
        this.set_data()

        this.send()
      })
    }

    this.link[0].addEventListener('click', () => {
      this.manage('track')
    })

    this.link[1].addEventListener('click', () => {
      this.manage('filter')
    })

    this.link[2].addEventListener('click', () => {
      this.manage('rmv_track')
    })

  } // comline

  set_data() {
    const sine = []
    for (var i = 1; i < 4; i++) {
      sine.push( parseFloat(this.slider[i].value) )
    }

    this.data.type = this.select[0].value
    this.data.blend = this.select[1].value
    this.data.opacity = parseFloat(this.slider[0].value)
    this.data.sine = sine
    this.data.lrfade = parseFloat(this.slider[4].value)

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

} // track

module.exports = track
