const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const uri = 'http://www.thepoemforyou.com/ruheshouting/2017nianbochudan/';

/**
 * 爬取网页数据
 * @param  {String} uri 网址
 * @return {Array}     [ 数据]
 */
async function fetchData(_uri) {
// 爬取
  const { data } = await axios.get(_uri);
  const $ = cheerio.load(data);
  const file = [];
  let cache = {};
  //  解析
  const table = $('#content').find('.post-content').find('tbody tr');
  table.each((index, item) => {
    const tds = $(item).find('td');
    const time = $(tds[0]).text(); //  时间
    const serialNum = $(tds[1]).text(); // 期刊号
    const title = $(tds[2]).find('a').text();//  标题
    const href = $(tds[2]).find('a').attr('href'); //  连接地址
    cache = {
      time,
      serialNum,
      title,
      href,
    };
    file.push(cache);
  });
  return file;
}
(async () => {
  const data = await fetchData(uri);
  fs.writeFileSync(path.join(__dirname, 'data.json'), JSON.stringify(data, null, '  '), 'utf8');
})();
