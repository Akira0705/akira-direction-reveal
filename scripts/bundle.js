(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
  direction aware content reveals.

  @param {Object} object - 配置信息
  @param {string} selector - 父元素选择器
  @param {string} itemSelector - 子元素选择器
  @param {string} animationName - 需要的动画名
  @param {bollean} enableTouch  - 添加触摸事件（移动端）
  @param {integer} touchThreshold - Touch length must be less than this to trigger reveal which prevents the event triggering if user is scrolling.
*/

var DirectionReveal = function DirectionReveal() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$selector = _ref.selector,
      selector = _ref$selector === undefined ? '.direction-reveal' : _ref$selector,
      _ref$itemSelector = _ref.itemSelector,
      itemSelector = _ref$itemSelector === undefined ? '.direction-reveal__card' : _ref$itemSelector,
      _ref$animationName = _ref.animationName,
      animationName = _ref$animationName === undefined ? 'swing' : _ref$animationName,
      _ref$enableTouch = _ref.enableTouch,
      enableTouch = _ref$enableTouch === undefined ? true : _ref$enableTouch,
      _ref$touchThreshold = _ref.touchThreshold,
      touchThreshold = _ref$touchThreshold === undefined ? 250 : _ref$touchThreshold;

  var containers = document.querySelectorAll(selector);

  function init() {
    if (containers.length) {
      containers.forEach(function (item) {
        bindEvents(item);
      });
    } else {
      return;
    }
  }
  init();

  function bindEvents(item) {
    var _this = this;

    var items = item.querySelectorAll(itemSelector);

    items.forEach(function (item) {
      addEventListenerMulti(item, ['mouseenter', 'blur'], function (e) {
        addClass(e, 'in');
      });

      addEventListenerMulti(item, ['mouseleave', 'blur'], function (e) {
        addClass(e, 'out');
      });

      if (enableTouch) {

        item.addEventListener('touchstart', function (e) {
          _this.touchStart = +new Date();
        }, { passive: true });

        item.addEventListener('touchend', function (e) {
          _this.touchTime = +new Date() - _this.touchStart;

          if (_this.touchTime < touchThreshold && !item.className.includes(animationName + '--in')) {
            e.preventDefault();

            resetVisible(e, items, addClass(e, 'in'));
          }
        });
      }
    });
  }

  function addClass(e, state) {
    var currentItem = e.currentTarget;
    var direction = getDirection(e, currentItem);
    var direactionString = translateDirection(direction);

    var currentCssClasses = currentItem.className.split(' ');

    var filteredCssClasses = currentCssClasses.filter(function (cssClass) {
      return !cssClass.startsWith(animationName);
    }).join(' ');

    currentItem.className = filteredCssClasses;
    currentItem.classList.add(animationName + '--' + state + '-' + direactionString);
  }

  // 获取鼠标移入元素的方向
  function getDirection(e, item) {
    var w = item.offsetWidth,
        h = item.offsetHeight,
        position = getPosition(item);

    var x = e.pageX - position.x - w / 2 * (w > h ? h / w : 1),
        y = e.pageY - position.y - h / 2 * (h > w ? w / h : 1);

    var d = Math.round(Math.atan2(y, x) / 1.57079633 + 5) % 4;

    return d;
  }

  // 获取目标元素离文档的x,y距离
  function getPosition(el) {
    var xPos = 0,
        yPos = 0;

    while (el) {
      xPos += el.offsetLeft + el.clientLeft;
      yPos += el.offsetTop + el.clientTop;
      el = el.offsetParent;
    }

    return {
      x: xPos,
      y: yPos
    };
  }

  var translateDirection = switchcase({
    0: 'top',
    1: 'right',
    2: 'bottom',
    3: 'left'
  })('top');

  function addEventListenerMulti(element, events, fn) {
    events.forEach(function (e) {
      element.addEventListener(e, fn);
    });
  }

  return {
    init: init
  };
};

function switchcase(cases) {
  return function (defaultCase) {
    return function (key) {
      return key in cases ? cases[key] : defaultCase;
    };
  };
}

exports.default = DirectionReveal;

},{}],2:[function(require,module,exports){
'use strict';

var _directionReveal = require('./direction-reveal.js');

var _directionReveal2 = _interopRequireDefault(_directionReveal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Swing animation(Default)
var directionRevealSwing = (0, _directionReveal2.default)({
  selector: '.direction-reveal--demo-swing'
});

// Slide animation with all options specified
var directionRevealSlide = (0, _directionReveal2.default)({
  selector: '.direction-reveal--demo-slide',
  itemSelector: '.direction-reveal__card',
  animationName: 'slide',
  enableTouch: true,
  touchThreshold: 250
});

// Slide & push
var directionRevealSlidePush = (0, _directionReveal2.default)({
  selector: '.direction-reveal--demo-slide-push',
  animationName: 'slide'
});

// Rotate animation
var directionRevealRotate = (0, _directionReveal2.default)({
  selector: '.direction-reveal--demo-rotate',
  animationName: 'rotate'
});

// Flip animation
var directionRevealFlip = (0, _directionReveal2.default)({
  selector: '.direction-reveal--demo-flip',
  animationName: 'flip'
});

// Bootstrap demo
var directionRevealBoostrap = (0, _directionReveal2.default)({
  selector: '.direction-reveal--demo-bootstrap'
});

},{"./direction-reveal.js":1}]},{},[2])

//# sourceMappingURL=bundle.js.map
