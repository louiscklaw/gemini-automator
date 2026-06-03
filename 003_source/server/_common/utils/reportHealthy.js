/**
 * reportHealthy.js
 * Utility to ping healthcheck URLs after successful login or browsing activity.
 * Used to signal liveness to external monitoring systems.
 */

/**
 * Sends a GET request to the specified healthcheck URL.
 * Runs fire-and-forget (non-blocking) to avoid delaying main operations.
 *
 * @param {string} url - The healthcheck ping URL to request.
 * @param {string} [comment=''] - Optional label for logging/debugging.
 */
function reportHealthy(url, comment = '') {
  console.log('report healthy here,' + comment);

  try {
    fetch(url).then(() => {
      // console.debug('report healthy done');
      // Request completed silently
    });
  } catch (error) {
    console.debug(error);
  }
}

module.exports = { reportHealthy };
