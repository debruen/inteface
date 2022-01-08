
const Events = require('events')

class Display extends Events{

  constructor(options) {
    super()

    this.data

    this.options = options

    this.div = document.createElement('DIV')
    this.div.style.position = 'absolute'
    this.div.style.left = '600px'
    this.div.style.top = '0px'
    this.div.style.marginRight = this.options.margin + 'px'

    this.spacer = document.createElement('DIV')
    this.spacer.style.position = 'absolute'

    this.canvas = document.createElement('CANVAS')
    this.canvas.style.position = 'absolute'

    this.outLeft = document.createElement('CANVAS')
    this.outLeft.style.position = 'absolute'

    this.outRight = document.createElement('CANVAS')
    this.outRight.style.position = 'absolute'

    this.audio = document.createElement('AUDIO')
    this.audio.style.position = 'absolute'
    this.audio.style.height = this.options.audio + 'px'
    this.audio.controls = true

    this.labelLeft = document.createElement('DIV')
    this.labelLeft.style.position = 'absolute'
    this.labelLeft.style.fontSize = this.options.font / 1.5 + 'px'
    this.labelLeft.style.lineHeight = 1.5

    this.labelRight = document.createElement('DIV')
    this.labelRight.style.position = 'absolute'
    this.labelRight.style.fontSize = this.options.font / 1.5 + 'px'
    this.labelRight.style.lineHeight = 1.5

    this.div.appendChild(this.spacer)
    this.div.appendChild(this.canvas)
    this.div.appendChild(this.outLeft)
    this.div.appendChild(this.outRight)
    this.div.appendChild(this.audio)
    this.div.appendChild(this.labelLeft)
    this.div.appendChild(this.labelRight)

    document.body.appendChild(this.div)

    let AudioContext = window.AudioContext || window.webkitAudioContext
    this.audioContext = new AudioContext({ sampleRate: 44100.0 })

    this.imageBuffer
    this.audioBufferL
    this.audioBufferR

    this.interval
  } // constructor

  buffer(data) {

    this.data = data

    const audioframes = this.data.input[2].value / 1000 * 44100.0

    const imageBuffer = new ArrayBuffer(this.data.width * this.data.height * 4 * this.data.input[1].value)
    const audioBuffer = this.audioContext.createBuffer(2, audioframes, 44100.0)

    // This gives us the actual ArrayBuffer that contains the data
    this.imageBuffer  = new Uint8ClampedArray(imageBuffer)
    this.audioBufferL = audioBuffer.getChannelData(0)
    this.audioBufferR = audioBuffer.getChannelData(1)

  } // buffer END

  draw() {

    this.setStyles()

    // create image
    const imageLength = this.imageBuffer.length / this.data.input[1].value

    let imageData = []

    for (let i = 0; i < this.data.input[1].value; i++) {
      let imageArray = new Uint8ClampedArray(imageLength)

      const start = i * imageLength
      const stop = (i + 1) * imageLength
      let f = 0

      for (let a = start; a < stop; a++) {
        imageArray[f] = this.imageBuffer[a]
        f++
      }

      imageData.push( new ImageData(imageArray, this.data.width, this.data.height) )
    }
    const ctx = this.canvas.getContext("2d")

    // create audio
    const audioframes = this.audioBufferL.length
    const pagetime = ( this.data.input[2].value / 1000 ) / this.data.input[1].value

    let audioBuffer = this.audioContext.createBuffer(2, audioframes, this.audioContext.sampleRate)
    let audioBufferL = audioBuffer.getChannelData(0)
    let audioBufferR = audioBuffer.getChannelData(1)

    for (let i = 0; i < audioBufferL.length; i++) {
      audioBufferL[i] = this.audioBufferL[i]
      audioBufferR[i] = this.audioBufferR[i]
    }

    this.audio.src = URL.createObjectURL(this.bufferToWave(audioBuffer, audioframes))

    // draw image and audio graphical
    // this.drawCanvas(imageData[0])
    ctx.putImageData(imageData[0], 0, 0)
    this.drawOut(0)

    let interval = []
    for (let i = 0; i < this.data.input[1].value; i++) {
      interval.push(pagetime * i)
    }

    clearInterval(this.interval)
    let frame = 0
    this.interval = setInterval(() => {
      for (let i = 0; i < interval.length; i++) {
        if(this.audio.currentTime > interval[i]) {
          if(frame != i) {
            // this.drawCanvas(imageData[i])
            ctx.putImageData(imageData[i], 0, 0)
            this.drawOut(i)
            frame = i
          }
        }
      }
    }, 100)
  } // audioControl END

