
const homedir = require('os').homedir()
const fs = require('fs')

const ia_data = {
  filename: 'ia ',
  output:  homedir + '/Desktop/IA_output/'
}

if(!fs.existsSync(ia_data.output)) fs.mkdirSync(ia_data.output)

const Program  = require('./src/program')

const Settings = require('./src/settings')
const Preview  = require('./src/preview')

const program  = new Program(ia_data)

const settings = new Settings()
const preview  = new Preview()

// ----------------------------------------------------------------------------- resize

const resize = () => {

  // base size / preview canvas
  const height = window.innerHeight - 20 * 8
  const width = height / Math.SQRT2

  const main = document.getElementById('main')
  main.style.width = window.innerWidth - width - main.offsetLeft * 3 - 120 + 'px'

  const ins = document.getElementById('in')
  ins.style.width = window.innerWidth - width - ins.offsetLeft * 3 - 120 + 'px'

  const out = document.getElementById('out')
  out.style.width = width + 120 + 'px'

  const audio = document.getElementById('prelistening')
  audio.style.width = width + 120 + 'px'

  const audio_preview = document.getElementById('manual_control')
  audio_preview.style.width = width + 120 + 'px'

} // resize

// ----------------------------------------------------------------------------- GET

const get_main = () => {
  const data = program.get_main()
  settings.init_main(data)
  return true
}

const get_in = (data) => {
  const result = program.get_in(data)
  settings.init_in(result)
  return true
}

const get_out = (data) => {
  const result = program.get_out(data)
  settings.init_out(result)
  return true
}

const get_preview = () => {

  program.preview(preview.data)

  preview.draw(preview.data)
  return true
}

// ----------------------------------------------------------------------------- comline / set

settings.on('set_main', (data) => { // main events
  program.set_main(data)
  get_main()
})

settings.on('main_set', (data) => {
  get_in(data)
})

settings.on('save', () => {
  program.run()
  get_main()
})

settings.on('set_in', (data) => {
  program.set_in(data)
  get_in(data)
})

settings.on('in_set', (data) => {
  get_out(data)
})

settings.on('set_out', (data) => {
  program.set_out(data)
  get_out(data)
})

settings.on('out_set', (data) => {
  preview.init(data)
  get_preview()
})

preview.on('preview', (data) => {
  get_preview()
})

resize()

get_main()

let previewTimeout = false   // holder for timeout id
const previewDelay = 250     // delay after event is "complete" to run callback

window.addEventListener('resize', () => {
  resize()

  clearTimeout(previewTimeout)
  previewTimeout = setTimeout(() => {

    get_main()
  }, previewDelay)
})
