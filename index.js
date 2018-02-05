/Trident|Edge/.test(navigator.userAgent) || (function() {
  var doc = document
  var body = doc.body
  var root = doc.documentElement

  var TARGET_INPUT_TYPES = {
    text:     1,
    password: 1,
    number:   1,
    url:      1,
    email:    1,
    tel:      1,
    search:   /Gecko\//.test(navigator.userAgent),
  }

  var SVG_NAMESPACE = 'http://www.w3.org/2000/svg'
  var clearIcon = body.appendChild(doc.createElementNS(SVG_NAMESPACE, 'svg'))
  var path = clearIcon.appendChild(doc.createElementNS(SVG_NAMESPACE, 'path'))
  path.setAttribute('d', 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z')
  clearIcon.setAttribute('viewBox', '0 0 24 24')
  clearIcon.onmousedown = function (event) { event.preventDefault() }

  var clearIconStyle = clearIcon.style
  clearIconStyle.display  = 'none'
  clearIconStyle.position = 'absolute'
  clearIconStyle.cursor   = 'pointer'

  function listener(event) {
    var targetElement = event.target
    var targetElementType = targetElement.type
    if (targetElement.tagName !== 'INPUT' || !TARGET_INPUT_TYPES[targetElementType]) return

    if (targetElement.value && doc.activeElement === targetElement && !targetElement.readOnly && !targetElement.disabled) {
      clearIcon.onclick = function() {
        targetElement.value = ''
        targetElement.dispatchEvent(new Event('input', { bubbles: true }))
      }
      var targetStyle = getComputedStyle(targetElement)
      var size = parseInt(targetStyle.fontSize, 10)
      var rect = targetElement.getBoundingClientRect()
      clearIconStyle.left     = (root.scrollLeft + body.scrollLeft + rect.right - size - parseInt(targetStyle.borderRightWidth, 10) - parseInt(targetStyle.paddingRight, 10) - (targetElementType === 'number' ? size + 4 : 2)) + 'px'
      clearIconStyle.top      = (root.scrollTop  + body.scrollTop  + rect.top + (rect.height - size) / 2) + 'px'
      clearIconStyle.width    = clearIconStyle.height = size + 'px'
      clearIconStyle.zIndex   = parseInt(targetStyle.zIndex, 10) + 1
      clearIconStyle.display  = null
    } else {
      clearIcon.onclick = null
      clearIconStyle.display = 'none'
    }
  }

  addEventListener('focus', listener, true)
  addEventListener('input', listener, true)
  addEventListener('blur',  listener, true)
})()
