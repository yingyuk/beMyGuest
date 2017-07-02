const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const axios = require('axios');

// 诗歌列表  String
// const srcStr = fs.readFileSync(path.join(__dirname, '../poem/data.log'), 'utf8');
// 诗歌列表  Array
// const srcArr = JSON.parse(srcStr);

// 从网页中,提取配图的地址
function parseImage($) {
  const content = $('#js_content img');
  const contentArr = Array.from(content);

  function isImage(item) {
    const clazz = $(item).attr('class');
    const type = $(item).data('type');
    const isLoading = clazz && clazz.indexOf('img_loading') >= 0;
    const isPng = type === 'png';
    const isJpeg = type === 'jpeg';
    return isJpeg && !isLoading && !isPng;
  }
  const image = contentArr.filter(isImage);
  let imageSrc = '';
  if (image.length) {
    imageSrc = $(image).data('src');
  }
  return imageSrc;
}

// 从网页中, 提取配乐的段落
function parseMusic($) {
  const content = $('#js_content p');
  const contentArr = Array.from(content);

  function isMusic(item) {
    const text = $(item).text();
    if (text) {
      return text.indexOf('配乐') >= 0 || text.indexOf('音乐剪辑') >= 0;
    }
    return false;
  }
  const music = contentArr.filter(isMusic);
  let musicText = '';
  if (music.length) {
    musicText = $(music).text();
  }
  return musicText;
}
// 执行文本的正则匹配, 返回捕获到的文本
function foundMatch(str, regexs) {
  let ret = [];
  let m;
  for (const regex of regexs) {
    while ((m = regex.exec(str)) !== null) {
      if (m.index === regex.lastIndex) {
        regex.lastIndex++;
      }
      ret = ret.concat(m.slice(1));
    }
  }
  ret = ret.filter(item => item); // item === '';
  ret = [...new Set(ret)]; // 去重
  return ret;
}
// 提取作品名字
function parseWorks(text) {
  const regexs = [
    /作品([\w\s-&]*)[。,.]?/gi, // 作品Prelude-BWV 846 Piano&Cello，
    /(?!作品)《(.*?)》/gi, // 作品《夜鸟》，由职业
    // 家泽野弘之的作品mein Mädchen [für Cello]。是非对错的界域之外，有一片田野，我
  ];
  const ret = foundMatch(text, regexs);
  return ret;
}

// 提取专辑名字
function parseSpecial(text) {
  const regexs = [
    /专辑([\w\s-&]*)/gi, // 选自专辑Bach BWV846（C大调前奏曲
  ];
  const ret = foundMatch(text, regexs);
  return ret;
}

function extractInfo(text) {
  const works = parseWorks(text); // 提取作品名字
  const special = parseSpecial(text); // 提取专辑名字
  return {
    works,
    special,
  };
}

// 解析每首诗歌的数据
async function fetchSpecial(poem) {
  const { data } = await axios.get(poem.href); // 获取微信网页数据
  const $ = cheerio.load(data); // 导入数据
  const text = parseMusic($); // 解析文本
  const image = parseImage($); // 提取图片地址

  const info = extractInfo(text);
  // 合并最终数据
  return Object.assign({}, poem, {
    text,
    image,
  }, info);
}

// async function exec() {
//   let resultArr = [];
//   const emptyArr = [];
//   let index = 0;
//   for (const poem of srcArr) {
//     const result = await fetchSpecial(poem);
//     if (result.works === '') {
//       emptyArr.push(result);
//     }
//     resultArr.push(result);
//     if (resultArr.length >= 100) {
//       fs.writeFileSync(path.join(__dirname, `wechat-${index}.log`), JSON.stringify(resultArr, null, '  '), 'utf8');
//       index += 1;
//       resultArr = [];
//     }
//     // const resultArr = srcArr.map(await fetchSpecial);
//   }
//   fs.writeFileSync(path.join(__dirname, `wechat-${index}.log`), JSON.stringify(resultArr, null, '  '), 'utf8');
//   fs.writeFileSync(path.join(__dirname, 'empty.log'), JSON.stringify(emptyArr, null, '  '), 'utf8');
// }

async function exec() {
  let resultArr = [];
  const emptyArr = [];
  let index = 15;
  while (index >= 0) {
    const dataStr = fs.readFileSync(path.join(__dirname, `wechat-${index}.log`), 'utf8');
    const dataArr = JSON.parse(dataStr);
    for (const item of dataArr) {
      const info = extractInfo(item.text);
      const result = Object.assign({}, item, info);
      if (!result.works.length) {
        emptyArr.push(result);
      }
      resultArr.push(result);
    }
    fs.writeFileSync(path.join(__dirname, 'dist', `wechat-${index}.log`), JSON.stringify(resultArr, null, '  '), 'utf8');
    resultArr = [];
    index -= 1;
  }
  fs.writeFileSync(path.join(__dirname, 'dist', 'empty.log'), JSON.stringify(emptyArr, null, '  '), 'utf8');
}

exec();
