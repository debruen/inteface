
const ImageAudio = require('ia')

class Program {

  constructor(data) {

    this.program = new ImageAudio(data)

  } // constructor

  get_data() {
    return this.program.get_data()
  } // get_main

  set_data(data) {
    return this.program.set_data(data)
  } // set_main

  // --------------------------------------------------------------------------- main

  get_main() {
    return {
      mode: this.program.get_mode(),
    }
  } // get_main

  set_main(settings) {
    this.program.set_mode(settings.mode)
    return true
  } // set_main

  // --------------------------------------------------------------------------- in GET

  get_in(data) {
    if(data.mode == 'image') return JSON.parse(this.program.get_image_in())
    if(data.mode == 'audio') return JSON.parse(this.program.get_audio_in())
    return false
  } // get_in

  // --------------------------------------------------------------------------- in SET

  set_in(data) {
    if(data.mode == 'image') this.set_image(data)
    if(data.mode == 'audio') this.set_audio(data)
    return true
  } // get_in

  // --------------------------------------------------------------------------- set in IMAGE

  set_image(data) {
    if(typeof data.processes == 'string') {

      if(data.processes == 'rmv_layer') {
        this.program.rmv_image_layer()
      }

     if(data.processes == 'layer') {
        this.program.add_image_layer()
      }

      if(data.processes == 'rmv_filter') {
        this.program.rmv_image_filter()
      }

      if(data.processes == 'filter') {
        this.program.add_image_filter()
      }

    } else {
      this.program.set_image_in(JSON.stringify(data))
    }

    return true
  }

  // --------------------------------------------------------------------------- set in Audio

  set_audio(data) {
    if(typeof data.processes == 'string') {

      if(data.processes == 'rmv_track') {
        this.program.rmv_audio_track()
      }

     if(data.processes == 'track') {
        this.program.add_audio_track()
      }

      if(data.processes == 'rmv_filter') {
        this.program.rmv_audio_filter()
      }

      if(data.processes == 'filter') {
        this.program.add_audio_filter()
      }

    } else {
      this.program.set_audio_in(JSON.stringify(data))
    }

    return true
  }


  // --------------------------------------------------------------------------- out GET

  get_out(data) {
    if(data.mode == 'image') return JSON.parse(this.program.get_image_out())
    if(data.mode == 'audio') return JSON.parse(this.program.get_audio_out())
    return false
  } // get_out

  // --------------------------------------------------------------------------- out SET

  set_out(data) {
    if(data.mode == 'image') this.program.set_image_out(JSON.stringify(data))
    if(data.mode == 'audio') this.program.set_audio_out(JSON.stringify(data))
    return true
  } // get_in

  // --------------------------------------------------------------------------- computation

  preview(data) {
    this.program.preview(data.image, data.audioL, data.audioR, data.width, data.height, data.out_pages, data.prelistening)
    return true
  }

  run() {
    this.program.run()
  }
} // Program

module.exports = Program
