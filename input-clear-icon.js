(function() {
  var doc = document
  var body = doc.body
  var root = doc.documentElement

  var IS_IE_OR_EDGE = /Trident|Edge/.test(navigator.userAgent)
  var TARGET_INPUT_TYPES = {
    text:     1,
    password: 1,
    number:   1,
    url:      1,
    email:    1,
    tel:      1,
    search:   1,
  }
  var ADDITIONAL_RIGHT_MARGINS = {
    number:   IS_IE_OR_EDGE || 15,
    password: IS_IE_OR_EDGE && 15,
  }

  var previousResolvedStyles  = {}
  var clearIcon               = body.appendChild(doc.createElement('input-clear-icon'))
  var clearIconStyle          = clearIcon.style
  var clearTargetElement
  clearIcon.onmousedown       = function (event) { event.preventDefault() } // prevent getting focus
  clearIcon.onclick           = function() {
    if (clearTargetElement) {
      clearTargetElement.value = ''
      var inputEvent = doc.createEvent('CustomEvent')
      inputEvent.initCustomEvent('input', true, false, 'input-clear-icon:click')
      clearTargetElement.dispatchEvent(inputEvent)
    }
  }
  clearIconStyle.display      = 'none'

  function listener(event) {
    var targetElement           = event.target
    var targetElementType       = targetElement.type
    if (targetElement.tagName !== 'INPUT' || !TARGET_INPUT_TYPES[targetElementType]) {
      return
    }
    if ((targetElement.value || (targetElement.validity || {}).badInput) && doc.activeElement === targetElement && !targetElement.readOnly && !targetElement.disabled) {
      if (clearTargetElement !== targetElement) {
        clearTargetElement      = targetElement
        var targetClientRect    = targetElement.getBoundingClientRect()
        var targetStyle         = getComputedStyle(targetElement)
        var targetDataset       = targetElement.dataset
        var resolvedStyles      = parseStyles(targetDataset.inputClearIconStyle)
        Object.keys(previousResolvedStyles).forEach(function (styleProperty) { clearIconStyle[styleProperty] = '' })
        clearIcon.className     = targetDataset.inputClearIconClass || ''
        clearIconStyle.fontSize = targetStyle.fontSize
        clearIconStyle.zIndex   = parseInt(targetStyle.zIndex, 10) + 1
        Object.keys(resolvedStyles).forEach(function (styleProperty) { clearIconStyle[styleProperty] = resolvedStyles[styleProperty] })
        var clearIconSize       = parseInt(getComputedStyle(clearIcon).fontSize, 10)
        clearIconStyle.left     = root.scrollLeft + body.scrollLeft + targetClientRect.right - clearIconSize
                                - parseInt(targetStyle.borderRightWidth, 10) - parseInt(targetStyle.paddingRight, 10)
                                - (ADDITIONAL_RIGHT_MARGINS[targetElementType] || 0)
                                - 2
                                + 'px'
        clearIconStyle.top      = root.scrollTop  + body.scrollTop  + targetClientRect.top + (targetClientRect.height - clearIconSize) / 2 + 'px'
        clearIconStyle.display  = ''
        previousResolvedStyles  = resolvedStyles
      }
    } else {
      clearTargetElement        = undefined
      clearIconStyle.display    = 'none'
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
