//交通银行

const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

async function crawler(url) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto(url);

    const iframe = await page.frames().find(frame => frame.url().includes("/BankCommSite/getRMBDepositRateDate.do"));

    await iframe.waitForSelector('table');

    const content = await iframe.content();
    const $ = cheerio.load(content);
    //console.log($);
    const table = $('table').eq(1);
    const rows = table.find('tr').slice(1);

    let targetRow;

    rows.each((i, row) => {
        const firstColText = $(row).find('td').eq(0).text();
        if (firstColText.indexOf('活期') != -1) {
            //console.log(firstColText);
            targetRow = i;
            return false;
        }
    })
    let targetCell = rows.eq(targetRow);
    targetCell = targetCell.find('td');
    let spans = targetCell.find('div:first div:first span').slice(1);

    let interestRateDic = { 'date': [], 'rate': [] };

    spans.each((i, span) => {
        interestRateDic['date'].push($(span).attr('rel'));
        interestRateDic['rate'].push(parseFloat($(span).text()));
    })

    await browser.close();

    return interestRateDic;
}

async function main(url) {
    let interestRateDic = await crawler(url);
    console.log(interestRateDic);
}


let url = "http://www.bankcomm.com/BankCommSite/shtml/jyjr/cn/7158/7161/8086/8090/list.shtml";
main(url);
