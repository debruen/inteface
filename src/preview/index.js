
const Events = require('events')

class Preview extends Events{

  constructor(data) {
    super()

    this.sampleRate = 44100.0

    this.canvas = document.querySelector('#preview')
    this.audio = document.querySelector('#prelistening')
    this.out_left = document.getElementById('out_left')
    this.out_right = document.getElementById('out_right')

    let AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioContext = new AudioContext({ sampleRate: this.sampleRate })

    this.control = document.getElementById('manual_control')
    this.link = this.control.getElementsByClassName('link')
    this.loader = this.control.getElementsByClassName('loader')
    this.right = this.control.getElementsByClassName('right')
    this.value = this.control.getElementsByClassName('value')

    this.prelistening = false

    this.pages
    this.frames
    this.data

    this.interval
    this.timeout = false // holder for timeout id
    this.delay = 333 // delay after event is "complete" to run callback
  } // constructor

  init(data) {
    clearInterval(this.interval)

    this.pages = data.pages

    this.frames = data.time * this.sampleRate

    this.set_data(data)
  } // init

  set_data(data) {
    this.canvas.height = window.innerHeight - this.canvas.offsetTop * 8
    this.canvas.width = this.canvas.height / Math.SQRT2

    this.out_left.height = this.canvas.height
    this.out_right.height = this.canvas.height

    let imageBuffer = new ArrayBuffer(this.canvas.width * this.canvas.height * 4 * this.pages)

    let audioBuffer = this.audioContext.createBuffer(2, this.frames, this.audioContext.sampleRate);

    // This gives us the actual ArrayBuffer that contains the data
    let audioBufferL = audioBuffer.getChannelData(0);
    let audioBufferR = audioBuffer.getChannelData(1);

    let pre
    if(!data.prelistening) {
      pre = this.prelistening
    } else {
      pre = data.prelistening
    }

    this.data = {
      mode: data.mode,
      width: this.canvas.width,
      height: this.canvas.height,
      out_pages: this.pages,
      out_time: data.time,
      image: new Uint8ClampedArray(imageBuffer),
      audioL: audioBufferL,
      audioR: audioBufferR,
      prelistening: pre
    }

    console.log('Preview ->')
    console.log(this.data)
  } // set

  draw() {

    if(!this.data.prelistening  && this.data.mode == 'image') {
      this.manual_control()
    } else {
      this.audio_control()
      this.data.prelistening = false
    }

  } // draw

  manual_control() {
    this.audio.style.display = 'none'
    this.loader[0].style.display = 'none'
    this.link[0].style.display = 'inline-block'
    this.value[0].innerHTML = 1 + ' / ' + this.data.out_pages
    this.value[0].style.width = "40px"

    if(this.data.out_pages == 1) {
      this.right[0].style.display = 'none'
    } else {
      this.right[0].style.display = 'inline-block'
    }

    this.control.style.display = 'block'
    let page = 0
    this.draw_page(0)
    this.link[1].addEventListener('click', () => {
      if(page > 0) {
        page -= 1
      } else {
        page = this.data.out_pages - 1
      }
      this.value[0].innerHTML = page + 1 + ' / ' + this.data.out_pages
      this.draw_page(page)
    }, false)

    this.link[2].addEventListener('click', () => {
      if(page < this.data.out_pages - 1) {
        page += 1
      } else {
        page = 0
      }
      this.value[0].innerHTML = page + 1 + ' / ' + this.data.out_pages
      this.draw_page(page)
    }, false)

    this.link[0].addEventListener('click', () => {
      this.loader[0].style.display = 'inline-block'
      this.link[0].style.display = 'none'
      this.data.prelistening = true
      this.send()
    }, false)

  } // control

  audio_control() {
    this.control.style.display = 'none'
    this.audio.style.display = 'block'

    const frames = this.data.audioL.length

    const pagetime = this.data.out_time / this.data.out_pages

    let audioBuffer = this.audioContext.createBuffer(2, frames, this.audioContext.sampleRate)
    let audioBufferL = audioBuffer.getChannelData(0)
    let audioBufferR = audioBuffer.getChannelData(1)

    for (let i = 0; i < audioBufferL.length; i++) {
      audioBufferL[i] = this.data.audioL[i]
      audioBufferR[i] = this.data.audioR[i]
    }

    this.audio.src = URL.createObjectURL(this.bufferToWave(audioBuffer, frames))

    this.draw_page(0)
    this.draw_out(0)

    let interval = []
    for (var i = 0; i < this.data.out_pages; i++) {
      interval.push(pagetime * i)
    }

    let page = 0
    this.interval = setInterval(() => {
      for (var i = 0; i < interval.length; i++) {
        if(this.audio.currentTime > interval[i]) {
          if(page != i) {
            this.draw_page(i)
            this.draw_out(i)
            page = i
          }
        }
      }
    }, 100)
  } // audio_control

