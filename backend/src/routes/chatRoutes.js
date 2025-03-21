// src/routes/chatRoutes.js
const express = require("express");
const chatController = require("../controllers/chatController");

const router = express.Router();

// POST /api/chat (Chat with AI)
router.post("/chat", chatController.sendMessage);

module.exports = router;