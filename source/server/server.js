const express = require('express');
const app = express();
var bodyParser = require('body-parser');
const { askGemini } = require('./lib/ask_gemini');
const { THINKING_MODE_FAST, THINKING_MODE_THINKING } = require('./lib/THINKING_MODES');

// initialize a promise at the very beginning
// `queue = queue.then(...)`
let queue = Promise.resolve();

app.use(
  bodyParser.text({
    type: function (req) {
      return 'text';
    },
  }),
);

app.get('/thinking_mode', (req, res) => {
  res.send([THINKING_MODE_FAST, THINKING_MODE_THINKING]);
});

app.post('/ask_gemini', (req, res) => {
  console.log('Request received...');

  // extend the queue at the end of current queue
  // queue = queue.then(...).then(...).then(...)....
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

async function longProcessingTask(data) {
  return new Promise(resolve => setTimeout(resolve, 15 * 1000));
}

app.listen(3000, () => console.log('Server running on 3000'));
