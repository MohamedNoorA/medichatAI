// src/services/geminiService.js
const axios = require("axios");

// Load API key from environment variables
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error("❌ ERROR: Missing GEMINI_API_KEY in .env file");
  process.exit(1);
}

/**
 * Function to generate AI response using Google's Gemini API.
 * @param {string} message - User input message.
 * @returns {Promise<string>} AI-generated reply.
 */
const generateResponse = async (message) => {
  try {
    // Updated to use the model that works with your API key
    const apiUrl = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent";
    
    const response = await axios({
      method: 'post',
      url: apiUrl,
      params: { key: GEMINI_API_KEY },
      headers: { 'Content-Type': 'application/json' },
      data: {
        contents: [
          {
            parts: [{ text: message }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800
        }
      }
    });
    
    // Extract AI response
    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("❌ Error fetching AI response:", error.message);
    
    if (error.response) {
      console.error("Error response data:", JSON.stringify(error.response.data));
    }
    
    throw new Error("AI service is unavailable: " + (error.response?.data?.error?.message || error.message));
  }
};

module.exports = { generateResponse };