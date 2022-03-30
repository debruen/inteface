
const Extend = require('./extend.js')

const Select = require('./extend/select.js')
const Range  = require('./extend/range.js')
const Button  = require('./extend/button.js')

class Controls extends Extend{

  constructor(options) {
    super()

    this.options = options

    this.control = document.createElement('div')
    this.control.style.display = 'block'
    this.control.style.position = 'absolute'
    this.control.style.left = this.options.settingsWidth + this.options.margin + 'px'
    this.control.style.bottom = this.options.margin + 'px'
    this.control.style.height = this.options.audio / 4 + 'px'

    this.reset_button = document.createElement('span')
    this.reset_button.style.cursor = 'pointer'
    this.reset_button.style.marginRight = this.options.margin + 'px'
    this.reset_button.innerHTML = "reset"

    this.play_button = document.createElement('span')
    this.play_button.style.cursor = 'pointer'
    this.play_button.style.marginRight = this.options.margin + 'px'
    this.play_button.innerHTML = "play"

    this.record_button = document.createElement('span')
    this.record_button.style.cursor = 'pointer'
    this.record_button.style.marginRight = this.options.margin + 'px'
    this.record_button.innerHTML = "save"

    this.control.appendChild(this.reset_button)
    this.control.appendChild(this.play_button)
    this.control.appendChild(this.record_button)

    document.body.appendChild(this.control)

    this.data

  } // constructor END

  init(data) {
    this.data = data
    this.controls()
    this.comline()
  } // init

  update(data) {
    this.data = data
    this.controls()
  }

  comline() {

    this.reset_button.addEventListener("click", () => {
      if (!this.data.reset)
        this.data.reset = true

      this.controls()
    })

    this.play_button.addEventListener("click", () => {
      if (this.data.play)
        this.data.play = false
      else
        this.data.play = true

      this.controls()
    })

    this.record_button.addEventListener("click", () => {
      if (!this.data.record)
        this.data.record = true

      this.controls()
    })

  }

  controls() {

    if (this.data.play)
      this.play_button.innerHTML = "pause"
    else
      this.play_button.innerHTML = "play"

    if (this.data.record) {
      this.record_button.innerHTML = "saving ..."
      this.record_button.style.cursor = 'default'
    } else {
      this.record_button.innerHTML = "save"
      this.record_button.style.cursor = 'pointer'
    }

  }

}

module.exports = Controls
