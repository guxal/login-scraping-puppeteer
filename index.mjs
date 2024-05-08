import puppeteer from 'puppeteer-extra';
import RecaptchaPlugin from 'puppeteer-extra-plugin-recaptcha';
import { executablePath } from 'puppeteer'
import hidden from 'puppeteer-extra-plugin-stealth';

(async () => {
    // Use the recaptcha plugin to solve reCAPTCHAs, configure it with your 2captcha provider token
    puppeteer.use(
        RecaptchaPlugin({
            provider: { id: '2captcha', token: '' }, // You need to replace '' with your actual 2captcha API token
            visualFeedback: true // This option colorizes reCAPTCHAs for visual feedback (violet = detected, green = solved)
        })
    );

    // Use stealth plugin to prevent detection of the bot by the website
    puppeteer.use(hidden());

    // Launching a headless browser instance
    const browser = await puppeteer.launch({
        args: ['--no-sandbox'], // Disables the Chrome sandboxing - improves performance but reduces security
        headless: true, // Runs Chrome in headless mode
        ignoreHTTPSErrors: true, // Ignores HTTPS/WSS certificate errors
        executablePath: executablePath(), // Specifies the path to the Chromium instance to use
    });
    
    const page = await browser.newPage();

    // Sets the navigation timeout to infinite to wait for pages with long loading times
    await page.setDefaultNavigationTimeout(0);
    
    // Navigates to the Call of Duty login page
    await page.goto('https://profile.callofduty.com/cod/login', {
        waitUntil: 'networkidle2' // Consider navigation to be finished when there are no more than 2 network connections for at least 500 ms
    });

    // Wait for the username input field to be available, then log the action
    await page.waitForSelector('#username')
        .then(() => console.log('Find username input...'));
    
    // Type the username and password with a delay to mimic human interaction
    await page.type('#username', '<username>', { "delay": 100 }); // Replace '<username>' with your actual username
    await page.type('#password', '<password>', { "delay": 100 }); // Replace '<password>' with your actual password
    
    // Solve any CAPTCHAs on the page using the recaptcha plugin
    await page.solveRecaptchas();
    
    // Perform simultaneous navigation and button click, waits for the next page to load after clicking the login button
    await Promise.all([
        page.waitForNavigation(),
        page.click(`#login-button`)
    ]);

    // Retrieve cookies from the current page
    const cookies = await page.cookies();

    // Retrieve a specific cookie by name and log it (useful for debugging or session persistence)
    console.log(getCookie(cookies, 'ACT_SSO_COOKIE')); // Searches for a cookie named 'ACT_SSO_COOKIE'

    // Close the browser instance
    await browser.close();
})();

// Function to filter and retrieve cookies by their name
function getCookie(cookies, name) {
    return cookies.filter(
        function (cookies) { return cookies.name === name }
    )
}
