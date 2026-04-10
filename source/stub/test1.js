/**
 * test1.js
 * Sends POST requests to a hello-world endpoint for basic connectivity testing.
 * Targets port 3000 on the automation server (192.168.11.41).
 */

/**
 * Makes a single POST request to /helloworld with an incremented counter.
 *
 * @param {number} i - Counter appended to the request body for uniqueness.
 */
const testHelloWorld = async i => {
  try {
    const response = await fetch('http://192.168.11.41:3000/helloworld', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hello: 'world_' + i }),
      keepalive: true,
    });

    const data = await response.json();

    console.log('Response:', data);
  } catch (error) {
    console.error('Error:', error.message);
  }
};

// Send two test requests
for (let i = 0; i < 2; i++) {
  testHelloWorld(i);
}
