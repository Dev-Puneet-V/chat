import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
const app = express();
const server = http.createServer(app);
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"], // Allow both React development ports
    methods: ["GET", "POST"],
  })
);


const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:5173"], // Same here for Socket.IO
    methods: ["GET", "POST"],
  },
});
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});


io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
