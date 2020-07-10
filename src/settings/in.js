
const Events = require('events')

const ImageFilter = require('./image_filter.js')
const Layer       = require('./layer.js')
const AudioFilter = require('./audio_filter.js')
const Track       = require('./track.js')

class In extends Events {

  constructor(data) {
    super()

    console.log('In ->')
    console.log(data)

    this.data = data

    this.container = document.getElementById('in')

    this.process = []

    this.timeout = false // holder for timeout id
    this.delay = 333 // delay after event is "complete" to run callback

    this.init()
  } // constructor

  init() {
    // clear container
    let x = this.container.querySelectorAll('div')
    for(let i = 0; i < x.length; i++) x[i].parentNode.removeChild(x[i])

    // image or audio
    if(this.data.mode == 'image') this.init_image()
    if(this.data.mode == 'audio') this.init_audio()
  }

  // --------------------------------------------------------------------------- image

  init_image() {
    // get template
    const raw = document.querySelector('#template_image').content.querySelector('div')
    const template = document.importNode(raw, true)

    // get input elements
    this.number = template.getElementsByClassName('number')
    this.link = template.getElementsByClassName('link')
    this.title = template.getElementsByClassName('title')
    this.input = template.getElementsByClassName('files')
    this.thumbs = template.getElementsByClassName('thumbs')

    // pages
    this.number[0].value = this.data.pages
    if(this.data.files.length > 0 || this.data.processes == 0) {
      this.title[0].style.display = 'none'
      this.number[0].style.display = 'none'
    }

    // add layer link
    if(this.data.processes.length > 0) {
      this.link[0].style.display = 'none'
    }

    // add filter, remove thumbs link
    if(this.data.processes.length  > 0) {
      this.link[1].style.display = 'none'
    }
    if(this.data.files.length == 0) {
      this.link[1].style.display = 'none'
      this.link[2].style.display = 'none'
    }

    // display thumbs
    if(this.data.files.length > 0) {
      const width = 50
      const height = width * Math.SQRT2
      for (let i = 0; i < this.data.files.length; i++) {
        var image = new Image(width, height)
        image.src = this.data.files[i]
        image.classList.add('image')
        this.thumbs[0].appendChild(image)
      }
    }

    template.style.paddingBottom = '0px'

    this.container.insertBefore(template, this.container.firstChild)

    // layer, filter
    for (let i = 0; i < this.data.processes.length; i++) {
      this.data.processes[i].index = i
      this.data.processes[i].total = this.data.processes.length
      if(this.data.processes[i].process == 'filter')
        this.process.push(new ImageFilter(this.data.processes[i]))
      if(this.data.processes[i].process == 'layer')
        this.process.push(new Layer(this.data.processes[i]))
    }

    this.image_comline()
  } // initImageFile

  image_comline() {

    this.input[0].addEventListener('change', () => {
      let files = []
      for (var i = 0; i < this.input[0].files.length; i++) {
        files.push(this.input[0].files[i].path)
      }
      this.data.files = files
      this.send()
    }, false)

    this.number[0].addEventListener("change", () => {
      this.data.pages = parseInt(this.number[0].value)
      this.send()
    }, false)

    this.link[0].addEventListener('click', () => {
      this.data.processes = 'layer'
      this.send()
    })

    this.link[1].addEventListener('click', () => {
      this.data.processes = 'filter'
      this.send()
    })

    this.link[2].addEventListener('click', () => {
      this.data.files = []
      this.send()
    })

    for (let i = 0; i < this.data.processes.length; i++) {

        this.process[i].on('set', (data) => {
          this.data.processes[i] = data

          this.send()
        })

        this.process[i].on('manage', (data) => {
          this.data.processes = data
          this.send()
        })

    }

  } // image_comline

  // --------------------------------------------------------------------------- audio

  init_audio() {                                                             // initAudioFile
    // get template
    const raw = document.querySelector('#template_audio').content.querySelector('div')
    const template = document.importNode(raw, true)

    // get input elements
    this.input = template.getElementsByClassName('files')
    this.link = template.getElementsByClassName('link')
    this.thumbs = template.getElementsByClassName('thumbs')
    this.title = template.getElementsByClassName('title')
    this.slider = template.getElementsByClassName('slider')
    this.value = template.getElementsByClassName('value')

    // time
    this.slider[0].value = this.data.time / 8 * 100
    this.value[0].innerHTML = Math.round((this.slider[0].value / 100 * 8) * 1000) / 1000
    if(this.data.files.length > 0 || this.data.processes == 0) {
      this.title[0].style.display = 'none'
      this.slider[0].style.display = 'none'
      this.value[0].style.display = 'none'
    }

    // add layer link
    if(this.data.processes.length > 0) {
      this.link[0].style.display = 'none'
    }

    // add filter remove audio files link
    if(this.data.processes.length  > 0) {
      this.link[1].style.display = 'none'
    }
    if(this.data.files.length == 0) {
      this.link[1].style.display = 'none'
      this.link[2].style.display = 'none'
    }

    // display audio files
    for (let i = 0; i < this.data.files.length; i++) {
      const span = document.createElement("SPAN")
      span.innerHTML = this.data.files[i].match(/([^\/]*)\/*$/)[1]
      span.classList.add('link')
      this.thumbs[0].appendChild(span)
      const br = document.createElement("BR")
      this.thumbs[0].appendChild(br)
    }

    template.style.paddingBottom = '0px'
    this.container.insertBefore(template, this.container.firstChild)

    // track, filter
    for (let i = 0; i < this.data.processes.length ; i++) {
      this.data.processes[i].index = i
      this.data.processes[i].total = this.data.processes.length
      if(this.data.processes[i].process == 'filter')
        this.process.push(new AudioFilter(this.data.processes[i]))
      if(this.data.processes[i].process == 'track')
        this.process.push(new Track(this.data.processes[i]))
    }

    this.audio_comline()
  } // init_audio

  audio_comline() {

    this.input[0].addEventListener("change", () => {
      let files = []
      for (var i = 0; i < this.input[0].files.length; i++) {
        files.push(this.input[0].files[i].path)
      }
      this.data.files = files
      this.send()
    }, false)

    this.slider[0].addEventListener("input", () => {
      this.value[0].innerHTML = Math.round((this.slider[0].value / 100 * 8) * 1000) / 1000
      this.data.time = parseFloat(this.slider[0].value / 100 * 8)
    }, false)
    this.slider[0].addEventListener("change", () => {
      this.send()
    }, false)

    this.link[0].addEventListener('click', () => {
      this.data.processes = 'track'
      this.send()
    })

    this.link[1].addEventListener('click', () => {
      this.data.processes = 'filter'
      this.send()
    })

    this.link[2].addEventListener('click', () => {
      this.data.files = 'rmv'
      this.send()
    })

    for (let i = 0; i < this.data.processes.length; i++) {

        this.process[i].on('set', (data) => {
          this.data.processes[i] = data

          this.send()
        })

        this.process[i].on('manage', (data) => {
          this.data.processes = data
          this.send()
        })

    }

  } // audio_comline

  send() {
    this.emit('set_in', this.data)

    // clearTimeout(this.timeout)
    // this.timeout = setTimeout(() => {
    //
    // }, this.delay)
  } // send

} // In

module.exports = In
