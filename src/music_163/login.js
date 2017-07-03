var Nightmare = require('nightmare');
require('nightmare-iframe-manager')(Nightmare);


// var nightmare = require('../nightmare/index.js');

// module.exports = nightmare
//   .viewport(1280, 720)
//   .goto('http://music.163.com/#/login')
//   .enterIFrame('#g_iframe')
//   .click('#login-list i.u-mlg2.u-mlg2-wy') // 选择邮箱登录
//   .exitIFrame()
//   .type('.zcnt input.js-input.u-txt[type=text]', 'mask_cloak@163.com') // 输入账号
//   .type('.zcnt input.js-input.u-txt[type=password]', 'pic00-') // 输入账号
//   .click('.js-primary.u-btn2.u-btn2-2') // 登录
//   .end()
//   .catch(function(error) {
//     console.error('Search failed:', error);
//   });
module.exports = Nightmare.action('login', {
  login: function(done) {
    this.goto('http://music.163.com/#/login')
      .enterIFrame('#g_iframe')
      .click('#login-list i.u-mlg2.u-mlg2-wy') // 选择邮箱登录
      .exitIFrame()
      .type('.zcnt input.js-input.u-txt[type=text]', 'mask_cloak@163.com') // 输入账号
      .type('.zcnt input.js-input.u-txt[type=password]', 'pic00-') // 输入账号
      .click('.js-primary.u-btn2.u-btn2-2')
      .then(done);
  }
})
