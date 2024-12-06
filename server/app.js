import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/mongoose.js";
import User from "./models/user.js";
import userRoute from "./routes/userRoute.js";
import authRoute from "./routes/authRoute.js";
import groupRoute from "./routes/groupRoute.js";
import chatRoute from "./routes/chatRoute.js";
import cookieParser from "cookie-parser";
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
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"], // Allow both React development ports
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(cookieParser());
//for json
app.use(express.json({ extended: true }));
//Content-Type: application/x-www-form-urlencoded
app.use(express.urlencoded());

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:5173"], // Same here for Socket.IO
    methods: ["GET", "POST"],
  },
});

// app.use(isLoggedIn);
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
app.use("/api/auth", authRoute);
app.use("/api/group", groupRoute);
app.use("/api/chat", chatRoute);
server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