  drawOut(frame) {

    const ctxL = this.outLeft.getContext('2d')
    const ctxR = this.outRight.getContext('2d')

    const pageframes = Math.round(this.audioBufferL.length / this.data.input[1].value)

    const start = Math.round(frame * pageframes)
    const stop = Math.round((frame + 1) * pageframes)

    let audioL = []
    let audioR = []

    for (let a = start; a < stop; a++) {
      audioL.push(this.audioBufferL[a])
      audioR.push(this.audioBufferR[a])
    }

    let width, height, c = 0, xL, xR, yL, yR

    if (this.data.input[4].value == 'right' || this.data.input[4].value == 'left') {

      ctxL.fillStyle = 'rgba(255, 255, 255, 1)'
      ctxR.fillStyle = 'rgba(255, 255, 255, 1)'

      ctxL.fillRect(0, 0, this.outLeft.width - 1, this.outLeft.height - 1)
      ctxR.fillRect(0, 0, this.outRight.width - 1, this.outRight.height - 1)

      ctxL.fillStyle = 'rgba(255, 0, 0, 0.25)'
      ctxR.fillStyle = 'rgba(255, 0, 0, 0.25)'

      ctxL.fillRect(0, this.outLeft.height / 2, this.outLeft.width  - 1, 1)
      ctxR.fillRect(0, this.outRight.height / 2, this.outRight.width - 1, 1)

      ctxL.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctxR.fillStyle = 'rgba(0, 0, 0, 0.05)'

      width = this.outLeft.width
      height = audioL.length / this.outLeft.width

      for (let i = 0; i <  width; i++) {

        for (let j = 0; j < height - 1; j++) {
          if (this.data.input[4].value == 'left') {
            xL = width - 1 - i
            xR = width - 1 - i
          } else {
            xL = i
            xR = i
          }

          yL = ((audioL[c] + 1) / 2) * this.outLeft.height
          ctxL.fillRect(xL, yL, 1, 1)

          yR = ((audioR[c] + 1) / 2) * this.outRight.height
          ctxR.fillRect(xR, yR, 1, 1)

          c++
        }
      }

    } else {

      ctxL.fillStyle = 'rgba(255, 255, 255, 1)'
      ctxR.fillStyle = 'rgba(255, 255, 255, 1)'

      ctxL.fillRect(0, 0, this.outLeft.width - 1, this.outLeft.height - 1)
      ctxR.fillRect(0, 0, this.outRight.width - 1, this.outRight.height - 1)

      ctxL.fillStyle = 'rgba(255, 0, 0, 0.25)'
      ctxR.fillStyle = 'rgba(255, 0, 0, 0.25)'

      ctxL.fillRect(this.outLeft.width / 2, 0, 1, this.outLeft.height - 1)
      ctxR.fillRect(this.outRight.width / 2, 0, 1, this.outRight.height - 1)

      ctxL.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctxR.fillStyle = 'rgba(0, 0, 0, 0.05)'

      width = audioL.length / this.outLeft.height
      height = this.outLeft.height

      for (let i = 0; i <  height; i++) {

        for (let j = 0; j < width - 1; j++) {
          if (this.data.input[4].value == 'down') {
            xL = i
            xR = i
          } else {
            xL = height - 1 - i
            xR = height - 1 - i
          }

          xL = ((audioL[c] + 1) / 2) * this.outLeft.width
          ctxL.fillRect(xL, (height - 1) - i, 1, 1)

          xR = ((audioR[c] + 1) / 2) * this.outRight.width
          ctxR.fillRect(xR, (height - 1) - i, 1, 1)

          c++
        }
      }
    }

  } // draw_page

