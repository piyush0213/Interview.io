const app = require("express")();
const { ENV_VARS } = require("../config/envVar.js");
const socketIO = require("socket.io"); // Import socket.io

function initializeSocket(io) {
  // const io = require("socket.io")(server, {
  //   cors: {
  //     origin: "http://localhost:5173", // Your front-end URL
  //     methods: ["GET", "POST"],
  //     credentials: true,
  //   },
  // });

  const users = {}; // To track users in each room

  io.on("connection", (socket) => {
    // Handling video call signals

    socket.on("join-room", (roomID) => {
      if (!users[roomID]) {
        users[roomID] = new Set();
      }

      users[roomID].add(socket.id);

      const otherUsers = Array.from(users[roomID]).filter(
        (id) => id !== socket.id
      );
      socket.emit("all-users", otherUsers);

      socket.join(roomID);

      socket.emit("your-id", socket.id);

      console.log("User joined room:", roomID);
    });

    socket.on("sending-signal", (payload) => {
      io.to(payload.userToSignal).emit("user-joined", {
        signal: payload.signal,
        callerID: payload.callerID,
      });
    });

    socket.on("returning-signal", (payload) => {
      io.to(payload.callerID).emit("receiving-returned-signal", {
        signal: payload.signal,
        id: socket.id,
      });
    });

    socket.on("disconnect-from-room", (roomID) => {
      if (users[roomID]) {
        users[roomID].delete(socket.id);
        socket.to(roomID).emit("user-disconnected", socket.id);
        console.log("User disconnected from room:", roomID);

        if (users[roomID].size === 0) {
          delete users[roomID];
          console.log("Room deleted:", roomID);
        }
      }
      socket.leave(roomID);
    });

    socket.on("disconnect", () => {
      Object.keys(users).forEach((roomID) => {
        if (users[roomID].has(socket.id)) {
          users[roomID].delete(socket.id);
          socket.to(roomID).emit("user-disconnected", socket.id);
          console.log("User unexpectedly disconnected from room:", roomID);

          if (users[roomID].size === 0) {
            delete users[roomID];
            console.log("Room deleted:", roomID);
          }
        }
      });
    });

    // Handling chat messages
    socket.on("send-chat-message", (message) => {
      const userMessage = { user: socket.id, text: message };
      socket.broadcast.emit("receive-message", userMessage);
    });
  });

  app.use("/api/v1/rooms", require("../routes/rooms.js"));

}

module.exports = { initializeSocket };
