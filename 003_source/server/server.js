const express = require('express');
const app = express();
var bodyParser = require('body-parser');
const { askGemini } = require('./lib/ask_gemini');
const { THINKING_MODE_FAST, THINKING_MODE_THINKING } = require('./lib/THINKING_MODES');

/**
 * Request queue ensures serialized processing of Gemini queries.
 * Each incoming request is appended to the queue via `queue = queue.then(...)`.
 * This prevents concurrent browser sessions from conflicting.
 */
let queue = Promise.resolve();

/**
 * Middleware to parse incoming requests as raw text.
 * Required because client sends JSON body as string.
 */
app.use(
  bodyParser.text({
    type: function (req) {
      return 'text';
    },
  }),
);

/**
 * GET /thinking_mode
 * Returns available thinking mode options for client reference.
 */
app.get('/thinking_mode', (req, res) => {
  res.send([THINKING_MODE_FAST, THINKING_MODE_THINKING]);
});

/**
 * POST /ask_gemini
 * Accepts JSON body with `thinking_mode` and `question` fields.
 * Queues the request and delegates to askGemini() for browser automation.
 * Responds with result or error after completion.
 */
app.post('/ask_gemini', (req, res) => {
  console.log('Request received...');

  queue = queue.then(async () => {
    try {
      let { thinking_mode, question } = JSON.parse(req.body);
      let result = await askGemini(thinking_mode, question);
      res.status(200).json({ message: 'done: ', result });
    } catch (err) {
      res.status(500).json({ error: 'error: ' + err.message });
    }
  });
});

app.get('/hi', (req, res) => {
  res.send('Hello! The server is running and healthy. 👋');
});


/**
 * Placeholder for long-running background tasks (unused).
 */
async function longProcessingTask(data) {
  return new Promise(resolve => setTimeout(resolve, 15 * 1000));
}

app.listen(3000, () => console.log('Server running on 3000'));
