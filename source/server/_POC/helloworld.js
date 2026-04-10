const { askGemini } = require('./lib/ask_gemini');

const THINKING_MODE_FAST = 'Fast';
const THINKING_MODE_THINKING = 'Thinking';

(async () => {
  try {
    let result = await askGemini(THINKING_MODE_FAST, 'Hi this is a sanity test. can you hear me ?');
    console.log(result);
  } catch (error) {
    console.error(error);
  }
})();
