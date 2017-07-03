var { SetCookies, GetCookies } = require('../lib/script/cookie');

var Nightmare = require('nightmare');
require('nightmare-iframe-manager')(Nightmare);
var nightmare = Nightmare({
  Promise,
  show: true,
  waitTimeout: 10000,
  gotoTimeout: 10000,
});

const ACCOUNT = 'mask_cloak@163.com';
const PASSWORD = 'pic00-';

/**
 * 登录存 cookie
 * @param  {String} account  账号
 * @param  {String} password 密码
 * @param  {Function} done)  默认传入
 */
Nightmare.action('login', async function(account, password, done) {
  const cookies = GetCookies();
  const isArray = cookies instanceof Array;
  if (isArray && cookies.length) {
    await this.goto('http://music.163.com/#/login');
    for (let cookie of cookies) {
      await this.cookies.set(cookie)
    }
  } else {
    await this.goto('http://music.163.com/#/login')
      .enterIFrame('#g_iframe')
      .click('#login-list i.u-mlg2.u-mlg2-wy') // 选择邮箱登录
      .exitIFrame()
      .type('.zcnt input.js-input.u-txt[type=text]', 'mask_cloak@163.com') // 输入账号
      .type('.zcnt input.js-input.u-txt[type=password]', 'pic00-') // 输入账号
      .click('.js-primary.u-btn2.u-btn2-2')
      .wait(1000)
      .cookies.get()
      .then(function(cookies) {
        SetCookies(cookies);
      })
  }
  done(null);
});

/**
 * 搜索
 * @param  {String} keyword 歌曲名
 * @param  {Function} done)  默认传入
 * @param  {Function} done)  默认传入
 */
Nightmare.action('search', async function(keyword, done) {
  const isString = typeof keyword === 'string';
  if (!isString) {
    return done('Error: search action require keyword is String!');
  }
  await this.goto(`http://music.163.com/#/search/m/?s=${keyword}&type=1`)
    .enterIFrame('#g_iframe')
    .wait('#m-search .srchsongst')
    .exitIFrame()
  done(null);
});
/**
 * 收藏到歌单
 * @param  {String} songMenu 歌单名
 */
Nightmare.action('favorite', async function(songMenu, done) {
  const isString = typeof songMenu === 'string';
  if (!isString) {
    return done('Error: favorite action require songMenu is String!');
  }
  await this.enterIFrame('#g_iframe')
    .click('#m-search .srchsongst .item:nth-child(1) .opt.hshow span.icn.icn-fav') // 第一首歌的收藏键
    .wait('.m-layer-w2 .zcnt .lyct .j-flag:nth-child(2) ul li') // 等待加载完歌单列表
    .evaluate(function(songMenu) {
      let songMenuList = document.querySelectorAll('.m-layer-w2 .zcnt .lyct .j-flag:nth-child(2) ul li .item .name a');
      for (let menu of songMenuList) {
        let text = menu.innerHTML;
        if (text === songMenu) {
          menu.click(); // 触发点击事件
          break;
        }
      }
    }, songMenu)
  done(null);
});

/**
 * 收集 = 搜索 + 收藏
 * @param  {String} keyword 歌曲名
 * @param  {String} songMenu 歌单名
 * @param  {Function} done)  默认传入
 */
Nightmare.action('collect', async function(keyword, songMenu, done) {
  const isArray = keyword instanceof Array;
  let isString = typeof keyword === 'string';
  if (isArray) {
    for (let item of keyword) {
      isString = typeof item === 'string';
      if (!isString) {
        return done(`Error: collect action got a Array, expect item is String but got a ${typeof item} !`);
      }
      await this.search(item)
        .favorite(songMenu);
    }
    done(null);
  } else if (isString) {
    await this.search(keyword)
      .favorite(songMenu);
    done(null);
  } else {
    done('Error: collect action require keyword is String or string Array!');
  }
});


nightmare
  .login(ACCOUNT, PASSWORD)
  .collect(['告白气球'], 'test')
  // .end()
  .catch(function(error) {
    console.error('Search failed:', error);
  });
