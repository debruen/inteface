
const Events = require('events')
const { loadAndTypeset } = require("mathjax-electron");

class Out extends Events {

  constructor(data) {
    super()

    console.log('Out ->')
    console.log(data)

    this.data = data

    this.container = document.getElementById('out')

    this.timeout = false // holder for timeout id
    this.delay = 666 // delay after event is "complete" to run callback

    this.init()
  } // constructor

  init() {
    // clear container
    let x = this.container.querySelectorAll('div')
    for(let i = 0; i < x.length; i++) x[i].parentNode.removeChild(x[i])

    // image or audio
    if(this.data.mode == 'image') this.init_image()
    if(this.data.mode == 'audio') this.init_audio()
  } // init

  init_image() {
    // get template
    const raw = document.querySelector('#template_image_out').content.querySelector('div')
    const template = document.importNode(raw, true)

    // get input elements
    this.select = template.getElementsByClassName('select')
    this.slider = template.getElementsByClassName('slider')
    this.value = template.getElementsByClassName('value')
    this.radio = template.getElementsByClassName('radio')
    this.formula = template.getElementsByClassName('formula')

    this.select[0].value = this.data.out_mode

    this.slider[0].value = this.data.time_image
    this.value[0].innerHTML = this.slider[0].value

    this.slider[1].value = this.data.narrowing
    this.value[1].innerHTML = this.slider[1].value

    this.select[1].value = this.data.channel_a
    this.select[2].value = this.data.channel_b
    this.select[3].value = this.data.channel_c

    this.formula[0].innerHTML = "$a = \\sqrt[12]{2}^{" +this.select[1].options[this.data.channel_a].text + "*12}$"
    loadAndTypeset(document, this.formula[0])

    let basefreq, shiftKeys

    if(this.data.keyboard == 97) {
      this.radio[0].checked = true
      basefreq = 16.3516
      shiftKeys = 85
    }
    if(this.data.keyboard == 88) {
      this.radio[1].checked = true
      basefreq = 27.5000
      shiftKeys = 76
    }

    this.formula[0].innerHTML = "$Base frequency = 2 ^ {" + this.select[1].options[this.select[1].value].text + "} * " + basefreq + "Hz$"
    loadAndTypeset(document, this.formula[0])
    this.formula[1].innerHTML = "$Volume = Signal * " + this.select[2].options[this.select[2].value].text + "$"
    loadAndTypeset(document, this.formula[1])
    this.formula[2].innerHTML = "$Frequency = \\sqrt[12]{2} ^ {" + this.select[3].options[this.select[3].value].text + " * " + shiftKeys + "} * Base frequency$"
    loadAndTypeset(document, this.formula[2])

    this.container.insertBefore(template, this.container.firstChild)

    this.image_comline()
  } // init_image

  image_comline() {

    this.select[0].addEventListener("change", () => {
      this.data.out_mode = this.select[0].value
      this.send()
    }, false)

    this.slider[0].addEventListener("input", () => {
      this.value[0].innerHTML = this.slider[0].value
    }, false)
    this.slider[0].addEventListener("change", () => {
      this.data.time_image = parseFloat(this.slider[0].value)
      this.send()
    }, false)

    this.slider[1].addEventListener("input", () => {
      this.value[1].innerHTML = this.slider[1].value
    }, false)
    this.slider[1].addEventListener("change", () => {
      this.data.narrowing = parseFloat(this.slider[1].value)
      this.send()
    }, false)

    this.select[1].addEventListener("change", () => {
      this.data.channel_a = parseInt(this.select[1].value)
      this.send()
    }, false)
    this.select[2].addEventListener("change", () => {
      this.data.channel_b = parseInt(this.select[2].value)
      this.send()
    }, false)
    this.select[3].addEventListener("change", () => {
      this.data.channel_c = parseInt(this.select[3].value)
      this.send()
    }, false)

    this.radio[0].addEventListener("change", () => {
      this.data.keyboard = parseInt(this.radio[0].value)
      this.send()
    }, false)

    this.radio[1].addEventListener("change", () => {
      this.data.keyboard = parseInt(this.radio[1].value)
      console.log(parseInt(this.radio[1].value))
      this.send()
    }, false)
  } // image_comline

  init_audio() {
    const raw = document.querySelector('#template_audio_out').content.querySelector('div')
    const template = document.importNode(raw, true)

    this.select = template.getElementsByClassName('select')
    this.slider = template.getElementsByClassName('slider')
    this.value = template.getElementsByClassName('value')

    this.select[0].value = this.data.out_mode

    this.slider[0].value = this.data.image_time
    this.value[0].innerHTML = this.slider[0].value

    this.container.insertBefore(template, this.container.firstChild)

    this.audio_comline()
  } // init_audio

  audio_comline() {
    this.select[0].addEventListener("change", () => {
      this.data.out_mode = this.select[0].value
      this.send()
    }, false)

    this.slider[0].addEventListener("input", () => {
      this.value[0].innerHTML = this.slider[0].value
    }, false)
    this.slider[0].addEventListener("change", () => {
      this.data.image_time = parseInt(this.slider[0].value)
      this.send()
    }, false)

  } // inputAudioOut

  send() {
    clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {

      this.emit('set_out', this.data)

    }, this.delay)
  } // send

} // Out

module.exports = Out
