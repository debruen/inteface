
const Events = require('events')

class Extend extends Events {

  constructor(options) {
    super()

  }

  project(min, max, norm) {
    return (norm * (max - min)) + min
  }

  normalize(min, max, value) {
    return (value - min) / (max - min)
  }

  hideDiv(parent, hide) {

    const children = parent.children

    for (var i = 1; i < children.length; i++) {

      if (children[i].style.display != 'none') {
        children[i].style.display = 'none'
        hide.innerHTML = '▽'
        hide.style.color = 'green'

      } else {
        children[i].style.display = 'block'
        hide.innerHTML = '△'
        hide.style.color = 'red'

      }

    }
  }

  mainDiv() {

    const div = document.createElement('div')
    div.style.display = 'block'
    div.style.width = this.settingsWidth - this.margin + 'px'
    div.style.margin = this.margin + 'px'
    // div.style.border = '1px solid currentcolor'

    document.body.appendChild(div)

    return div
  }

  parentDiv() {

    const div = document.createElement('div')
    div.style.display = 'block'
    div.style.width = this.parent.style.width - this.margin + 'px'

    this.parent.appendChild(div)

    return div
  }

  parentBorder() {

    const div = document.createElement('div')
    div.style.display = 'block'
    div.style.width = this.settingsWidth - this.margin * 2 - 4 + 'px'
    div.style.marginTop = this.margin / 2 + "px";
    div.style.padding = this.margin / 2  + "px";
    div.style.border = "1px solid #000";

    this.parent.appendChild(div)

    return div
  }

  headDiv() {

    const parent = this.div

    const div = document.createElement('div')
    div.style.position = 'relative'
    div.style.display = 'block'
    div.style.width = this.settingsWidth - this.margin + 'px'
    div.style.fontWeight = 'bold'
    div.style.borderBottom = '1px solid currentcolor'
    div.innerHTML = this.name

    const hide = document.createElement('span')
    hide.style.position = 'absolute'
    hide.style.display = 'block'
    hide.style.left = this.settingsWidth - this.margin - 16 + 'px'
    hide.style.top = '0px'
    hide.style.cursor = 'pointer'
    hide.style.color = 'red'

    hide.innerHTML = '△'

    div.appendChild(hide)

    parent.appendChild(div)

    hide.addEventListener('click', () => {
      this.hideDiv(parent, hide)
    })

    return div
  }

  headSmall() {

    const parent = this.div

    const div = document.createElement('div')
    div.style.position = 'relative'
    div.style.display = 'block'
    div.style.width = this.settingsWidth - this.margin * 2.5 + 'px'
    div.style.fontStyle = 'italic'
    div.style.borderBottom = '1px solid currentcolor'
    div.innerHTML = this.name

    const hide = document.createElement('span')
    hide.style.position = 'absolute'
    hide.style.display = 'block'
    hide.style.left = this.settingsWidth - this.margin * 2.5 - 16 + 'px'
    hide.style.top = '0px'
    hide.style.cursor = 'pointer'
    hide.style.color = 'red'

    hide.innerHTML = '△'

    div.appendChild(hide)

    parent.appendChild(div)

    hide.addEventListener('click', () => {
      this.hideDiv(parent, hide)
    })

    return div
  }

  canvasForm() {

    const canvas = document.createElement('CANVAS')
    canvas.style.display = 'inline-block'
    canvas.width = this.settingsWidth - this.margin * 2.5
    canvas.height = this.audio / 3 * 2

    return canvas
  }

  get_string(name, data = this.data) {
    const index = data.findIndex(x => x.name == name)

    return data[index].value
  }

  get_num(name) {
    const index = this.data.findIndex(x => x.name == name)

    return this.data[index].value
  }

  get_width(name) {
    const index = this.data.findIndex(x => x.name == name)

    return this.data[index].width
  }

  get_height(name) {
    const index = this.data.findIndex(x => x.name == name)

    return this.data[index].height
  }

  get_data(name) {
    const index = this.data.findIndex(x => x.name == name)

    return this.data[index]
  }

  compute_size(name) {
    const index = this.data.findIndex(x => x.name == name)
    const ratio = this.data.find(x => x.name == 'ratio')
    const direction = this.data.find(x => x.name == 'direction')

    let width, height
    /// calculating display dimensions
    if (direction.value == 'right' || direction.value == 'left') {
      height = Math.round(window.innerHeight - ( this.options.audio * 3 + this.options.margin * 5 ))
      width  = Math.round(height * ratio.value)
    } else {
      height = Math.round(window.innerHeight - ( this.options.audio + this.options.margin * 3 ))
      width  = Math.round(height * ratio.value)
    }

    // /// calculating display dimensions
    // const height = Math.round(window.innerHeight - ( this.options.audio + this.options.margin * 3 ))
    // const width  = Math.round(height * ratio.value)

    /// writing display dimensions to data
    this.data[index].width  = width
    this.data[index].height = height
  }

  update_data(data) {

    const index = this.data.findIndex(d => d.name == data.name)

    /// writing data to data
    this.data[index].value = data.value;
  }

  update_array(data) {

    const index = this.array.findIndex(a => a.data.name == data.name)

    /// update array
    if(index >= 0) this.array[index].update(data)
  }

} // Extend

module.exports = Extend
