
const { ipcRenderer } = require('electron')

class Display{

  constructor(global_data) {

    // read .column
    // read .margin
    // read .audio
    // read .ratio
    // read .direction
    this.global_data = global_data

    this.canvas = document.createElement('CANVAS')
    this.canvas.style.position = 'absolute'
    this.canvas.style.left = this.global_data.column + this.global_data.margin + 'px'
    this.canvas.style.top = this.global_data.margin + 'px'

    document.body.appendChild(this.canvas)

    // this.quit = false
    this.listener()
    // this.thread()
  }

  // thread() {
  //   while(!this.quit) {
  //     (async () => {
  //       if(await ipcRenderer.invoke('new-frame')) {
  //         this.draw()
  //       }
  //     })()
  //   }
  // }

  draw() {

    let width
    let height

    if (this.global_data.direction == 'right' || this.global_data.direction == 'left') {
      height = Math.round(window.innerHeight - ( this.global_data.audio * 3 + this.global_data.margin * 5 ))
      width  = Math.round(height * this.global_data.ratio)
    } else {
      height = Math.round(window.innerHeight - ( this.global_data.audio + this.global_data.margin * 3 ))
      width  = Math.round(height * this.global_data.ratio)
    }

    console.log('display width: ' + width);
    console.log('display height: ' + height);

    this.canvas.width = width
    this.canvas.height = height

    const density = window.devicePixelRatio;
    const buffer  = new ArrayBuffer((width * density) * (height * density) * 4)
    const image   = new Uint8ClampedArray(buffer)

    const data = {
      width: width * density,
      height: height * density,
    };

    (async () => {
      const frame = await ipcRenderer.invoke('display', data, image)
      const imageData = await new ImageData(frame, width * density, height * density)
      const ctx = await this.canvas.getContext("2d")
      ctx.putImageData(imageData, 0, 0)
    })()

  }

  listener() {
    window.addEventListener('resize', () => {
      console.log('- window resize')
      this.draw()
    })

    // ipcRenderer.on('quit-display', (event) => {
    //   this.quit = true
    // })
  }

}

module.exports = Display
