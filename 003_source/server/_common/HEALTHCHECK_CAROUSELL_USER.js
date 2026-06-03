/**
 * HEALTHCHECK_CAROUSELL_USER.js
 *
 * Maps Carousell usernames to healthcheck ping URLs.
 * When the automation detects a spotlighted post by a listed username,
 * it pings the corresponding URL to record the match.
 *
 * Dashboard: http://192.168.10.61:8097/projects/dc055375-6ec2-4e28-9109-09b22a2eee7d/checks/
 */

/** Username → healthcheck URL mapping */
const HEALTHCHECK_CAROUSELL_USER = {};

exports.HEALTHCHECK_CAROUSELL_USER = HEALTHCHECK_CAROUSELL_USER;
