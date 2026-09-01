/* === 随机名人名言（国内外） === */
/* 首页打字机替换为随机名人名言，每次刷新随机选 5 条 */

(function () {
  var QUOTES = [
    // 国内名人名言
    "天行健，君子以自强不息。——《周易》",
    "路漫漫其修远兮，吾将上下而求索。——屈原",
    "三人行，必有我师焉。——孔子",
    "己所不欲，勿施于人。——孔子",
    "学而不思则罔，思而不学则殆。——孔子",
    "知之者不如好之者，好之者不如乐之者。——孔子",
    "不积跬步，无以至千里；不积小流，无以成江海。——荀子",
    "锲而舍之，朽木不折；锲而不舍，金石可镂。——荀子",
    "千里之行，始于足下。——老子",
    "上善若水，水善利万物而不争。——老子",
    "祸兮福之所倚，福兮祸之所伏。——老子",
    "君子和而不同，小人同而不和。——孔子",
    "业精于勤，荒于嬉；行成于思，毁于随。——韩愈",
    "山重水复疑无路，柳暗花明又一村。——陆游",
    "纸上得来终觉浅，绝知此事要躬行。——陆游",
    "人生自古谁无死，留取丹心照汗青。——文天祥",
    "天下兴亡，匹夫有责。——顾炎武",
    "海纳百川，有容乃大；壁立千仞，无欲则刚。——林则徐",
    "苟利国家生死以，岂因祸福避趋之。——林则徐",
    "长风破浪会有时，直挂云帆济沧海。——李白",
    "天生我材必有用，千金散尽还复来。——李白",
    "会当凌绝顶，一览众山小。——杜甫",
    "安得广厦千万间，大庇天下寒士俱欢颜。——杜甫",
    "先天下之忧而忧，后天下之乐而乐。——范仲淹",
    "不以物喜，不以己悲。——范仲淹",
    "宝剑锋从磨砺出，梅花香自苦寒来。——古训",
    "博观而约取，厚积而薄发。——苏轼",
    "古之立大事者，不惟有超世之才，亦必有坚忍不拔之志。——苏轼",
    "世事洞明皆学问，人情练达即文章。——曹雪芹",
    "满招损，谦受益。——《尚书》",
    // 国外名人名言
    "Stay hungry, stay foolish. —— Steve Jobs",
    "The only way to do great work is to love what you do. —— Steve Jobs",
    "I think, therefore I am. —— Descartes",
    "Imagination is more important than knowledge. —— Einstein",
    "Life is like riding a bicycle. To keep your balance, you must keep moving. —— Einstein",
    "In the middle of difficulty lies opportunity. —— Einstein",
    "The unexamined life is not worth living. —— Socrates",
    "Be the change you wish to see in the world. —— Gandhi",
    "Success is not final, failure is not fatal: it is the courage to continue that counts. —— Churchill",
    "If you're going through hell, keep going. —— Churchill",
    "The best way to predict the future is to create it. —— Peter Drucker",
    "Whether you think you can, or you think you can't — you're right. —— Henry Ford",
    "The only thing we have to fear is fear itself. —— F. D. Roosevelt",
    "To be, or not to be, that is the question. —— Shakespeare",
    "All the world's a stage, and all the men and women merely players. —— Shakespeare",
    "It is not in the stars to hold our destiny but in ourselves. —— Shakespeare",
    "I have not failed. I've just found 10,000 ways that won't work. —— Edison",
    "Genius is one percent inspiration and ninety-nine percent perspiration. —— Edison",
    "The greatest glory in living lies not in never falling, but in rising every time we fall. —— Nelson Mandela",
    "It always seems impossible until it's done. —— Nelson Mandela",
    "Education is the most powerful weapon which you can use to change the world. —— Nelson Mandela",
    "The future belongs to those who believe in the beauty of their dreams. —— Eleanor Roosevelt",
    "Do one thing every day that scares you. —— Eleanor Roosevelt",
    "Nothing in life is to be feared, it is only to be understood. —— Marie Curie",
    "Life is not easy for any of us. But what of that? We must persevere. —— Marie Curie",
    "The mind is everything. What you think you become. —— Buddha",
    "Three things cannot be long hidden: the sun, the moon, and the truth. —— Buddha",
    "Happiness is not something ready made. It comes from your own actions. —— Dalai Lama",
    "Be happy for this moment. This moment is your life. —— Omar Khayyam",
    "The journey of a thousand miles begins with a single step. —— Lao Tzu",
    "When you let go of what you are, you become what you might be. —— Lao Tzu",
    "Knowing yourself is the beginning of all wisdom. —— Aristotle",
    "We are what we repeatedly do. Excellence, then, is not an act, but a habit. —— Aristotle",
    "It is during our darkest moments that we must focus to see the light. —— Aristotle",
    "The only true wisdom is in knowing you know nothing. —— Socrates",
    "Fall seven times, stand up eight. —— Japanese Proverb",
    "The best time to plant a tree was 20 years ago. The second best time is now. —— Chinese Proverb"
  ];

  // 从名言池中随机选取 n 条（不重复）
  function pickRandom(arr, n) {
    var pool = arr.slice();
    var result = [];
    for (var i = 0; i < n && pool.length > 0; i++) {
      var idx = Math.floor(Math.random() * pool.length);
      result.push(pool.splice(idx, 1)[0]);
    }
    return result;
  }

  // 等待 typed.js 初始化完成后，替换为随机名言
  function replaceWithQuotes() {
    if (typeof window.typed !== 'undefined' && window.typed) {
      try {
        window.typed.destroy();
      } catch (e) {}

      var picked = pickRandom(QUOTES, 5);

      // 检查 Typed 构造函数是否可用
      if (typeof Typed === 'function') {
        window.typed = new Typed('#subtitle', {
          strings: picked,
          startDelay: 300,
          typeSpeed: 120,
          backSpeed: 40,
          backDelay: 2000,
          loop: true,
          smartBackspace: false
        });
      }
      return true;
    }
    return false;
  }

  // 轮询等待 typed.js 就绪（最多等 10 秒）
  var attempts = 0;
  var timer = setInterval(function () {
    attempts++;
    if (replaceWithQuotes() || attempts > 50) {
      clearInterval(timer);
    }
  }, 200);

  // pjax 刷新时重新执行
  document.addEventListener('pjax:success', function () {
    var pjaxAttempts = 0;
    var pjaxTimer = setInterval(function () {
      pjaxAttempts++;
      if (replaceWithQuotes() || pjaxAttempts > 50) {
        clearInterval(pjaxTimer);
      }
    }, 200);
  });
})();