  draw_out(page) {

    const ctxL = this.out_left.getContext('2d')
    const ctxR = this.out_right.getContext('2d')

    const pageframes = Math.round(this.data.audioL.length / this.data.out_pages)

    const start = Math.round(page * pageframes)
    const stop = Math.round((page + 1) * pageframes)

    let audioL = []
    let audioR = []

    for (let a = start; a < stop; a++) {
      audioL.push(this.data.audioL[a])
      audioR.push(this.data.audioR[a])
    }

    const width = audioL.length / this.out_left.height
    const height = this.out_left.height

    ctxL.fillStyle = 'rgba(255, 255, 255, 1)';
    ctxR.fillStyle = 'rgba(255, 255, 255, 1)';

    ctxL.fillRect(0, 0, this.out_left.width - 1, height - 1)
    ctxR.fillRect(0, 0, this.out_left.width - 1, height - 1)

    ctxL.fillStyle = 'rgba(0, 0, 255, 0.05)';
    ctxR.fillStyle = 'rgba(0, 0, 255, 0.05)';

    ctxL.fillRect(this.out_left.width / 2, 0, 1, height - 1)
    ctxR.fillRect(this.out_left.width / 2, 0, 1, height - 1)

    ctxL.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctxR.fillStyle = 'rgba(0, 0, 0, 0.05)';

    let c = 0, xL, xR
    for (let i = 0; i <  height; i++) {

      for (let j = 0; j < width - 1; j++) {
        // if(j == 0) {

          xL = ((audioL[c] + 1) / 2) * this.out_left.width
          ctxL.fillRect(xL, (height - 1) - i, 1, 1)

          xR = ((audioR[c] + 1) / 2) * this.out_left.width
          ctxR.fillRect(xR, (height - 1) - i, 1, 1)

        // }
        c++
      }

    }

  } // draw_page

  draw_page(page) {

    const ctx = this.canvas.getContext('2d')

    const pageframes = this.data.image.length / this.data.out_pages

    let imageArray = new Uint8ClampedArray(pageframes)

    const start = page * pageframes
    const stop = (page + 1) * pageframes
    let f = 0

    for (let a = start; a < stop; a++) {
      imageArray[f] = this.data.image[a]
      f++
    }

    const imageData = new ImageData(imageArray, this.data.width, this.data.height)

    ctx.putImageData(imageData, 0, 0)
  } // draw_page

  send() {
    clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {

      this.emit('preview', this.data)

    }, this.delay)
  } // send

  bufferToWave(abuffer, len) {
    var numOfChan = abuffer.numberOfChannels,
        length = len * numOfChan * 2 + 44,
        buffer = new ArrayBuffer(length),
        view = new DataView(buffer),
        channels = [], i, sample,
        offset = 0,
        pos = 0;

    // write WAVE header
    setUint32(0x46464952);                         // "RIFF"
    setUint32(length - 8);                         // file length - 8
    setUint32(0x45564157);                         // "WAVE"

    setUint32(0x20746d66);                         // "fmt " chunk
    setUint32(16);                                 // length = 16
    setUint16(1);                                  // PCM (uncompressed)
    setUint16(numOfChan);
    setUint32(abuffer.sampleRate);
    setUint32(abuffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
    setUint16(numOfChan * 2);                      // block-align
    setUint16(16);                                 // 16-bit (hardcoded in this demo)

    setUint32(0x61746164);                         // "data" - chunk
    setUint32(length - pos - 4);                   // chunk length

    // write interleaved data
    for(i = 0; i < abuffer.numberOfChannels; i++)
      channels.push(abuffer.getChannelData(i));

    while(pos < length) {
      for(i = 0; i < numOfChan; i++) {             // interleave channels
        sample = Math.max(-1, Math.min(1, channels[i][offset])); // clamp
        sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767)|0; // scale to 16-bit signed int
        view.setInt16(pos, sample, true);          // write 16-bit sample
        pos += 2;
      }
      offset++                                     // next source sample
    }

    // create Blob
    return new Blob([buffer], {type: "audio/wav"});

    function setUint16(data) {
      view.setUint16(pos, data, true);
      pos += 2;
    }

    function setUint32(data) {
      view.setUint32(pos, data, true);
      pos += 4;
    }
  } // bufferToWave

} // Display

module.exports = Preview
