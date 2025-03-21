// src/utils/server.js
// Load dotenv directly here to debug
require('dotenv').config();
console.log("API Key:", process.env.GEMINI_API_KEY); // This will show if the key is loaded

const app = require("../app"); 

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});