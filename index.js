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
    search:   1,
  }

  var SVG_NAMESPACE_URI = 'http://www.w3.org/2000/svg'
  var clearTargetElement
  var previousResolvedStyles = {}
  var clearIcon         = body.appendChild(doc.createElementNS(SVG_NAMESPACE_URI, 'svg'))
  var clearIconStyle    = clearIcon.style
  var path = clearIcon.appendChild(doc.createElementNS(SVG_NAMESPACE_URI, 'path'))
  path.setAttribute('d', 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z')
  clearIcon.setAttribute('viewBox', '0 0 24 24')
  clearIcon.onmousedown = function (event) { event.preventDefault() } // prevent getting focus

  clearIconStyle.display  = 'none'

  clearIcon.onclick = function() {
    if (clearTargetElement) {
      clearTargetElement.value = ''
      clearTargetElement.dispatchEvent(new Event('input', { bubbles: true }))
    }
  }

  function listener(event) {
    var targetElement         = event.target
    var targetElementType     = targetElement.type
    if (targetElement.tagName !== 'INPUT' || !TARGET_INPUT_TYPES[targetElementType]) return

    if (targetElement.value && doc.activeElement === targetElement && !targetElement.readOnly && !targetElement.disabled) {
      if (clearTargetElement !== targetElement) {
        clearTargetElement      = targetElement
        var targetClientRect    = targetElement.getBoundingClientRect()
        var targetStyle         = getComputedStyle(targetElement)
        var clearIconSize       = parseInt(targetStyle.fontSize, 10)
        var targetDataset       = targetElement.dataset
        var resolvedStyles      = parseStyles(targetDataset.inputClearIconStyle)
        Object.keys(previousResolvedStyles).forEach(function (styleProperty) { clearIconStyle[styleProperty] = null })
        clearIcon.setAttribute('class', targetDataset.inputClearIconClass ? targetDataset.inputClearIconClass : 'input-clear-icon')
        clearIconStyle.cursor   = 'pointer'
        clearIconStyle.position = 'absolute'
        clearIconStyle.left     = (root.scrollLeft + body.scrollLeft + targetClientRect.right - clearIconSize - parseInt(targetStyle.borderRightWidth, 10) - parseInt(targetStyle.paddingRight, 10) - (targetElementType === 'number' ? clearIconSize + 4 : 2)) + 'px'
        clearIconStyle.top      = (root.scrollTop  + body.scrollTop  + targetClientRect.top + (targetClientRect.height - clearIconSize) / 2) + 'px'
        clearIconStyle.width    = clearIconStyle.height = clearIconSize + 'px'
        clearIconStyle.zIndex   = parseInt(targetStyle.zIndex, 10) + 1
        clearIconStyle.display  = null
        Object.keys(resolvedStyles).forEach(function (styleProperty) { clearIconStyle[styleProperty] = resolvedStyles[styleProperty] })
        previousResolvedStyles  = resolvedStyles
      }
    } else {
      clearTargetElement      = undefined
      clearIconStyle.display  = 'none'
    }
  }

  function parseStyles(stylesString) {
    return (stylesString ? stylesString.split(';') : []).reduce(function (styles, styleString) {
      var separatorIndex = styleString.indexOf(':')
      if (separatorIndex !== -1) {
        styles[camelCaseFromKebabCase(styleString.slice(0, separatorIndex).trim())] = styleString.slice(separatorIndex + 1).trim()
      }
      return styles
    }, {})
  }

  function camelCaseFromKebabCase(kebabCaseString) {
    return kebabCaseString.replace(/-([a-z])/g, function ($0, $1) { return $1.toUpperCase() })
  }

  addEventListener('focus', listener, true)
  addEventListener('input', listener, true)
  addEventListener('blur',  listener, true)
})()
