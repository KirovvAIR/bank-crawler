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