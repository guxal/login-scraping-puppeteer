import puppeteer from 'puppeteer-extra';
import RecaptchaPlugin from 'puppeteer-extra-plugin-recaptcha';
import {executablePath} from 'puppeteer'
//const puppeteer = require('puppeteer-extra')

(async  () => {
     // const RecaptchaPlugin = require('puppeteer-extra-plugin-recaptcha')
     puppeteer.use(
          RecaptchaPlugin({
               provider: { id: '2captcha', token: 'e757141abb212dadb3a9be2daecc3164' },
               visualFeedback: true // colorize reCAPTCHAs (violet = detected, green = solved)
          })
     )

     const browser = await puppeteer.launch({
          headless: false,
          executablePath: executablePath(),
     });
     const page = await browser.newPage();

     await page.setDefaultNavigationTimeout(0)
     await page.goto('https://profile.callofduty.com/cod/login', {
          waitUntil: 'networkidle2'
          });

     // Type into search box.
     await page.waitForSelector('#username')
          .then(() => console.log('First URL with image: '));
     await page.type('#username', 'lolo@gmail.com', {"delay": 100});
     await page.type('#password', 'lololololo', {"delay": 100});
     
     await page.solveRecaptchas()

     await Promise.all([
          page.waitForNavigation(),
          page.click(`#login-button`)
     ])

     // Get cookies
     const cookies = await page.cookies();

     console.log(cookies);

  await browser.close();
})();