
const Events = require('events')

const Main = require('./main.js')
const In   = require('./in.js')
const Out  = require('./out.js')

class Settings extends Events{

  constructor() {
    super()

    this.main
    this.in
    this.out

  } // constructor

  init_main(data) {
    delete this.main

    this.main = new Main(data)

    this.main.on('set_main', (data) => {
      this.emit('set_main', data)
    })

    this.main.on('save', () => {
      this.emit('save')
    })

    this.emit('main_set', this.main.data)
  } // mainInit

  init_in(data) {
    delete this.in

    this.in = new In(data)

    this.in.on('set_in', (data) => {
      this.emit('set_in', data)
    })

    this.emit('in_set', this.in.data)
  } // inInit

  init_out(data) {
    delete this.out

    this.out = new Out(data)

    this.out.on('set_out', (data) => {
      this.emit('set_out', data)
    })

    this.emit('out_set', this.out.data)
  } // inInit

} // Settings

module.exports = Settings
