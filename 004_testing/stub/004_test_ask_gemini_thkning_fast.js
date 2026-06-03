/**
 * 002_test_ask_gemini_thinking_fast.js
 * Tests Gemini's "Fast" mode with a web search and summarization request.
 * Verifies that the server can handle a more complex, internet-dependent query.
 */

const { THINKING_MODE_FAST } = require('./lib/THINKING_MODES');

(async () => {
  try {
    const payload = {
      thinking_mode: THINKING_MODE_FAST,
      question: 'please search and summarize the `https://news.ycombinator.com/` top 10 of today. answer in cantonese',
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
