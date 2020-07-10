
const Events = require('events')

class ImageFilter extends Events {

  constructor(data) {
    super()

    console.log('Filter ->')
    console.log(data)

    this.data = data

    this.container = document.getElementById('in')

    //this.filterID = 'process' + this.data.process_index.toString()

    this.timeout = false // holder for timeout id
    this.delay = 333 // delay after event is "complete" to run callback

    this.init()
  } // constructor

  init() {

    const raw = document.querySelector('#template_image_filter').content.querySelector('div')
    const template = document.importNode(raw, true)
    //template.id = this.filterID

    this.select = template.getElementsByClassName('select')
    this.slider = template.getElementsByClassName('slider')
    this.canvas = template.getElementsByClassName('canvas')
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

    if(this.data.type == 'gamma') {
      // color
      this.canvas[0].style.display = 'none'
      this.canvas[1].style.display = 'none'
      for (var i = 0; i < 6; i++) {
        this.slider[i].style.display = 'none'
        this.value[i].style.display = 'none'
      }
      for (var i = 1; i < 9; i++) {
        this.title[i].style.display = 'none'
      }
      for (var i = 1; i < this.br.length; i++) {
        this.br[i].style.display = 'none'
      }
    }

    if(this.data.type == 'color_scale' || this.data.type == 'color_jump' || this.data.type == 'color_strech') {
      // gamma
      this.slider[6].style.display = 'none'
      this.value[6].style.display = 'none'
      this.title[7].style.display = 'none'

    }

    this.select[0].value = this.data.type

    this.slider[0].value = this.data.color[0]
    this.slider[1].value = this.data.color[1]
    this.slider[2].value = this.data.color[2]
    this.slider[3].value = this.data.color[3]
    this.slider[4].value = this.data.color[4]
    this.slider[5].value = this.data.color[5]
    this.slider[6].value = this.data.gamma

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

    for (let i = 0; i < this.slider.length - 1; i++) {
      this.slider[i].addEventListener("input", () => {
        this.draw()
      }, false)
      this.slider[i].addEventListener("change", () => {
        this.set_data()
        this.send()
      }, false)
    }

    this.slider[6].addEventListener("input", () => {
      this.draw()
    }, false)
    this.slider[6].addEventListener("change", () => {
      this.set_data()
      this.send()
    }, false)

    this.link[0].addEventListener('click', () => {
      this.manage('layer')
    })

    this.link[1].addEventListener('click', () => {
      this.manage('filter')
    })

    this.link[2].addEventListener('click', () => {
      this.manage('rmv_filter')
    })

  } // comline

  draw() {

    const ctxA = this.canvas[0].getContext("2d") // color A slider 1 - 3
    ctxA.rect(0, 0, this.canvas[0].width, this.canvas[0].height)
    ctxA.fillStyle = 'rgb(' + this.slider[0].value + ', ' + this.slider[1].value + ', ' + this.slider[2].value + ')'
    ctxA.fill()
    const ctxB = this.canvas[1].getContext("2d") // color B slider 4 - 6
    ctxB.rect(0, 0, this.canvas[1].width, this.canvas[1].height)
    ctxB.fillStyle = 'rgb(' + this.slider[3].value + ', ' + this.slider[4].value + ', ' + this.slider[5].value + ')'
    ctxB.fill()

    for (let i = 0; i < this.slider.length; i++) {
      this.value[i].innerHTML = this.slider[i].value
    }

  } // draw

  set_data() {
    const color = []
    for (var i = 0; i < this.slider.length - 1; i++) {
      color.push( parseInt(this.slider[i].value) )
    }

    this.data.type = this.select[0].value
    this.data.color = color
    this.data.gamma = parseFloat( this.slider[6].value )

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

} // ImageFilter

module.exports = ImageFilter
