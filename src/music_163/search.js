var Nightmare = require('nightmare');
var nightmare = Nightmare({
  show: true,
  // waitTimeout: 10000,
  // gotoTimeout: 10000,
});

nightmare
  .viewport(1280, 720)
  .goto('http://music.163.com/#/search/m/?s=告白气球&type=1')
  // .end()
  .catch(function(error) {
    console.error('Search failed:', error);
  });
