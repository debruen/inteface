
const Extend = require('./extend.js')

const Headline = require('./extend/headline.js')
const Select   = require('./extend/select.js')
const Range    = require('./extend/range.js')

class Settings extends Extend{

  constructor(global_data) {
    super()

    this.global_data = global_data

    this.name = 'settings'
    this.settingsWidth = global_data.settingsWidth
    this.margin        = global_data.margin

    this.div = this.mainDiv()

    this.data

    this.array = []
  }

  init(data) {
    this.data = data

    const ratio     = data.find(x => x.name == 'ratio')
    const direction = data.find(x => x.name == 'direction')
    const stereo    = data.find(x => x.name == 'stereo')

    this.global_data.ratio = ratio.value
    this.global_data.direction = direction.value
    this.global_data.stereo = stereo.value

    this.headline = new Headline(this.global_data, this.div)
    this.headline.init(this.data)

    const type = data.find(x => x.name == 'type')
    this.type = new Select(this.global_data, this.div)
    this.type.init(type)

    const imagesize = data.find(x => x.name == 'area')
    this.imagesize = new Select(this.global_data, this.div)
    this.imagesize.init(imagesize)

    const time = data.find(x => x.name == 'frame time')
    this.time = new Range(this.global_data, this.div)
    this.time.init(time)

    const frames = data.find(x => x.name == 'frames')
    this.frames = new Range(this.global_data, this.div)
    this.frames.init(frames)

    // this.array.push(new Headline(this.global_data, this.div))

    this.data.forEach((d, i) => {
      // if(d.form == "select") {
      //   this.array.push(new Select(this.global_data, this.div))
      //   this.array[i].init(d)
      // }
      // if(d.form == "range") {
      //   this.array.push(new Range(this.global_data, this.div))
      //   this.array[i].init(d)
      // }
    })

    this.comline()
    this.send()
  } // init END

  update(data = this.data) {
    this.data = data

    const ratio     = data.find(x => x.name == 'ratio')
    const direction = data.find(x => x.name == 'direction')
    const stereo    = data.find(x => x.name == 'stereo')
    this.global_data.ratio = ratio.value
    this.global_data.direction = direction.value
    this.global_data.stereo = stereo.value

    this.data.forEach((d) => {
      this.update_array(d);
    })

  }

  comline() {

    this.headline.on('update', (data) => {
      this.data = data
      this.emit('update', this.data)
    })

    this.type.on('update', (data) => {
      this.update_data(data)
      this.emit('update', this.data)
    })

    this.imagesize.on('update', (data) => {
      this.update_data(data)
      this.emit('update', this.data)
    })

    this.time.on('update', (data) => {
      this.update_data(data)
      this.emit('update', this.data)
    })

    this.frames.on('update', (data) => {
      this.update_data(data)
      this.emit('update', this.data)
    })

    // this.array.forEach((a) => {
    //   a.on('update', (d) => {
    //     this.update_data(d);
    //     this.send()
    //   })
    // })

  }

  send() {
    this.emit('update', this.data)
  }

}

module.exports = Settings
