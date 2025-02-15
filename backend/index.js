const express = require("express");
const http = require("http");
const cors = require("cors");
const questionsRoute = require("./routes/questions.route");
const authRoute = require("./routes/auth.route");
const quizRoute = require("./routes/quiz.route");
const connectToMongo = require("./connectDb");
const { initializeSocket } = require("./socket/socket.js");
const { ENV_VARS } = require("./config/envVar.js");
const PORT = ENV_VARS.PORT || 3000; // Default port to 3000 if ENV_VAR is not set
const { OpenAI } = require("openai");

const app = express();
const server = http.createServer(app); // Create HTTP server
const socketIO = require("socket.io"); // Import socket.io

// Initialize socket.io on the same server
const io = socketIO(server, {
  cors: {

    credentials: true,
  },
  transports: ["websocket"], // Only use WebSockets
});

connectToMongo();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({

    credentials: true,
  })
);

app.use("/api/v1/questions", questionsRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/quiz", quizRoute);
app.use("/uploads", express.static("uploads"));

initializeSocket(io);

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("hello from simple server :)");
});


