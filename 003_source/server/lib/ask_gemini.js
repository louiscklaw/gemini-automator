/**
 * ask_gemini.js
 * Core module for interacting with Gemini via Playwright browser automation.
 * Handles browser lifecycle, navigation, mode selection, question submission, and answer extraction.
 */

const { initBrowser } = require('../_common/utils/initBrowser');
const { profile_setup } = require('../profile_setup');
const fs = require('fs');
const path = require('path');
const { parse } = require('jsonc-parser');

/**
 * Load selectors configuration from JSONC file to allow comments.
 */
let selectors;
try {
  const configPath = path.join(__dirname, '..', '_POC', 'selectors.jsonc');
  selectors = parse(fs.readFileSync(configPath, 'utf8'));
} catch (err) {
  console.error('Critical Error: Failed to load or parse ../_POC/selectors.jsonc');
  console.error(err);
  // We don't process.exit(1) here to allow the server to keep running, 
  // but askGemini will fail if selectors are missing.
}

/** Profile configuration for the active Chrome session */

const working_profile = profile_setup['testhelloworld04_tvbhk'];

/**
 * Sends a question to Gemini and retrieves the response.
 *
 * @param {string} thinkingMode - Either 'Fast' or 'Thinking' to set Gemini's response mode.
 * @param {string} question - The user's question/prompt.
 * @returns {Object} - Contains thinkingMode, question, and the extracted answer text.
 */
async function askGemini(thinkingMode, question) {
  let browser = null;
  let page = null;
  let answer = 'some error occured 😢';
  let countdown = 10;

  try {
    const { chrome_data_dir, proxy, REPORT_HEALTHY_URL } = working_profile;

    browser = await initBrowser({ proxy, chrome_data_dir });
    page = (await browser.pages())[0];

    // Navigate to Gemini web app
    await page.goto('https://gemini.google.com/app', { timeout: 180 * 1000 });

    await page.waitForTimeout(5 * 1000);
    console.log('1: target ready, proceed');

    try {
      const config = selectors ? selectors[thinkingMode] : null;
      if (config) {
        // Open thinking mode selector menu
        const modeMenuButton = page.locator('button[data-test-id="bard-mode-menu-button"]');
        await modeMenuButton.click();

        // Select model and mode based on config
        await page.getByText(config.model, { exact: false }).waitFor({ state: 'visible', timeout: 5000 });
        await page.getByText(config.model, { exact: false }).click({ force: true });

        await page.getByText(config.mode, { exact: false }).waitFor({ state: 'visible', timeout: 5000 });
        await page.getByText(config.mode, { exact: false }).click();
      } else {
        console.warn(`Thinking mode '${thinkingMode}' not found in selectors.jsonc, proceeding with default.`);
      }
    } catch (modeError) {
      console.log('Mode selection failed, proceeding with default mode:', modeError.message);
    }

    console.log('2: type in question');

    // Locate the input textbox and type the question
    const textBox = page.locator('[data-placeholder="Ask Gemini"]');
    await textBox.click();
    await textBox.pressSequentially(question.replace(/\n/g, ' '), { delay: 50 });
    await page.waitForTimeout(1 * 1000);

    // Submit the question by pressing Enter
    await textBox.press('Enter');
    console.log('3: enter sent');

    // Wait for initial response to start generating
    console.log('4: wait a little while for brew the answer');
    await page.waitForTimeout(15 * 1000);

    // Poll for the final response element until it appears or countdown expires
    let lastMessageCount = await page.locator('message-content', { timeout: 180 * 1000 }).count();
    console.log(lastMessageCount);
    while (!(lastMessageCount > 0) && countdown > 0) {
      console.log('5: looking for last message');
      await page.waitForTimeout(5 * 1000);
      lastMessageCount = await page.locator('message-content', { timeout: 180 * 1000 }).count();
      countdown = countdown - 1;
    }

    console.log('6: last message appeared');

    // Extract the text from the final Gemini response
    const lastMessage = page.locator('message-content', { timeout: 180 * 1000 }).last();
    answer = await lastMessage.innerText();
    console.log(`7: answer: ` + answer);
  } catch (error) {
    console.log(error);
  }

  // Always close the browser to free resources
  console.log('8: quit browser');
  browser ? await browser.close() : null;

  return { thinkingMode, question, answer };
}

/**
 * Simple smoke test function (unused, for manual testing).
 */
function helloworld() {
  console.log('helloworld');
}

module.exports = {
  helloworld,
  askGemini,
};
