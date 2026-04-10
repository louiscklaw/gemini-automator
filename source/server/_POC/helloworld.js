/**
 * helloworld.js (POC)
 * Standalone proof-of-concept script that calls askGemini with a sanity check question.
 * Run directly with Node.js to test the Gemini automation end-to-end.
 */

const { askGemini } = require('./lib/ask_gemini');

const THINKING_MODE_FAST = 'Fast';
const THINKING_MODE_THINKING = 'Thinking';

/**
 * Immediately-invoked async function to run the sanity test.
 */
(async () => {
  try {
    let result = await askGemini(THINKING_MODE_FAST, 'Hi this is a sanity test. can you hear me ?');
    console.log(result);
  } catch (error) {
    console.error(error);
  }
})();
