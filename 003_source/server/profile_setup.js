/**
 * profile_setup.js
 *
 * Configuration for Chrome browser profiles used by the Gemini automation.
 * Each profile specifies login states, proxy settings, and healthcheck URLs.
 * Designed to be loaded by both the server and standalone test scripts.
 */

/** Default SOCKS5 proxy server used as fallback */
const socks_server_2 = 'socks5://go-socks5-proxy-2:1080';

/** Base directory for browser profiles */
const BROWSER_DATA_BASE_DIR = process.env.BROWSER_DATA_DIR || '/browser_data_dir';

/** Map of named browser profiles with their respective configurations */
const profile_setup = {
  testhelloworld04_tvbhk: {
    /** Whether this profile has an active JobsDB login (not currently used) */
    jobsdb_login: false,

    /** Whether this profile has an active Gemini account login */
    gemini_login: true,

    /** Path to the persistent Chrome user data directory */
    chrome_data_dir: `${BROWSER_DATA_BASE_DIR}/testhelloworld04_tvbhk`,

    /**
     * Healthcheck URL — pinged to report the account session is healthy.
     * Validates that login state is maintained after browser launch.
     */
    REPORT_HEALTHY_URL: 'https://healthcheck.iamon99.com/ping/f58a5012-a319-4b6f-a337-991bf709a02d',

    /**
     * Burn URL healthcheck — pinged after clicking through burn URLs
     * to confirm browsing activity was registered.
     */
    CLICK_BURN_HEALTHY_URL: 'https://healthcheck.iamon99.com/ping/73bee4f0-fb9d-45b1-825e-5974c2df67ff1',

    /** SOCKS5 proxy endpoint for routing browser traffic */
    proxy: 'socks5://192.168.10.24:1080',
  },
};

exports.profile_setup = profile_setup;
