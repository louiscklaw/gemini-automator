const http = require('http');

async function test() {
  const response = await new Promise((resolve, reject) => {
    const req = http.get('http://192.168.11.41:3000/thinking_mode', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
  });

  if (response.status !== 200) {
    console.error(`FAIL: Expected status 200, got ${response.status}`);
    process.exit(1);
  }

  const modes = JSON.parse(response.body);
  if (!Array.isArray(modes) || modes.length !== 2 || modes[0] !== 'Fast' || modes[1] !== 'Thinking') {
    console.error(`FAIL: Expected ["Fast", "Thinking"], got ${response.body}`);
    process.exit(1);
  }

  console.log('PASS: /thinking_mode returns ["Fast", "Thinking"]');
  process.exit(0);
}

test();