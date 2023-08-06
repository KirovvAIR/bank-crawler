const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

async function crawler(url) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto(url);

    const content = await page.content();
    const $ = cheerio.load(content);

    let table = $('#ck table');
    $('table tr').each((i, row) => {
        $(row).find('td').each((j, col) => {
            console.log($(col).text().trim());
        })
    })

    await browser.close();
}

let url = "https://www.icbc.com.cn";
crawler(url);