
const Events = require('events')

class Files extends Events{

  constructor(options, div) {
    super()

    this.data

    this.div = document.createElement('DIV')
    this.div.style.display = 'block'
    this.div.style.marginTop = options.margin / 2 + 'px'

    this.files = document.createElement('INPUT')
    // this.files.style.display = 'block'
    this.files.type = 'file'
    this.div.appendChild(this.files)

    this.removeFiles = document.createElement('DIV')
    this.removeFiles.style.display = 'none'
    this.removeFiles.style.float = 'right'
    this.removeFiles.style.marginRight = options.margin / 2 + 'px'
    this.removeFiles.style.fontSize = 'smaller'
    this.removeFiles.style.color = 'red'
    this.removeFiles.innerHTML = "remove files"
    this.removeFiles.style.cursor = 'pointer'
    this.div.appendChild(this.removeFiles)

    this.thumbs = document.createElement('DIV')
    this.thumbs.style.display = 'block'
    this.thumbs.style.marginTop = options.margin + 'px'
    this.thumbs.style.marginRight = options.margin + 'px'
    this.thumbs.style.width = '600px'
    this.div.appendChild(this.thumbs)

    div.appendChild(this.div)

  } // constructor

  init(data) {

    this.data = data

    this.update()

    this.listener()
  } // init

  update(data = this.data) {

    this.data = data

    if(this.data[0].value == 'image') {
      this.files.accept = 'image/png, image/jpeg, image/tiff'
      this.files.multiple = true
    } else {
      this.files.accept = 'audio/aiff'
      this.files.multiple = false
    }

    this.files.value = ''
    this.thumbs.innerHTML = ''

    if(this.data[6].length > 0) {
      this.removeFiles.style.display = "inline-block";

      if(this.data[0].value == 'image') {

        const height = 50
        const width = height * this.data[3].value // ratio

        for (let i = 0; i < this.data[6].length; i++) {
          const div = document.createElement("DIV")
          div.style.display = 'inline-block'
          div.style.width = width + 'px'
          div.style.height = height + 'px'
          div.style.marginRight = '2px'

          const image = new Image()
          image.src = this.data[6][i].file
          image.style.objectFit = 'cover'
          image.style.width = '100%'
          image.style.height = '100%'

          div.appendChild(image)

          this.thumbs.appendChild(div)
        }

      } else if (this.data[0].value == 'audio') {

        for (let i = 0; i < this.data[6].length; i++) {
          const audio = document.createElement("SPAN")
          audio.innerHTML = this.data[6][i].file.match(/([^\/]*)\/*$/)[1]
          this.thumbs.appendChild(audio)
          if (i < this.data[6].length - 1) {
            const br = document.createElement("BR")
            this.thumbs.appendChild(br)
          }
        }

      }

    } else {
      this.removeFiles.style.display = "none";
    }

  } // update

  // crop(image, width, height) {
  //
  //   const naturalWidth = parseInt(image.naturalWidth)
  //   const naturalHeight = parseInt(image.naturalHeight)
  //
  //   if (static_cast<unsigned int>(image.cols) != width || static_cast<unsigned int>(image.rows) != height) {
  //
  //     cv::Mat temp;
  //
  //     double a = width / static_cast<double>(height);
  //     double b = image.cols / static_cast<double>(image.rows);
  //     if(a < b) { // portrait
  //       unsigned int w, x0, x1;
  //
  //       w = round(image.cols * (static_cast<float>(height) / image.rows));
  //
  //       cv::Size size(w, height);
  //       cv::resize(image, temp, size, 0, 0, cv::INTER_CUBIC);
  //
  //       x0 = (temp.cols - width) / 2;
  //       x1 = x0 + width;
  //
  //       cv::Rect roi(x0, 0, x1, temp.rows);
  //       image = temp(roi);
  //
  //     } else { // landscape
  //       unsigned int h, y0, y1;
  //
  //       h = round(image.rows * (static_cast<float>(width) / image.cols));
  //
  //       cv::Size size(width, h);
  //       cv::resize(image, temp, size, 0, 0, cv::INTER_CUBIC);
  //
  //       y0 = (temp.rows - height) / 2;
  //       y1 = y0 + height;
  //
  //       cv::Rect roi(0, y0, temp.cols, y1);
  //       image = temp(roi);
  //
  //     }
  //   }
  //
  // } // crop

  listener() {

    this.files.addEventListener('change', () => {
      let files = []
      for (var i = 0; i < this.files.files.length; i++) {

        let fileObject = {}

        if(this.data[0].value == 'image') {
          fileObject = {
            file: this.files.files[i].path,
            width: 0,
            height: 0
          }
        }

        if (this.data[0].value == 'audio') {
          fileObject = {
            file: this.files.files[i].path,
            time: 0
          }
        }

        files.push(fileObject)
      }
      this.data[6] = files
      this.emit('update', files)
    }, false)

    this.removeFiles.addEventListener('click', () => {
      let files = []
      this.data[6] = files
      this.emit('update', files)
    }, false)

  } // listener

} // Range

module.exports = Files
