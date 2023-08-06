// 中国银行

const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

async function crawler(url) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto(url);

    let content = await page.content();
    let $ = cheerio.load(content);

    const link = $('div.per_bank_content a[title*="人民币存款利率表"]').attr('href');
    const fullUrl = new URL(link, url).href
    
    await page.goto(fullUrl);
    
    content = await page.content();
    $ = cheerio.load(content);
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


let url = 'https://www.bankofchina.com/fimarkets/lilv/';
main(url);