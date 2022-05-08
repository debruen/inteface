
const Extend = require('../extend.js')

class Imagesize extends Extend{

  constructor(global_data, parent) {
    super()

    this.div = document.createElement('div')
    this.div.style.display = 'grid'
    this.div.style.gridTemplateColumns = '98% 2%'
    this.div.style.padding = '0px'
    // this.div.style.width = global_data.column - global_data.margin + 'px'
    this.div.style.borderBottom = '1px solid currentcolor'

    this.headline = document.createElement('div')
    this.headline.style.fontWeight = 'bold'
    this.headline.style.cursor = 'default'

    this.display = document.createElement('div')
    this.display.style.cursor = 'pointer'

    this.div.appendChild(this.headline)
    this.div.appendChild(this.display)

    parent.appendChild(this.div)

    this.data
  }

  init(data) {
    this.update(data)
    this.comline()
  }

  update(data) {
    this.data = data
    const name = this.data.find(x => x.name == 'name')
    this.headline.innerHTML = name.value
    const display = this.data.find(x => x.name == 'display')
    this.draw(display.value)
  }

  draw(display) {
    if (display) {
      this.display.style.color = 'red'
      this.display.innerHTML = '△'
    } else {
      this.display.style.color = 'green'
      this.display.innerHTML = '▽'
    }
  }

  comline() {
    this.display.addEventListener("click", () => {
      const data = this.get_data('display')

      if (data.value) {
        data.value = false
      } else {
        data.value = true
      }

      this.update_data(data)

      this.emit('update', this.data)
    })
  }

}

module.exports = Imagesize
