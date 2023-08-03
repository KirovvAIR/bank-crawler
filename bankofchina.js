// 中国银行

const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

async function crawler(url) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto(url);
    
    const content = await page.content();
    const $ = cheerio.load(content);

    const table = $('table');
    
    let targetRow;

    const rows = table.find('tr');

    rows.each((i, row) => {
        const firstColText = $(row).find('td').eq(0).text();
        if (firstColText.indexOf('活期') != -1) {
            //console.log(firstColText);
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


let url = 'https://www.bankofchina.com/fimarkets/lilv/fd31/202306/t20230608_23194241.html';
main(url);