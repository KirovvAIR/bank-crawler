// 中国农业银行

// const axios = require('axios');
// const cheerio = require('cheerio');

// async function crawl() {
//     url = 'http://app.abchina.com/rateinfo/RMBsaverate.aspx';
//     const response = await axios.get(url);
//     const html = response.data;

//     const $ = cheerio.load(html);

//     const table = $('table');
    
//     columns = [];
//     table.find('tr').first().find('td').each((i, cell) => {
//         columns.push($(cell).text()); 
//       });

//     dic = {'project':[],'rate':[]}

//     var t;
//     table.find('tr').each((i, row) => {
//         $(row).find('td').each((j, cell) => {
//             //console.log(j);
//             t = $(cell).text();
//             if (j==0){
//                 dic['project'].push(t);
//             }
//             else{
//                 dic['rate'].push(t);
//             }
//         })
//     })
//     console.log(dic);
//     return dic;
// }

// async function save_file() {
//     const fs = require('fs');

//     // 调用crawl()获取字典 
//     const dict = await crawl(); 

//     // 将字典转换成json字符串
//     const json = JSON.stringify(dict);

//     // 保存到文件
//     fs.writeFileSync('./data.json', json);
// }

// save_file();


//中国农业银行

const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

async function crawler(url) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto(url);
    
    const content = await page.content();
    const $ = cheerio.load(content);

    const table = $('table');
    const rows = table.find('tr');
    
    let targetRow;

    rows.each((i, row) => {
        const firstColText = $(row).find('td').eq(0).text();
        if (firstColText.indexOf('（一）活期') != -1) {
            targetRow = i;
            return false;
        }
    })

    let targetCell = rows.eq(targetRow).find('td').eq(1);
    let interestRate = parseFloat(targetCell.text());

    await browser.close();

    return interestRate
}

async function main(url) {
    let interestRate = await crawler(url);
    console.log(`活期年利率: ${interestRate}`);
}


let url = 'https://www.abchina.com/cn/PersonalServices/Quotation/bwbll/201511/t20151126_807920.htm';
main(url);