const fs            = require('fs')
const path          = require('path')
const { promisify } = require('util')
const xml2js        = require('xml2js')
const svg2ttf       = require('svg2ttf')
const ttf2woff      = require('ttf2woff')
const CleanCSS      = require('clean-css')

const readFile      = promisify(fs.readFile)
const writeFile     = promisify(fs.writeFile)
const parseXML      = promisify(xml2js.parseString)
const cleanCSS      = new CleanCSS()

const tempdir       = path.resolve(__dirname, '.temp')
const svgdir        = path.resolve(tempdir, 'svg-fill')
const ttfdir        = path.resolve(tempdir, 'ttf')
const woffdir       = path.resolve(tempdir, 'woff')

const svgFontTemplate = d => `<svg xmlns="http://www.w3.org/2000/svg">
  <defs>
    <font>
      <font-face font-family="input-clear-icon" units-per-em="1000" />
      <glyph unicode="x" fill="currentColor" stroke="none" d="${d}" />
    </font>
  </defs>
</svg>
`

const cssTemplate = fs.readFileSync(path.resolve(__dirname, 'template.css'), 'utf-8')
fs.existsSync(ttfdir)  || fs.mkdirSync(ttfdir)
fs.existsSync(woffdir) || fs.mkdirSync(woffdir)

Promise.all(
  fs.readdirSync(svgdir).map(async filename => {
    const basename    = path.basename(filename, '.svg')
    const svgText     = await readFile(path.resolve(svgdir, filename), 'utf-8')
    const svgXml      = await parseXML(svgText)
    const svgFontText = svgFontTemplate(svgXml.svg.path[0].$.d)
    const ttfBuffer   = new Buffer(svg2ttf(svgFontText).buffer)
    await writeFile(path.resolve(ttfdir, basename + '.ttf'), ttfBuffer)
    const woffBuffer  = new Buffer(ttf2woff(ttfBuffer).buffer)
    await writeFile(path.resolve(woffdir, basename + '.woff'), ttfBuffer)
    const css         = cssTemplate.replace('{{fontAsBase64}}', woffBuffer.toString('base64'))
    await writeFile(path.resolve(__dirname, '..', 'input-clear-icon.' + basename + '.css'), css, 'utf-8')
    await writeFile(path.resolve(__dirname, '..', 'input-clear-icon.' + basename + '.min.css'), cleanCSS.minify(css).styles, 'utf-8')
  })
).catch(console.error)
