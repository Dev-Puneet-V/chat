import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/mongoose.js";
import User from "./models/user.js";
import userRoute from "./routes/userRoute.js";
dotenv.config({
  path: "./.env",
});
const app = express();
const server = http.createServer(app);
connectDB()
  .then()
  .catch((err) => {
    console.log("Mongodb connection error ", err);
  });

//for json
app.use(express.json({ extended: true }));
//Content-Type: application/x-www-form-urlencoded
app.use(express.urlencoded());

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

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("create-user", async (data, callback) => {
    const { username, password } = data;

    try {
      const user = await User.create({
        username: username,
        password: password,
      });
      console.log(user);
      callback({ success: true });
    } catch (error) {
      // Send error response
      callback({ success: false, message: error.message });
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

app.use("/api/user", userRoute);

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