  setStyles() {

    // spacer and audio
    if (this.data.input[4].value == 'right' || this.data.input[4].value == 'left') {

      this.spacer.style.width = this.data.width + this.options.margin * 2 + 'px'
      this.spacer.style.height = '1px'

      this.audio.style.top = this.data.height + this.options.audio * 2 + this.options.margin * 4 + 'px'
      this.audio.style.left = this.options.margin + 'px'
      this.audio.style.width = this.data.width + 'px'

    } else {

      this.spacer.style.width = this.data.width + this.options.margin * 4 + this.options.audio * 2 + 'px'
      this.spacer.style.height = '1px'

      this.audio.style.top = this.data.height + this.options.margin * 2 + 'px'
      this.audio.style.left = this.options.margin + 'px'
      this.audio.style.width = this.data.width + (this.options.audio + this.options.margin) * 2 + 'px'

    }

    // set canvas position
    if (this.data.input[0].value == 'audio') {
      if (this.data.input[4].value == 'right' || this.data.input[4].value == 'left') {
        this.canvas.style.top = this.options.audio * 2 + this.options.margin * 3 + 'px'
        this.canvas.style.left = this.options.margin + 'px'

      } else {
        this.canvas.style.top = this.options.margin + 'px'
        this.canvas.style.left = this.options.audio * 2 + this.options.margin * 3 + 'px'
      }
    } else {
      this.canvas.style.top = this.options.margin + 'px'
      this.canvas.style.left = this.options.margin + 'px'
    }

    // set canvas size
    this.canvas.width = this.data.width
    this.canvas.height = this.data.height

    // audio graphical
    if (this.data.input[4].value == 'right' || this.data.input[4].value == 'left') {

      if (this.data.input[0].value == 'audio') {
        this.outLeft.style.top =  this.options.margin + 'px'
        this.outRight.style.top = this.options.audio + this.options.margin * 2 + 'px'
        this.labelLeft.style.top = parseInt(this.outLeft.style.top) + this.options.audio + 'px'
        this.labelRight.style.top = parseInt(this.outRight.style.top) + this.options.audio + 'px'

      } else {
        this.outLeft.style.top =  this.data.height + this.options.margin * 2 + 'px'
        this.outRight.style.top = this.data.height + this.options.audio + this.options.margin * 3 + 'px'
        this.labelLeft.style.top = parseInt(this.outLeft.style.top) - this.options.margin + 'px'
        this.labelRight.style.top = parseInt(this.outRight.style.top) - this.options.margin + 'px'
      }

      this.outLeft.style.left = this.options.margin + 'px'

      this.outRight.style.left = this.options.margin + 'px'

      this.outLeft.width = this.data.width
      this.outLeft.height = this.options.audio

      this.outRight.width = this.data.width
      this.outRight.height = this.options.audio

      this.labelLeft.style.left = this.options.margin + 'px'
      this.labelLeft.style.width = this.outLeft.width + 'px'
      this.labelLeft.style.height = this.options.margin + 'px'
      this.labelLeft.style.transform = 'rotate(0deg)'

      this.labelRight.style.left = this.options.margin + 'px'
      this.labelRight.style.width = this.outLeft.width + 'px'
      this.labelRight.style.height = this.options.margin + 'px'
      this.labelRight.style.transform = 'rotate(0deg)'

      if (this.data.input[4].value == 'left') {
        this.labelLeft.style.direction = 'rtl'
        this.labelRight.style.direction = 'rtl'

      } else {
        this.labelLeft.style.direction = 'ltr'
        this.labelRight.style.direction = 'ltr'

      }

    } else {

      this.outLeft.style.top = this.options.margin + 'px'
      this.outRight.style.top = this.options.margin + 'px'

      if (this.data.input[0].value == 'audio') {
        this.outLeft.style.left = this.options.margin + 'px'

        this.outRight.style.left = this.options.audio + this.options.margin * 2 + 'px'
        this.labelLeft.style.left = parseInt(this.outLeft.style.left) + this.options.audio + this.options.margin + 'px'
        this.labelRight.style.left = parseInt(this.outRight.style.left) + this.options.audio + this.options.margin + 'px'
      } else {
        this.outLeft.style.left = 2 * this.options.margin + this.data.width + 'px'

        this.outRight.style.left = 3 * this.options.margin + this.data.width + this.options.audio + 'px'
        this.labelLeft.style.left = parseInt(this.outLeft.style.left) + 'px'
        this.labelRight.style.left = parseInt(this.outRight.style.left) + 'px'
      }

      this.outLeft.width = this.options.audio
      this.outLeft.height = this.data.height

      this.outRight.width = this.options.audio
      this.outRight.height = this.data.height

      this.labelLeft.style.top = this.options.margin + 'px'
      this.labelLeft.style.width = this.outLeft.height + 'px'
      this.labelLeft.style.height = this.options.margin + 'px'

      this.labelLeft.style.direction = 'ltr'
      this.labelLeft.style.transformOrigin = 'top left'

      // this.labelLeft.style.writingMode = 'vertical-rl'

      this.labelRight.style.top = this.options.margin + 'px'
      this.labelRight.style.width = this.outRight.height + 'px'
      this.labelRight.style.height = this.options.margin + 'px'

      this.labelRight.style.direction = 'ltr'
      this.labelRight.style.transformOrigin = 'top left'

      // this.labelRight.style.writingMode = 'vertical-rl'

      if (this.data.input[4].value == 'up') {
        this.labelLeft.style.top = this.outLeft.height + 'px'
        this.labelRight.style.top = this.outRight.height + 'px'
        this.labelLeft.style.transformOrigin = 'bottom left'

        this.labelRight.style.transformOrigin = 'bottom left'

        this.labelLeft.style.transform = 'rotate(270deg)'
        this.labelRight.style.transform = 'rotate(270deg)'

      } else {

        this.labelLeft.style.transform = 'rotate(90deg)'
        this.labelRight.style.transform = 'rotate(90deg)'
      }

    }

    this.labelLeft.innerHTML = 'left'
    this.labelRight.innerHTML = 'right'

  } // setStyles END

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
  } // bufferToWave END

} // Display

module.exports = Display
