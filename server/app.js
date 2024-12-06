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
import Chat from "./models/chat.js";
import jwt from "jsonwebtoken";
import { parse } from "cookie";
import mongoose from "mongoose";
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
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("new-message", async (data, callback) => {
    const { message, type, groupId } = data;
    const cookieHeader = socket.handshake.headers.cookie; // Extract cookie header
    if (!cookieHeader) {
      console.log("No cookies found");
      callback({ success: false, message: "Unathorized access" });
    }

    const cookies = parse(cookieHeader); // Parse cookies
    console.log("Parsed cookies:", cookies);

    // Example: Access specific cookie values
    const token = cookies.token; // Replace 'auth_token' with your cookie name
    if (token) {
      console.log("Auth token:", token);
    } else {
      console.log("Auth token not found in cookies.");
    }
    if (!token) {
      callback({ success: false, message: "Unathorized access" });
    }
    if (!token) {
      callback({ success: false, message: "Unathorized access" });
    }
    const decoded = jwt.verify(token, "shhhhh");
    const user = await User.findOne({
      username: decoded.username,
    });
    if (!user) {
      callback({ success: false, message: "Unathorized access" });
    }
    try {
      const chat = await Chat.findOneAndUpdate(
        {
          type: type,
          group: new mongoose.Types.ObjectId(groupId),
        },
        {
          $push: {
            messages: {
              owner: user,
              content: message,
            },
          },
        },
        { new: true }
      ).populate("messages.owner", "username");
      callback({ success: true, data: chat });
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
