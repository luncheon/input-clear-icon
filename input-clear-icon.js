(function() {
  'use strict'
  var doc = document
  var body = doc.body
  var root = doc.documentElement
  var userAgent = navigator.userAgent

  var IS_IE_OR_EDGE = /Trident|Edge/.test(userAgent)
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
    number:   IS_IE_OR_EDGE || /Mobile|Android/.test(userAgent) || 15,
    password: IS_IE_OR_EDGE && 15,
  }

  var clearIcon               = body.appendChild(doc.createElement('input-clear-icon'))
  var clearTargetElement
  clearIcon.style.display     = 'none'
  clearIcon.onmousedown       = function (event) { event.preventDefault() } // prevent getting focus
  clearIcon.onclick           = function () {
    if (clearTargetElement) {
      clearTargetElement.value = ''
      var inputEvent = doc.createEvent('CustomEvent')
      inputEvent.initCustomEvent('input', true, false, 'input-clear-icon:click')
      clearTargetElement.dispatchEvent(inputEvent)
    }
  }

  function listener(event) {
    var targetElement           = event.target
    if (targetElement.tagName !== 'INPUT' || !TARGET_INPUT_TYPES[targetElement.type] || targetElement.hasAttribute('data-input-clear-icon-hidden')) {
      return
    }
    if ((targetElement.value || (targetElement.validity || {}).badInput) && doc.activeElement === targetElement && !targetElement.readOnly && !targetElement.disabled) {
      if (clearTargetElement !== targetElement) {
        clearTargetElement              = targetElement
        clearIcon.removeAttribute('style')
        var targetClientRect            = targetElement.getBoundingClientRect()
        var targetStyle                 = getComputedStyle(targetElement)
        var targetDataset               = targetElement.dataset
        var clearIconStyle              = clearIcon.style
        clearIcon.className             = targetDataset.inputClearIconClass || ''
        clearIconStyle.fontSize         = targetStyle.fontSize
        clearIconStyle.backgroundColor  = targetStyle.backgroundColor
        clearIconStyle.zIndex           = parseInt(targetStyle.zIndex, 10) + 1
        applyStyles(clearIconStyle, targetDataset.inputClearIconStyle)
        var clearIconSize               = parseInt(getComputedStyle(clearIcon).fontSize, 10)
        clearIconStyle.top              = root.scrollTop  + body.scrollTop  + targetClientRect.top + (targetClientRect.height - clearIconSize) / 2 + 'px'
        clearIconStyle.left             = root.scrollLeft + body.scrollLeft + targetClientRect.right - clearIconSize
                                          - parseInt(targetStyle.borderRightWidth, 10) - parseInt(targetStyle.paddingRight, 10)
                                          - (ADDITIONAL_RIGHT_MARGINS[targetElement.type] || 0)
                                          - 2
                                          + 'px'
      }
    } else {
      clearIcon.style.display           = 'none'
      clearTargetElement                = undefined
    }
  }

  function applyStyles(style, stylesString) {
    stylesString && stylesString.split(';').forEach(function (styleEntryString) {
      var separatorIndex = styleEntryString.indexOf(':')
      if (separatorIndex !== -1) {
        style[camelCaseFromKebabCase(styleEntryString.slice(0, separatorIndex).trim())] = styleEntryString.slice(separatorIndex + 1).trim()
      }
    })
  }

  function camelCaseFromKebabCase(kebabCaseString) {
    return kebabCaseString.replace(/-[a-z]/g, function ($0) { return $0[1].toUpperCase() })
  }

  addEventListener('focus', listener, true)
  addEventListener('input', listener, true)
  addEventListener('blur',  listener, true)
})()
