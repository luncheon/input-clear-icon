const fs      = require('fs')
const path    = require('path')
const tempdir = path.resolve(__dirname, '.temp')
const outdir  = path.resolve(tempdir, 'svg-stroke')
const strokeWidths = [10, 25, 50, 75, 100, 125, 150, 200, 250, 300]
const svgTemplate = strokeWidth => `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1000" viewBox="0 0 1000 1000">
  <path fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" d="M 250,250 750,750 M 750,250 250,750" />
</svg>
`

fs.existsSync(tempdir) || fs.mkdirSync(tempdir)
fs.existsSync(outdir)  || fs.mkdirSync(outdir)
strokeWidths.forEach(strokeWidth => fs.writeFile(path.resolve(outdir, strokeWidth + '.svg'), svgTemplate(strokeWidth), err => err && console.error))
