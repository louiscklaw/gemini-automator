/**
 * initBrowser.js
 * Initializes a persistent Chromium browser context with anti-detection measures.
 * Used by the server to create browser sessions for Gemini automation.
 */

const { chromium } = require('playwright');
const fs = require('fs'); // Added fs module for directory copying

/**
 * Reads BROWSER_HEADED_MODE from environment.
 * 1 = headed (visible browser), 0 = headless (invisible).
 * Note: This variable is defined but currently unused; headless mode is hardcoded.
 */
const BROWSER_HEADED_MODE = process.env.BROWSER_HEADED_MODE === '0';

/**
 * Patches the `navigator.webdriver` property to hide automation fingerprints.
 * Playwright sets this property automatically; this function neutralizes it.
 *
 * @param {Page} page - Playwright page object to patch.
 */
async function initStealthing(page) {
  try {
    await page.evaluate(() => {
      Object.defineProperty(navigator, 'webdriver', {
        get: () => undefined,
      });
    });
  } catch (error) {
    console.log('error during initStealthing');
    console.log(error);
    throw error;
  }
}

/**
 * Launches a persistent Chromium browser with extensive anti-detection and performance flags.
 *
 * @param {Object} options
 * @param {string} options.chrome_data_dir - Path to Chrome user data directory for session persistence.
 * @param {string} [options.proxy] - Optional SOCKS5 proxy server URL.
 * @returns {Browser} - Playwright browser instance.
 */
async function initBrowser({ chrome_data_dir }) {

  // Implementation of cp -r /browser_data_dir/...known_good /browser_data_dir/...
  try {
    const backupDir = `${chrome_data_dir}.known_good`;
    if (fs.existsSync(backupDir)) {
      console.log(`Restoring browser profile from backup: ${backupDir} -> ${chrome_data_dir}`);
      fs.rmSync(chrome_data_dir, { recursive: true, force: true });
      fs.cpSync(backupDir, chrome_data_dir, { recursive: true, force: true });
    }
  } catch (cpError) {
    console.error('Warning: Failed to restore browser profile backup:', cpError);
    // We don't throw here so the browser can still attempt to start even if backup fails
  }

  try {
    // console.log('initBrowser');
    const browser = await chromium.launchPersistentContext(chrome_data_dir, {
      channel: 'chrome',
      headless: false,
      screen: { width: 1024, height: 768 },

      // proxy: {
      //   server: 'socks5://192.168.10.24:1080',
      // },
      // 
      // NOTE: take video requires resources
      // 
      // recordVideo: {
      //   dir: '/app/videos/',
      //   size: { width: 1024, height: 768 },
      // },

      // userDataDir: chrome_data_dir,
      ignoreHTTPSErrors: true,

      /** Set browser locale to reduce fingerprinting */
      locale: 'en-US',

      /**
       * Chromium command-line arguments for anti-detection and stability.
       * Disables automation signals, extensions, sync, speech API, translate,
       * and other features that could reveal browser identity or cause issues.
       */
      args: [
        '--lang=en-US',
        //
        '--autoplay-policy=no-user-gesture-required',
        //
        '--disable-background-media-suspend',
        '--disable-background-networking',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-breakpad',
        '--disable-client-side-phishing-detection',
        '--disable-component-update',
        '--disable-default-apps',
        '--disable-domain-reliability',
        '--disable-extensions',
        '--disable-features=DefaultWebAppInstallation',
        '--disable-features=IsolateOrigins,site-per-process',
        '--disable-ipc-flooding-protection',
        '--disable-offer-store-unmasked-wallet-cards',
        '--disable-print-preview',
        '--disable-prompt-on-repost',
        '--disable-setuid-sandbox',
        '--disable-speech-api',
        '--disable-translate',
        '--disable-web-security',
        '--disable-sync',
        "--wm-window-animations-disabled",
        "--animation-duration-scale=0",

        /** Hide automation flags from JavaScript detection */
        '--disable-blink-features=AutomationControlled',

        /** Limit disk and media cache sizes */
        '--disk-cache-size=1m',
        '--media-cache-size=1m',
        //
        '--no-first-run',
        '--no-pings',
        '--no-sandbox',
        //
        '--media-cache-size=0',
        // '--disable-dev-shm-usage',
        '--ignore-certificate-errors-spki-list',
        '--ignore-certificate-errors',
        '--ignore-gpu-blocklist',
        '--ignore-ssl-errors',
        //
        '--password-store=basic',
        '--shm-size=1gb',
        `--window-size=1024,768`,

        /** Spoof a common Chrome user agent on Windows */
        '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36',
        //
        '--disable-features=Translate',
        '--hide-crash-restore-bubble',
        //
        "--simulate-outdated-no-au='Tue, 31 Dec 2099 23:59:59 GMT'",
        //
        '--force-device-scale-factor=1',
      ],
    });

    const page = (await browser.pages())[0];
    await initStealthing(page);

    return browser;
  } catch (error) {
    console.log('error during initBrowser');
    console.log(error);
    throw error;
  }
}

module.exports = { initBrowser, initStealthing };
