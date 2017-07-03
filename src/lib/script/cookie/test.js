var { SetCookies, GetCookies } = require('./index.js');

SetCookies([{
  name: 'test',
}]);

var result = GetCookies();

console.info(result);
