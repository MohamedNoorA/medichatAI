// src/controllers/chatController.js
const geminiService = require('../services/geminiService');

const sendMessage = async (req, res) => {
  const { message } = req.body;

  console.log("Received message:", message);

  if (!message) {
    console.log("Missing message in request");
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    console.log("Calling Gemini service");
    const reply = await geminiService.generateResponse(message);
    console.log("Received reply from Gemini", reply.substring(0, 50) + "...");
    res.json({ reply });
  } catch (error) {
    console.error('Error in controller:', error.message);
    res.status(500).json({ 
      error: 'Failed to get response from Gemini API',
      details: error.message 
    });
  }
};

module.exports = { sendMessage };