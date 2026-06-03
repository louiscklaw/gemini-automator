/**
 * Sanity Test: helloworld-3.5-flash-extend.js
 * 
 * This script verifies the ability to:
 * 1. Initialize a browser with a persistent profile.
 * 2. Navigate to Gemini.
 * 3. Select a specific model ("3.5 Thinking") and mode ("Standard").
 * 4. Send a "Hello world" prompt and retrieve the response.
 */

const { initBrowser } = require('../_common/utils/initBrowser.js');
const { profile_setup } = require('../profile_setup.js');
const fs = require('fs');
const path = require('path');
const { parse } = require('jsonc-parser');
let selectorsData;
try {
  selectorsData = parse(fs.readFileSync(path.join(__dirname, 'selectors.jsonc'), 'utf8'));
} catch (e) {
  console.error('Failed to parse selectors.jsonc:', e);
  process.exit(1);
}

async function runSanityTest() {
  let browserContext;
  try {
    // 1. Load the selectors
    const config = selectorsData["3.5 flash-extend"]; 
    console.log(`Using config: model=${config.model}, mode=${config.mode}`);

    // 2. Initialize the browser
    const profileName = 'testhelloworld04_tvbhk';
    const profile = profile_setup[profileName];
    if (!profile) {
      throw new Error(`Profile ${profileName} not found in profile_setup.js`);
    }

    console.log(`Initializing browser with profile: ${profileName}...`);
    browserContext = await initBrowser({ chrome_data_dir: profile.chrome_data_dir });
    const pages = await browserContext.pages();
    const page = pages[0];

    // 3. Navigate to Gemini
    console.log('Navigating to https://gemini.google.com...');
    await page.goto('https://gemini.google.com', { waitUntil: 'networkidle' });
    await page.waitForTimeout(5000);

    // 4. Model and Mode Selection
    console.log('Selecting model and mode...');
    
    const modelSelectorButton = page.locator('button[data-test-id="bard-mode-menu-button"]');
    await modelSelectorButton.waitFor({ state: 'visible' });
    await modelSelectorButton.click();
    await page.waitForTimeout(1000);

    console.log(`Selecting model: ${config.model}...`);
    await page.getByText(config.model, { exact: false }).waitFor({ state: 'visible', timeout: 10000 });
    // Critical Fix: Use force: true to avoid timeout/enabled issues (discovered in T10)
    await page.getByText(config.model, { exact: false }).click({ force: true });

    console.log(`Selecting mode: ${config.mode}...`);
    try {
      await page.getByText(config.mode, { exact: false }).click({ timeout: 5000 });
    } catch (e) {
      console.log('Mode selection failed or not needed, proceeding...');
    }

    // 5. Send the prompt "Hello world"
    console.log('Typing "Hello world" and pressing Enter...');
    const promptArea = page.getByRole('textbox', { name: /Prompt/i });
    await promptArea.waitFor({ state: 'visible' });
    await promptArea.fill('Hello world');
    await promptArea.press('Enter');

    // 6. Wait for the response
    console.log('Waiting for response to be generated...');
    try {
      await page.waitForSelector('button:has-text("Stop generating")', { state: 'visible', timeout: 5000 });
      await page.waitForSelector('button:has-text("Stop generating")', { state: 'hidden', timeout: 60000 });
    } catch (e) {
      console.log('Response generated quickly or "Stop" button not detected.');
    }

    // 7. Extract and print the response text
    console.log('Extracting response...');
    try {
      const lastMessage = page.locator('message-content').last();
      await lastMessage.waitFor({ state: 'visible', timeout: 30000 });
      const responseText = await lastMessage.innerText();
      console.log('\n--- Gemini Response ---');
      console.log(responseText);
      console.log('-----------------------\n');
    } catch (e) {
      console.log('Could not find response element using message-content. Trying fallback...');
      const fallbackText = await page.locator('div.message-content').last().innerText().catch(() => 'Could not find response element.');
      console.log('\n--- Gemini Response (Fallback) ---');
      console.log(fallbackText);
      console.log('----------------------------------\n');
    }

  } catch (error) {
    console.error('An error occurred during the sanity test:');
    console.error(error);
  } finally {
    if (browserContext) {
      console.log('Closing browser...');
      await browserContext.close();
    }
  }
}

// Execute the test
runSanityTest();
