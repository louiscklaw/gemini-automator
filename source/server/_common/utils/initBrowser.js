const { chromium } = require('playwright'); // Or 'firefox', 'webkit'

const BROWSER_HEADED_MODE = process.env.BROWSER_HEADED_MODE === '0'; // 1 headed mode, 0 headless mode

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

async function initBrowser({ chrome_data_dir }) {
  try {
    // console.log('initBrowser');
    const browser = await chromium.launchPersistentContext(chrome_data_dir, {
      channel: 'chrome',
      headless: false,
      screen: { width: 1920, height: 1080 * 3 },

      // proxy: {
      //   server: 'socks5://192.168.10.24:1080',
      // },
      // recordVideo: {
      //   dir: './videos/',
      //   size: { width: 1920, height: 1080 * 3 },
      // },

      // userDataDir: chrome_data_dir,
      ignoreHTTPSErrors: true,
      //
      locale: 'en-US',
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
        //
        '--disable-blink-features=AutomationControlled',
        //
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
        `--window-size=1920,${1080 * 3}`,
        //
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
