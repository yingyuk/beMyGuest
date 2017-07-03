const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'cookie');

function SetCookies(data) {
  const now = new Date();
  const result = JSON.stringify({
    updateAt: `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`,
    data,
  });
  fs.writeFileSync(filePath, result, 'utf8');
}

function GetCookies() {
  const result = fs.readFileSync(filePath, 'utf8') || '{}';
  const { updateAt, data } = JSON.parse(result);
  if (updateAt) {
    let latest = new Date(updateAt);
    let now = new Date();
    let isAfterOneDay = now - latest > 1 * 24 * 60 * 60 * 1000; // 1 Day;
    if (isAfterOneDay) {
      // 一天后, 清除cookie
      SetCookies([]);
    }
  }
  return data;
}

module.exports = {
  SetCookies,
  GetCookies,
};
