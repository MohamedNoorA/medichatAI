// testGeminiApi.js
const axios = require('axios');
require('dotenv').config();

async function testGeminiApi() {
  const apiKey = process.env.GEMINI_API_KEY;
  console.log("Testing with API key ending in:", apiKey.slice(-5));
  
  const models = [
    "gemini-pro",
    "gemini-1.0-pro",
    "gemini-1.5-pro"
  ];
  
  for (const model of models) {
    try {
      console.log(`\nTesting model: ${model}`);
      const apiUrl = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent`;
      
      const response = await axios({
        method: 'post',
        url: apiUrl,
        params: { key: apiKey },
        headers: { 'Content-Type': 'application/json' },
        data: {
          contents: [
            {
              parts: [{ text: "Hello, what's your name?" }]
            }
          ]
        }
      });
      
      console.log("✅ SUCCESS for model:", model);
      console.log("Status:", response.status);
      return {
        success: true,
        model: model,
        response: response.data
      };
    } catch (error) {
      console.log(`❌ FAILED for model: ${model}`);
      console.log("Error:", error.message);
      if (error.response) {
        console.log("Status:", error.response.status);
        console.log("Data:", JSON.stringify(error.response.data));
      }
    }
  }
  
  return {
    success: false,
    message: "All models failed"
  };
}

// Run the test
testGeminiApi()
  .then(result => {
    if (result.success) {
      console.log("\n✅ API TEST SUCCESSFUL");
      console.log("Working model:", result.model);
      
      // Update the geminiService.js file with the correct model
      console.log(`\nPlease update your geminiService.js to use model: ${result.model}`);
    } else {
      console.log("\n❌ API TEST FAILED");
      console.log("All models failed. Please check your API key and permissions.");
    }
  })
  .catch(err => {
    console.error("Test failed with error:", err);
  });