import puppeteer from 'puppeteer-extra';
import RecaptchaPlugin from 'puppeteer-extra-plugin-recaptcha';
import {executablePath} from 'puppeteer'
import hidden from 'puppeteer-extra-plugin-stealth';

(async  () => {
     puppeteer.use(
          RecaptchaPlugin({
               provider: { id: '2captcha', token: '7af124a60f7f8554e0db9d84a9820b99' },
               visualFeedback: true // colorize reCAPTCHAs (violet = detected, green = solved)
          })
     )

     puppeteer.use(hidden())
     const browser = await puppeteer.launch({
          args: ['--no-sandbox'],
          headless: false,
          ignoreHTTPSErrors: true,
          executablePath: executablePath(),
     });
     const page = await browser.newPage();

     await page.setDefaultNavigationTimeout(0)
     await page.goto('https://profile.callofduty.com/cod/login', {
          waitUntil: 'networkidle2'
          });

     // Type into search box.
     await page.waitForSelector('#username')
          .then(() => console.log('Find username input...'));
     await page.type('#username', '<username>', {"delay": 100});
     await page.type('#password', '<password>', {"delay": 100});
     
     await page.solveRecaptchas()
     
     
     await Promise.all([
          page.waitForNavigation(),
          page.click(`#login-button`)
     ])

     const cookies = await page.cookies();

     // console.log(cookies);

     console.log(getCookie(cookies, 'ACT_SSO_COOKIE'))

     await browser.close();
})();


function getCookie(cookies, name){
     return cookies.filter(
          function(cookies){ return cookies.name == name}
     )
}