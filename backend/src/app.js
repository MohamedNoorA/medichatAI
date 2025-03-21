// src/app.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const chatRoutes = require("./routes/chatRoutes");

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Initialize Express
const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: "http://192.168.1.6:8081", // Allow requests from your frontend (Expo Go)
  methods: ["GET", "POST"], // Allow specific HTTP methods
  credentials: true, // Allow cookies and credentials
}));

// Middleware
app.use(express.json());

// Routes
app.use("/api", chatRoutes);

// Default Route (Check if the server is running)
app.get("/", (req, res) => {
  res.send("MediChat AI Backend is Running...");
});

// Handle 404 Errors for Undefined Routes
app.use((req, res) => {
  res.status(404).json({ error: "Route Not Found" });
});

// Export the app
module.exports = app;