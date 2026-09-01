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

  var index = Math.floor(Math.random() * videos.length);
  var timer = null;

  function createVideo(i) {
    var video = document.createElement('video');
    video.id = 'random_bg';
    video.autoplay = true;
    video.loop = true;   // 循环播放，不到时间不换
    video.muted = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
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

    // 等新视频可以播放后淡入
    newVideo.addEventListener('canplay', function () {
      newVideo.style.opacity = '1';
    }, { once: true });

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
