const testHelloWorld = async (i) => {
  try {
    const response = await fetch("http://192.168.11.41:3000/helloworld", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hello: "world_" + i }),
      keepalive: true,
    });

    const data = await response.json();

    console.log("Response:", data);
  
  } catch (error) {
    console.error("Error:", error.message);
    
  }
};

for (let i = 0; i < 2; i++) {
  testHelloWorld(i);
}
