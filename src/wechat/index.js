const fs = require('fs');
const path = require('path');

let fetchSpecial = require('./wechat.js'); // 解析每首诗, 并提前作品和专辑
// 诗歌列表  String
const srcStr = fs.readFileSync(path.join(__dirname, '../poem/data.json'), 'utf8');
// 诗歌列表  Array
const srcArr = JSON.parse(srcStr);

async function fromPoem() {
  let resultArr = [];
  const emptyArr = [];
  let index = 0;
  for (const poem of srcArr) {
    const result = await fetchSpecial(poem);
    if (!result.works.length) {
      emptyArr.push(result);
    }
    resultArr.push(result);
    console.info(resultArr.length);
    if (resultArr.length >= 100) {
      fs.writeFileSync(path.join(__dirname, 'output', `wechat-${index}.json`), JSON.stringify(resultArr, null, '  '), 'utf8');
      index += 1;
      resultArr = [];
    }
  }
  fs.writeFileSync(path.join(__dirname, 'output', `wechat-${index}.json`), JSON.stringify(resultArr, null, '  '), 'utf8');
  fs.writeFileSync(path.join(__dirname, 'output', 'empty.json'), JSON.stringify(emptyArr, null, '  '), 'utf8');
}

async function fromSelf() {
  let resultArr = [];
  const emptyArr = [];
  let index = 15;
  while (index >= 0) {
    const dataStr = fs.readFileSync(path.join(__dirname, 'output', `wechat-${index}.json`), 'utf8');
    const dataArr = JSON.parse(dataStr);
    for (const poem of dataArr) {
      const result = await fetchSpecial(poem);
      if (!result.works.length) {
        emptyArr.push(result);
      }
      resultArr.push(result);
      console.info(resultArr.length);
    }
    fs.writeFileSync(path.join(__dirname, 'output', `wechat-${index}.json`), JSON.stringify(resultArr, null, '  '), 'utf8');
    resultArr = [];
    index -= 1;
  }
  fs.writeFileSync(path.join(__dirname, 'output', 'empty.json'), JSON.stringify(emptyArr, null, '  '), 'utf8');
}

async function exec() {
  // fromPoem();
  fromSelf();
}
exec();
// module.exports = exec;
