const { initBrowser } = require('../_common/utils/initBrowser');
const { profile_setup } = require('../profile_setup');

const working_profile = profile_setup['testhelloworld04_tvbhk'];

async function askGemini(thinkingMode, question) {
  let browser = null;
  let page = null;
  let answer = 'some error occured 😢';
  let countdown = 10;

  try {
    const { chrome_data_dir, proxy, REPORT_HEALTHY_URL } = working_profile;

    browser = await initBrowser({ proxy, chrome_data_dir });
    page = (await browser.pages())[0];

    await page.goto('https://gemini.google.com/app', { timeout: 180 * 1000 });

    await page.waitForTimeout(5 * 1000);
    console.log('1: target ready, proceed');

    const modeThinkingButton = await page.locator('[data-test-id="bard-mode-menu-button"]');
    modeThinkingButton.click();
    await page.waitForTimeout(1 * 1000);

    // const modeThinking = await page.locator('[data-test-id="bard-mode-option-thinking"]');
    // modeThinking.click();
    const modeFastButton = await page.locator('[data-test-id="bard-mode-option-fast"]');
    modeFastButton.click();
    await page.waitForTimeout(1 * 1000);

    console.log('2: type in question');
    const textBox = page.locator('[data-placeholder="Ask Gemini"]');
    await textBox.click();
    await textBox.pressSequentially(question.replace(/\n/g, ' '), { delay: 50 });
    await page.waitForTimeout(1 * 1000);

    await textBox.press('Enter');
    console.log('3: enter sent');

    console.log('4: wait a little while for brew the answer');
    await page.waitForTimeout(15 * 1000);

    let lastMessageCount = await page.locator('message-content', { timeout: 180 * 1000 }).count();
    console.log(lastMessageCount);
    while (!(lastMessageCount > 0) & (countdown > 0)) {
      console.log('5: looking for last message');
      await page.waitForTimeout(5 * 1000);
      lastMessageCount = await page.locator('message-content', { timeout: 180 * 1000 }).count();
      countdown = countdown - 1;
    }

    console.log('6: last message appeared');
    const lastMessage = page.locator('message-content', { timeout: 180 * 1000 }).last();
    answer = await lastMessage.innerText();
    console.log(`7: answer: ` + answer);

  } catch (error) {
    console.log(error);
  }

  console.log('8: quit browser');
  browser ? await browser.close() : null;
  
  return { thinkingMode, question, answer };
}

function helloworld() {
  console.log('helloworld');
}

module.exports = {
  helloworld,
  askGemini,
};
