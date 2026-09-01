/* 樱花飘落特效 */
(function () {
  var PETAL_COUNT = 18;        // 同时存在的花瓣数
  var PETAL_SIZES = [12, 16, 20, 24]; // 花瓣大小
  var COLORS = ['#ffb7c5', '#ff9eb1', '#ffd6e0', '#ffadc6', '#ffcbd9'];
  var SWAY_RANGE = 80;         // 水平摆动幅度

  var petals = [];

  function createPetal() {
    var petal = document.createElement('div');
    petal.className = 'sakura-petal';

    var size = PETAL_SIZES[Math.floor(Math.random() * PETAL_SIZES.length)];
    var color = COLORS[Math.floor(Math.random() * COLORS.length)];
    var startX = Math.random() * window.innerWidth;
    var swayOffset = (Math.random() - 0.5) * 2 * SWAY_RANGE;
    var duration = 8 + Math.random() * 10; // 8~18 秒落地
    var delay = Math.random() * 3;

    petal.style.cssText =
      'position:fixed;left:' + startX + 'px;top:-30px;' +
      'width:' + size + 'px;height:' + size + 'px;' +
      'background:' + color + ';' +
      'border-radius:100% 0 100% 0;' +
      'opacity:' + (0.5 + Math.random() * 0.4) + ';' +
      'z-index:998;' +
      'pointer-events:none;' +
      'transform:rotate(' + (Math.random() * 360) + 'deg);' +
      'animation:sakura-fall ' + duration + 's linear ' + delay + 's forwards;';

    petal.dataset.swayOffset = swayOffset;

    document.body.appendChild(petal);
    petals.push(petal);

    // 落地后回收
    petal.addEventListener('animationend', function () {
      if (petal.parentNode) petal.parentNode.removeChild(petal);
      var idx = petals.indexOf(petal);
      if (idx > -1) petals.splice(idx, 1);
      if (petals.length < PETAL_COUNT) {
        setTimeout(createPetal, Math.random() * 1500);
      }
    });
  }

  // 动态插入 keyframes
  var style = document.createElement('style');
  style.textContent =
    '@keyframes sakura-fall {' +
    '0%{transform:translate(0,0) rotate(0deg);opacity:0.8;}' +
    '20%{opacity:1;}' +
    '50%{transform:translate(var(--sway,40px),50vh) rotate(180deg);}' +
    '80%{opacity:0.9;}' +
    '100%{transform:translate(var(--sway2,-40px),105vh) rotate(360deg);opacity:0;}' +
    '}' +
    '.sakura-petal{--sway:40px;--sway2:-40px;}';
  document.head.appendChild(style);

  // 初始批量生成
  for (var i = 0; i < PETAL_COUNT; i++) {
    setTimeout(createPetal, i * 400);
  }

  // PJAX 翻页后重新生成
  document.addEventListener('pjax:success', function () {
    petals.forEach(function (p) { if (p.parentNode) p.parentNode.removeChild(p); });
    petals = [];
    for (var i = 0; i < PETAL_COUNT; i++) {
      setTimeout(createPetal, i * 400);
    }
  });
})();
