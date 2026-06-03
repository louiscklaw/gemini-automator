const http = require('http');

/**
 * POC Script: helloworld_post_request.js
 * Objective: Perform a sanity check by sending a POST request to the /ask_gemini endpoint.
 */

const options = {
    hostname: '192.168.11.41',
    port: 3000,
    path: '/ask_gemini',
    method: 'POST',
    headers: {
        // The server uses bodyParser.text(), so we send the payload as text/plain
        'Content-Type': 'text/plain',
    },
};

const payload = {
    thinking_mode: 'gemini-1.5-flash',
    question: 'Hello World! This is a sanity test POST request.',
};

const requestBody = JSON.stringify(payload);

console.log('--- Request Details ---');
console.log(`URL: http://${options.hostname}:${options.port}${options.path}`);
console.log(`Payload: ${requestBody}`);
console.log('-----------------------');

const req = http.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log('--- Response Details ---');
        console.log(`Status Code: ${res.statusCode}`);
        console.log(`Response Body: ${data}`);
        console.log('------------------------');
    });
});

req.on('error', (error) => {
    console.error('Error during request:', error);
});

req.write(requestBody);
req.end();
