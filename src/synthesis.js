
// const { ipcRenderer } = require('electron')

const Extend = require('./extend.js')

const Settings = require('./settings.js')
const Filter   = require('./filter.js')
const Output   = require('./output.js')

class Synthesis extends Extend{

  constructor(global_data) {
    super()

    this.settings = new Settings(global_data)
    this.filter   = new Filter(global_data)
    this.output   = new Output(global_data)

    this.data

    this.comline()
  }

  init(data) {
    this.data = data
    const type = this.get_string('type', this.data['settings'])

    this.settings.init(this.data['settings'])
    this.filter.init(this.data['filter'], type)
    this.output.init(this.data['output'])
  }

  update(data) {
    this.data = data
    const type = this.get_string('type', this.data['settings'])

    this.settings.update(this.data['settings'])
    this.filter.update(this.data['filter'], type)
    this.output.update(this.data['output'])
  }

  comline() {

    this.settings.on('update', (data) => {
      this.data.settings = data
      this.emit('data-synthesis', this.data)
    })

    this.filter.on('update', (data) => {
      this.data.filter = data
      this.emit('data-synthesis', this.data)
    })

    this.output.on('update', (data) => {
      this.data.output = data
      this.emit('data-synthesis', this.data)
    })

  } // comline

} // Synthesis

module.exports = Synthesis
