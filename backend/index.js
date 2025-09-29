const express = require("express");
const http = require("http");
const cors = require("cors");

// --- Import Routes (Use 'require' for consistency) ---
const questionsRoute = require("./routes/questions.route");
const authRoute = require("./routes/auth.route");
const quizRoute = require("./routes/quiz.route"); // Assuming this is your main quiz route file

// --- Import Other Modules ---
const connectToMongo = require("./connectDb");
const { initializeSocket } = require("./socket/socket.js");
const { ENV_VARS } = require("./config/envVar.js");
const socketIO = require("socket.io");
const { OpenAI } = require("openai"); // Keeping for context, likely unused in this file

// --- Configuration ---
const PORT = ENV_VARS.PORT || 3000;

const app = express();
const server = http.createServer(app); // Create HTTP server

// Initialize socket.io on the same server
const io = socketIO(server, {
  cors: {
    // Add allowed origin here (e.g., origin: 'http://localhost:5173')
    credentials: true,
  },
  transports: ["websocket"], // Only use WebSockets
});

// Connect to MongoDB
connectToMongo();

// --- Middleware ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    // Add allowed origin here
    credentials: true,
  })
);

// --- API Routes (Using the imported route modules) ---
app.use("/api/v1/questions", questionsRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/quiz", quizRoute); // This uses the 'quizRoute' from the require statement
app.use("/uploads", express.static("uploads"));

// --- Socket.IO Initialization ---
initializeSocket(io);

// Simple root check route
app.get("/", (req, res) => {
  res.send("hello from simple server :)");
});

// --- Start the server ---
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});