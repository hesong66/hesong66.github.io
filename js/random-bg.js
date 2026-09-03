/* 视频背景定时轮播：每隔一段时间自动切换，全站所有页面 */
(function () {
  var videos = [
    '/img/bg/bg-02.mp4',
    '/img/bg/bg-04.mp4',
    '/img/bg/bg-05.mp4',
    '/img/bg/bg-06.mp4'
  ];

  var SWITCH_INTERVAL = 20000; // 每 20 秒切换一次
  var FADE_DURATION = 800;     // 淡入淡出过渡时长（毫秒）
  var FALLBACK_TIMEOUT = 3000; // 视频迟迟不能播放时，兜底显示渐变背景

  var index = Math.floor(Math.random() * videos.length);
  var timer = null;
  var fallbackTimer = null;

  function createVideo(i) {
    var video = document.createElement('video');
    video.id = 'random_bg';
    video.autoplay = true;
    video.loop = true;   // 循环播放，不到时间不换
    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.setAttribute('x5-playsinline', ''); // 微信 X5 内核内联播放
    video.setAttribute('x5-video-player-type', 'h5');
    video.preload = 'auto';

    var source = document.createElement('source');
    source.src = videos[i];
    source.type = 'video/mp4';
    video.appendChild(source);

    video.style.cssText =
      'position:fixed;top:0;left:0;width:100%;height:100%;' +
      'z-index:-999;object-fit:cover;pointer-events:none;' +
      'opacity:0;transition:opacity ' + FADE_DURATION + 'ms ease-in-out;';

    return video;
  }

  // 播放失败/超时时，显示渐变兜底背景，避免手机上一片黑
  function showFallback() {
    document.body.classList.add('bg-fallback');
  }

  function tryPlay(video) {
    var started = false;

    function reveal() {
      if (started) return;
      started = true;
      video.style.opacity = '1';
      if (fallbackTimer) clearTimeout(fallbackTimer);
    }

    // 视频能播放即淡入
    video.addEventListener('canplay', reveal, { once: true });
    video.addEventListener('playing', reveal, { once: true });

    // 显式调用 play()，处理移动端 autoplay 被拦截的情况
    var p = video.play();
    if (p && p.catch) {
      p.then(reveal).catch(function () {
        // autoplay 被浏览器拦截（如 iOS 低电量模式）→ 显示兜底背景
        showFallback();
      });
    }

    // 兜底：超时仍无法播放就显示渐变背景，保证不黑屏
    fallbackTimer = setTimeout(function () {
      if (!started && video.readyState < 2) {
        showFallback();
      } else {
        reveal();
      }
    }, FALLBACK_TIMEOUT);
  }

  function switchVideo() {
    index = (index + 1) % videos.length;
    playVideo(index);
  }

  function playVideo(i) {
    // 隐藏主题自带背景层
    var webBg = document.getElementById('web_bg');
    if (webBg) webBg.style.display = 'none';

    var oldVideo = document.getElementById('random_bg');
    var newVideo = createVideo(i);

    // 新视频先插入但透明
    document.body.insertBefore(newVideo, document.body.firstChild);

    tryPlay(newVideo);

    // 淡出旧视频并移除
    if (oldVideo) {
      oldVideo.style.opacity = '0';
      setTimeout(function () {
        if (oldVideo.parentNode) oldVideo.parentNode.removeChild(oldVideo);
      }, FADE_DURATION + 100);
    }

    // 清掉旧定时器，设新的
    if (timer) clearTimeout(timer);
    timer = setTimeout(switchVideo, SWITCH_INTERVAL);
  }

  // 启动
  playVideo(index);

  // PJAX 翻页时保持当前视频继续播放，只重设计时器
  document.addEventListener('pjax:success', function () {
    if (!timer) timer = setTimeout(switchVideo, SWITCH_INTERVAL);
  });
})();
