var Nightmare = require('nightmare');
require('nightmare-iframe-manager')(Nightmare);
var Promise = require('bluebird');
var nightmare = Nightmare({
  Promise,
  show: true,
  // waitTimeout: 10000,
  // gotoTimeout: 10000,
});

module.exports = nightmare;
