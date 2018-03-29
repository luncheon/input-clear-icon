const fs            = require('fs')
const path          = require('path')
const { promisify } = require('util')
const outlineStroke = require('svg-outline-stroke')
const svg2ttf       = require('svg2ttf')
const ttf2woff      = require('ttf2woff')
const cleanCSS      = new (require('clean-css'))()
const writeFile     = promisify(fs.writeFile)
const parseXML      = promisify(require('xml2js').parseString)

const strokeWidths  = { thin: 25, extralight: 50, light: 75, regular: 100, medium: 125, semibold: 150, bold: 200, extrabold: 250, black: 300 }
const svgTemplate   = strokeWidth => `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1000" viewBox="0 0 1000 1000">
  <path fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" d="M 250,250 750,750 M 750,250 250,750" />
</svg>
`
const svgFontTemplate = d => `<svg xmlns="http://www.w3.org/2000/svg">
  <defs>
    <font>
      <font-face font-family="input-clear-icon" units-per-em="1000" />
      <glyph unicode="x" fill="currentColor" stroke="none" d="${d}" />
    </font>
  </defs>
</svg>
`
const cssTemplate = fs.readFileSync(path.resolve(__dirname, 'css-template.css'), 'utf-8')

Object.keys(strokeWidths).forEach(name => generate(name, strokeWidths[name]).catch(err => console.error(err)))

async function generate(name, strokeWith) {
  const svgXml      = await parseXML(await outlineStroke(svgTemplate(strokeWith)))
  const svgFont     = svgFontTemplate(svgXml.svg.path[0].$.d)
  const ttfBuffer   = new Buffer(svg2ttf(svgFont).buffer)
  const woffBuffer  = new Buffer(ttf2woff(ttfBuffer).buffer)
  const css         = cssTemplate.replace('{{fontAsBase64}}', woffBuffer.toString('base64'))
  await Promise.all([
    writeFile(path.resolve(__dirname, 'input-clear-icon.' + name + '.css'), css, 'utf-8'),
    writeFile(path.resolve(__dirname, 'input-clear-icon.' + name + '.min.css'), cleanCSS.minify(css).styles, 'utf-8'),
  ])
}
