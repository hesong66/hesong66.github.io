/**
 * rainbow-text.js
 * 给每个字随机配色，支持「整字纯色」和「半字渐变」两种模式
 * 应用于：站名、文章标题、导航栏（静态文字）
 * 打字机文字用轮询方式安全着色，不干扰打字机工作
 */

(function () {
  'use strict';

  // --- 配色池：暖色为主 + 适量冷色点缀 ---
  var COLORS = [
    '#FF7E67', '#FF9A8C', '#FFD4C2', '#FFC9A6',  // 珊瑚暖粉
    '#FFB347', '#FFCB52', '#FFE066',              // 暖橙金
    '#FF6B9D', '#FF85C0', '#E873C9',              // 玫红紫
    '#A8E6CF', '#7EC8E3', '#9ACCF6',              // 薄荷蓝
    '#C9A0FF', '#E0BBFF', '#D8A2FF',              // 薰衣草
    '#67E8F9', '#86EFAC', '#BEF264',              // 青绿柠
    '#FCA5E8', '#F9A8D4', '#FF9F7B',              // 粉桃橙
    '#A5B4FC', '#93C5FD', '#7DD3FC'                // 天蓝
  ];

  var HALF_COLORS = [
    ['#FF7E67', '#FFD4C2'], ['#FF9A8C', '#FFCB52'],
    ['#FF6B9D', '#7EC8E3'], ['#C9A0FF', '#FFE066'],
    ['#67E8F9', '#FF85C0'], ['#86EFAC', '#FF7E67'],
    ['#A5B4FC', '#FFC9A6'], ['#E0BBFF', '#BEF264'],
    ['#FCA5E8', '#7DD3FC'], ['#D8A2FF', '#FFB347'],
    ['#93C5FD', '#FF9A8C'], ['#F9A8D4', '#A8E6CF']
  ];

  function rand(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // 模式：'full' = 整字纯色，'half' = 上半/下半渐变
  var MODE = 'half';

  /**
   * 把文本节点拆成逐字 span（仅用于静态文字）
   */
  function rainbowize(element) {
    if (!element || element.dataset.rainbow === '1') return;
    var text = element.textContent;
    if (!text || text.trim().length === 0) return;

    element.dataset.rainbow = '1';
    var frag = document.createDocumentFragment();

    for (var i = 0; i < text.length; i++) {
      var ch = text[i];
      if (ch === ' ' || ch === '\n' || ch === '\t') {
        frag.appendChild(document.createTextNode(ch));
        continue;
      }
      var span = document.createElement('span');
      span.textContent = ch;
      span.style.display = 'inline-block';

      if (MODE === 'half') {
        var pair = rand(HALF_COLORS);
        span.style.background = 'linear-gradient(180deg, ' + pair[0] + ' 0%, ' + pair[0] + ' 48%, ' + pair[1] + ' 52%, ' + pair[1] + ' 100%)';
        span.style.webkitBackgroundClip = 'text';
        span.style.backgroundClip = 'text';
        span.style.webkitTextFillColor = 'transparent';
        span.style.color = 'transparent';
      } else {
        span.style.color = rand(COLORS);
      }
      frag.appendChild(span);
    }

    element.textContent = '';
    element.appendChild(frag);
  }

  /**
   * 重新随机配色（不拆 DOM，只换颜色）
   */
  function recolor(element) {
    if (!element || element.dataset.rainbow !== '1') return;
    var children = element.children;
    for (var k = 0; k < children.length; k++) {
      if (MODE === 'half') {
        var pair = rand(HALF_COLORS);
        children[k].style.background = 'linear-gradient(180deg, ' + pair[0] + ' 0%, ' + pair[0] + ' 48%, ' + pair[1] + ' 52%, ' + pair[1] + ' 100%)';
        children[k].style.webkitBackgroundClip = 'text';
        children[k].style.backgroundClip = 'text';
        children[k].style.webkitTextFillColor = 'transparent';
      } else {
        children[k].style.color = rand(COLORS);
        children[k].style.background = 'none';
        children[k].style.webkitTextFillColor = '';
      }
    }
  }

  /**
   * 重新拆 + 随机（用于动态文本如打字机，但安全方式）
   */
  function reroll(element) {
    if (!element) return;
    delete element.dataset.rainbow;
    var text = element.textContent;
    element.textContent = text; // 清掉旧 span
    rainbowize(element);
  }

  // --- 静态文字选择器（可以安全地拆 span）---
  var STATIC_SELECTORS = [
    '#site-title',
    '#nav .menu-item a .menu-name',
    '.recent-post-info .article-title',
    '.article-title a',
    '#article-container .post-title',
    '.card-widget .item-headline span'
  ];

  // --- 打字机选择器（需要小心处理，不能干扰打字）---
  var TYPEWRITER_SELECTORS = ['#site-subtitle', '.subtitle', '#subtitle', '.typed'];

  function applyStatic() {
    STATIC_SELECTORS.forEach(function (sel) {
      var els = document.querySelectorAll(sel);
      els.forEach(function (el) {
        rainbowize(el);
      });
    });
  }

  function recolorStatic() {
    STATIC_SELECTORS.forEach(function (sel) {
      var els = document.querySelectorAll(sel);
      els.forEach(function (el) {
        recolor(el);
      });
    });
  }

  // --- 打字机安全着色：轮询方式 ---
  // 不用 MutationObserver，因为它会与打字机冲突
  // 改为：每隔一段时间检查文字是否稳定，稳定后才着色
  var typewriterState = {}; // 记录每个元素的上次文本

  function safeColorTypewriter() {
    TYPEWRITER_SELECTORS.forEach(function (sel) {
      var els = document.querySelectorAll(sel);
      els.forEach(function (el) {
        var currentText = el.textContent || '';
        var key = sel + '_' + Array.prototype.indexOf.call(document.querySelectorAll(sel), el);
        var prevText = typewriterState[key] || '';

        if (currentText !== prevText) {
          // 文字在变化（打字机正在打字），记录但不动 DOM
          typewriterState[key] = currentText;
          return;
        }

        // 文字稳定了，且还没着色
        if (el.dataset.rainbow !== '1' && currentText.trim().length > 0) {
          // 检查元素内部是否已被打字机用 span 包裹
          // 如果是 span 包裹的，给每个已有 span 加颜色
          var childSpans = el.querySelectorAll('span');
          if (childSpans.length > 0 && el.children.length === childSpans.length) {
            // 打字机已经把文字拆成 span 了，直接上色
            childSpans.forEach(function (s) {
              if (s.textContent.trim()) {
                var pair = rand(HALF_COLORS);
                s.style.display = 'inline-block';
                s.style.background = 'linear-gradient(180deg, ' + pair[0] + ' 0%, ' + pair[0] + ' 48%, ' + pair[1] + ' 52%, ' + pair[1] + ' 100%)';
                s.style.webkitBackgroundClip = 'text';
                s.style.backgroundClip = 'text';
                s.style.webkitTextFillColor = 'transparent';
                s.style.color = 'transparent';
              }
            });
            el.dataset.rainbow = '1';
          } else {
            // 普通文本节点，自己拆
            rainbowize(el);
          }
        }

        typewriterState[key] = currentText;
      });
    });
  }

  // --- 初始化 ---
  function init() {
    setTimeout(function () {
      // 静态文字立即着色
      applyStatic();

      // 打字机轮询：每 300ms 检查一次
      setInterval(safeColorTypewriter, 300);

      // 每 5 秒重新随机静态文字的颜色
      setInterval(function () {
        recolorStatic();
      }, 5000);
    }, 500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // PJAX 兼容
  document.addEventListener('pjax:complete', init);
})();
