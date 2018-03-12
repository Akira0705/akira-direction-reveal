/**
  direction aware content reveals.

  @param {Object} object - 配置信息
  @param {string} selector - 父元素选择器
  @param {string} itemSelector - 子元素选择器
  @param {string} animationName - 需要的动画名
  @param {bollean} enableTouch  - 添加触摸事件（移动端）
  @param {integer} touchThreshold - Touch length must be less than this to trigger reveal which prevents the event triggering if user is scrolling.
*/

const DirectionReveal = function ({
  selector: selector = '.direction-reveal',
  itemSelector: itemSelector = '.direction-reveal__card',
  animationName: animationName = 'swing',
  enableTouch: enableTouch = true,
  touchThreshold: touchThreshold = 250
} = {}) {

  const containers = document.querySelectorAll(selector)

  function init() {
    if (containers.length) {
      containers.forEach(item => {
        bindEvents(item)
      })
    } else {
      return;
    }
  }
  init()

  function bindEvents(item) {
    const items = item.querySelectorAll(itemSelector)

    items.forEach(item => {
      addEventListenerMulti(item, ['mouseenter', 'blur'], (e) => {
        addClass(e, 'in')
      })

      addEventListenerMulti(item, ['mouseleave', 'blur'], (e) => {
        addClass(e, 'out')
      })

      if (enableTouch) {

        item.addEventListener('touchstart', (e) => {
          this.touchStart = + new Date
        }, { passive: true })

        item.addEventListener('touchend', (e) => {
          this.touchTime = + new Date - (this.touchStart)

          if (this.touchTime < touchThreshold && !item.className.includes(`${animationName}--in`)) {
            e.preventDefault();

            resetVisible(e, items, addClass(e, 'in'))
          }
        })

      }
    })
  }


  function addClass(e, state) {
    let currentItem = e.currentTarget
    let direction = getDirection(e, currentItem)
    let direactionString = translateDirection(direction)

    let currentCssClasses = currentItem.className.split(' ')

    let filteredCssClasses = currentCssClasses.filter(cssClass => !cssClass.startsWith(animationName)).join(' ')

    currentItem.className = filteredCssClasses
    currentItem.classList.add(`${animationName}--${state}-${direactionString}`)
  }

  // 获取鼠标移入元素的方向
  function getDirection(e, item) {
    let w = item.offsetWidth,
        h = item.offsetHeight,
        position = getPosition(item)

    let x = (e.pageX - position.x - (w / 2) * (w > h ? (h / w) : 1)),
        y = (e.pageY- position.y - (h / 2) * (h > w ? (w / h) : 1))

    let d = Math.round(Math.atan2(y, x) / 1.57079633 + 5) % 4

    return d
  }

  // 获取目标元素离文档的x,y距离
  function getPosition(el){
    let xPos = 0,
        yPos = 0

    while (el) {
      xPos += (el.offsetLeft + el.clientLeft)
      yPos += (el.offsetTop + el.clientTop)
      el = el.offsetParent
    }

    return {
      x: xPos,
      y: yPos
    }
  }

  const translateDirection = switchcase({
    0: 'top',
    1: 'right',
    2: 'bottom',
    3: 'left'
  })('top')

  function addEventListenerMulti(element, events, fn) {
    events.forEach(e => {
      element.addEventListener(e, fn)
    })
  }

  return {
    init
  }
}

function switchcase(cases){
  return  function (defaultCase){
    return function (key) {
      return key in cases ? cases[key] : defaultCase
    }
  }
}

export default DirectionReveal


