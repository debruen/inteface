
const Events = require('events')

class Layer extends Events {

  constructor(data) {
    super()

    console.log('Layer ->')
    console.log(data)

    this.data = data

    this.container = document.getElementById('in')

    // this.layerID = 'process' + this.data.process_index.toString()

    this.timeout = false // holder for timeout id
    this.delay = 333 // delay after event is "complete" to run callback

    this.init()
  } // constructor

  init() {

    const raw = document.querySelector('#template_image_layer').content.querySelector('div')
    const template = document.importNode(raw, true)
    // template.id = this.layerID

    this.select = template.getElementsByClassName('select')
    this.slider = template.getElementsByClassName('slider')
    this.canvas = template.getElementsByClassName('canvas')
    this.title = template.getElementsByClassName('title')
    this.value = template.getElementsByClassName('value')
    this.link = template.getElementsByClassName('link')
    this.br = template.getElementsByTagName('br')

    template.style.borderBottom = '1px solid rgba(64, 64, 64, 0.5)'

    if(this.data.index < this.data.total - 1) { // for layer below
      for (let i = 0; i < this.link.length; i++) {
        this.link[i].style.display = 'none'
      }
    }

    if(this.data.type == 'fill') {
      // Color B, Gradient and Rectangle
      this.canvas[1].style.display = 'none'
      for (let i = 4; i < this.slider.length; i++) {
        this.slider[i].style.display = 'none'
        this.value[i].style.display = 'none'
      }
      for (let i = 7; i < this.title.length; i++) {
        this.title[i].style.display = 'none'
      }
      for (let i = 2; i < this.br.length; i++) {
        this.br[i].style.display = 'none'
      }
    }

    if(this.data.type == 'noise' || this.data.type == 'walker') {
      // Gradient and Rectangle
      for (var i = 7; i < this.slider.length; i++) {
        this.slider[i].style.display = 'none'
        this.value[i].style.display = 'none'
      }
      for (var i = 11; i < this.title.length; i++) {
        this.title[i].style.display = 'none'
      }
      for (var i = 4; i < this.br.length; i++) {
        this.br[i].style.display = 'none'
      }
    }

    if(this.data.type == 'gradient') {
      // Rectangle
      for (var i = 10; i < this.slider.length; i++) {
        this.slider[i].style.display = 'none'
        this.value[i].style.display = 'none'
      }
      for (var i = 14; i < this.title.length; i++) {
        this.title[i].style.display = 'none'
      }
      for (var i = 5; i < this.br.length; i++) {
        this.br[i].style.display = 'none'
      }
    }

    if(this.data.type == 'rectangle') {
      // Gradient tilt
      this.title[13].style.display = 'none'
      this.slider[9].style.display = 'none'
      this.value[9].style.display = 'none'
    }

    this.select[0].value = this.data.type
    this.select[1].value = this.data.blend

    this.slider[0].value = this.data.opacity

    this.slider[1].value = this.data.color[0]
    this.slider[2].value = this.data.color[1]
    this.slider[3].value = this.data.color[2]
    this.slider[4].value = this.data.color[3]
    this.slider[5].value = this.data.color[4]
    this.slider[6].value = this.data.color[5]

    this.slider[7].value = Math.sqrt(this.data.gradient[0] / 100)
    this.slider[8].value = this.data.gradient[1]
    this.slider[9].value = this.data.gradient[2]

    this.slider[10].value = this.data.rectangle[0]
    this.slider[11].value = this.data.rectangle[1]
    this.slider[12].value = this.data.rectangle[2]

    this.container.insertBefore(template, this.container.firstChild)

    this.draw()
    this.comline()
  } // init

  comline() {

    for (let i = 0; i < this.select.length; i++) {
      this.select[i].addEventListener("change", () => {
        this.set_data()
        this.send()
      })
    }

    for (let i = 0; i < this.slider.length; i++) {
      this.slider[i].addEventListener("input", () => {
        this.draw()
      }, false)
      this.slider[i].addEventListener("change", () => {
        this.set_data()
        this.send()
      }, false)
    }

    this.link[0].addEventListener('click', () => {
      this.manage('layer')
    })

    this.link[1].addEventListener('click', () => {
      this.manage('filter')
    })

    this.link[2].addEventListener('click', () => {
      this.manage('rmv_layer')
    })

  } // comline

  draw() {

    const ctxA = this.canvas[0].getContext("2d") // color A slider 1 - 3
    ctxA.rect(0, 0, this.canvas[0].width, this.canvas[0].height)
    ctxA.fillStyle = 'rgb(' + this.slider[1].value + ', ' + this.slider[2].value + ', ' + this.slider[3].value + ')'
    ctxA.fill()
    const ctxB = this.canvas[1].getContext("2d") // color B slider 4 - 6
    ctxB.rect(0, 0, this.canvas[1].width, this.canvas[1].height)
    ctxB.fillStyle = 'rgb(' + this.slider[4].value + ', ' + this.slider[5].value + ', ' + this.slider[6].value + ')'
    ctxB.fill()

    for (let i = 0; i < this.slider.length; i++) {
      if(i == 7) {
        this.value[i].innerHTML = Math.round(Math.pow(this.slider[i].value, 2) * 100 * 100) / 100
      } else {
        this.value[i].innerHTML = this.slider[i].value
      }
    }

  } // draw

  set_data() {
    const color = []
    for (var i = 1; i < 7; i++) {
      color.push(parseInt(this.slider[i].value) )
    }

    const gradient = []
    for (var i = 7; i < 10; i++) {
      if(i == 7) { // frequency per image
        gradient.push(parseFloat(Math.pow(this.slider[i].value, 2) * 100))
      } else {
        gradient.push(parseFloat(this.slider[i].value))
      }


    }

    const rectangle = []
    for (var i = 10; i < this.slider.length; i++) {
      rectangle.push(parseFloat(this.slider[i].value))
    }

    this.data.type = this.select[0].value
    this.data.blend = this.select[1].value
    this.data.opacity = parseFloat(this.slider[0].value)
    this.data.color = color
    this.data.gradient = gradient
    this.data.rectangle = rectangle

  } // set_data

  send() {
    this.emit('set', this.data)

    // clearTimeout(this.timeout)
    // this.timeout = setTimeout(() => {
    //
    // }, this.delay)
  } // send

  manage(option) {

    this.emit('manage', option)

  } // manage

} // Layer

module.exports = Layer
