/**
 * helloworld_q_n_a.js (POC)
 * Standalone script that opens Gemini, types a question, and extracts the response.
 * This is a minimal end-to-end test of the browser automation flow.
 */

const { initBrowser } = require('../_common/utils/initBrowser');
const { profile_setup } = require('../profile_setup');

const working_profile = profile_setup['testhelloworld04_tvbhk'];

/**
 * Runs a simple Q&A test against Gemini using Playwright.
 */
(async () => {
  let browser = null;
  let page = null;

  try {
    const { chrome_data_dir, proxy, REPORT_HEALTHY_URL } = working_profile;
    browser = await initBrowser({ proxy, chrome_data_dir });

    page = (await browser.pages())[0];

    await page.goto('https://gemini.google.com/app', { timeout: 180 * 1000 });

    await page.waitForTimeout(5 * 1000);
    console.log('target ready, proceed');

    // Type the question
    const textBox = page.locator('[data-placeholder="Ask Gemini"]');
    await textBox.pressSequentially('hi, i am mary. how are you ?', { delay: 100 });
    await page.waitForTimeout(1 * 1000);

    // Submit
    await textBox.press('Enter');
    console.log('enter sent');

    // Wait for response to generate using polling
    console.log('waiting for response to generate...');
    let responseFound = false;
    let attempts = 0;
    const maxAttempts = 20; // 20 * 3s = 60s total timeout

    while (!responseFound && attempts < maxAttempts) {
      const count = await page.locator('message-content').count();
      if (count > 0) {
        responseFound = true;
        console.log(`Response found after ${attempts * 3} seconds.`);
      } else {
        attempts++;
        await page.waitForTimeout(3 * 1000);
      }
    }

    if (!responseFound) {
      throw new Error('Timeout waiting for Gemini response');
    }

    // Extract answer
    console.log('extracting last message');
    const lastMessage = page.locator('message-content').last();
    const text = await lastMessage.innerText();
    console.log(`text: ` + text);

    console.log('quit browser');
    await browser.close();
  } catch (error) {
    console.error(error);
    if (browser) await browser.close();
  }
})();
