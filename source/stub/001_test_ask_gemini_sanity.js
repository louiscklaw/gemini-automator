/**
 * 001_test_ask_gemini_sanity.js
 * Basic sanity test: sends a simple question to Gemini via the server
 * and logs the response. Confirms end-to-end connectivity.
 */

const { THINKING_MODE_FAST } = require('./lib/THINKING_MODES');

(async () => {
  try {
    const payload = {
      thinking_mode: THINKING_MODE_FAST,
      question: 'hi how are you ?',
    };
    console.log(payload);

    const response = await fetch('http://192.168.11.41:3000/ask_gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    });

    const data = await response.json();

    console.log('Response:', data);
  } catch (error) {
    console.error('Error:', error.message);
  }
})();
