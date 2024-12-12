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
import UserChat from "./models/userChat.js";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log("DIRNAME", __dirname);
dotenv.config({
  path: "./.env",
});
const app = express();
const server = http.createServer(app);

app.use(express.static(path.join(__dirname, "./dist")));

// Handle React routing, return all requests to index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./dist/index.html"));
});

connectDB()
  .then()
  .catch((err) => {
    console.log("Mongodb connection error ", err);
  });
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://chat-three-kohl.vercel.app",
      "https://chat-k7m6.onrender.com",
    ], // Allow both React development ports
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
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://chat-three-kohl.vercel.app",
      "https://chat-k7m6.onrender.com",
    ], // Same here for Socket.IO
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");
  socket.on("initialize-user", async (data, callback) => {
    const cookieHeader = socket.handshake.headers.cookie;
    if (!cookieHeader) {
      console.log("No cookies found");
      return;
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
      // callback({ success: false, message: "Unathorized access" });
      return;
    }
    if (!token) {
      return;
      // callback({ success: false, message: "Unathorized access" });
    }
    const decoded = jwt.verify(token, "shhhhh");
    const user = await User.findOne({
      username: decoded.username,
    });
    if (!user) {
      return;
      // callback({ success: false, message: "Unauthorized access" });
    }
    user?.joinedGroups?.map((currGrp) => {
      socket.join(currGrp + "");
      console.log("Joined grp", currGrp + "");
    });
    return;
    // callback({ success: true, message: user?._id + " joined all rooms" });
  });

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
      if (type === "Group") {
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
        try {
          const isInRoom = io.sockets.rooms.has(groupId);
          console.log("IN IN ROOM", isInRoom, groupId);
          console.log(io.sockets.adapter.rooms);
          console.log("LOGO", {
            chat: chat,
            groupId: groupId,
            user: decoded.username,
          });
          io.sockets.in(groupId).emit(
            "new-message-group",
            {
              chat: chat,
              groupId: groupId,
              user: decoded.username,
            },
            (acknowledgment) => {
              console.log(`Acknowledgment from client: ${acknowledgment}`);
            }
          );
        } catch (err) {
          console.error("Error emitting message:", err);
        }

        callback({ success: true, data: chat });
      } else {
        let secondUserId = groupId;
        console.log("HUIO", user._id + "-" + secondUserId);
        const chat = await UserChat.findOneAndUpdate(
          {
            users: {
              $all: [user._id, new mongoose.Types.ObjectId(secondUserId)],
            },
          },
          {
            $push: {
              messages: {
                owner: user, // The actual message content
                content: message,
              },
            },
          },
          {
            new: true, // Return the updated document
          }
        ).populate("messages.owner", "username");
        try {
          console.log(
            io.sockets.adapter.rooms,
            (user._id + "").localeCompare(secondUserId + "")
          );
          const roomId =
            (user._id + "").localeCompare(secondUserId + "") === -1
              ? user._id + "-" + secondUserId
              : secondUserId + "-" + user._id;
          console.log("ROOMID", roomId);
          io.sockets.in(roomId).emit("new-message-group", {
            chat: chat,
            // groupId:
            //   (user._id + "").localeCompare(secondUserId + "") === -1
            //     ? user._id + ""
            //     : secondUserId + "",
            user1Id: user._id + "",
            user2Id: secondUserId + "",
            user: decoded.username,
          });
          callback({ success: true, data: chat });
        } catch (err) {
          console.error("Error emitting message:", err);
          callback({ success: false });
        }
      }
    } catch (error) {
      // Send error response
      callback({ success: false, message: error.message });
    }
  });

  socket.on("join-one-to-one", async (data, cal) => {
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

    const { selectedUserId } = data;
    console.log("HUIO", user._id + "-" + selectedUserId);
    socket.join(
      (user._id + "").localeCompare(selectedUserId + "") === -1
        ? user._id + "-" + selectedUserId
        : selectedUserId + "-" + user._id
    );
  });
  socket.on("leave-one-to-one", async (data) => {
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
    const { selectedUserId } = data;
    socket.leave(
      user._id + "" < selectedUserId + "" ? user._id + "" : selectedUserId + ""
    );
  });
  socket.on("typing", async (data, callback) => {
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

    let { groupId, type } = data;
    if (type === "user") {
      groupId =
        (user._id + "").localeCompare(groupId + "") === -1
          ? user._id + "-" + groupId
          : groupId + "-" + user._id;
    }
    io.sockets.in(groupId).emit("is-typing", { user: user.username });
  });
  socket.on("stop-typing", async (data, callback) => {
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
    let { groupId, type } = data;
    if (type === "user") {
      groupId =
        (user._id + "").localeCompare(groupId + "") === -1
          ? user._id + "-" + groupId
          : groupId + "-" + user._id;
    }
    io.sockets.in(groupId).emit("stopped-typing");
  });
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// import Group from "./models/group.js";
// try {
//   let userId = "67551190835115383fdf8344";
//   let groupId = "6752aca4fc07fb661927ed2b";
//   User.findByIdAndUpdate(
//     new mongoose.Types.ObjectId(userId),
//     { $push: { joinedGroups: new mongoose.Types.ObjectId(groupId) } },
//     { new: true }
//   )
//     .then((user) => {
//       console.log("User updated:", user);
//       return Group.findByIdAndUpdate(
//         new mongoose.Types.ObjectId(groupId),
//         { $push: { members: new mongoose.Types.ObjectId(userId) } },
//         { new: true }
//       );
//     })
//     .then((group) => {
//       console.log("Group updated:", group);
//     })
//     .catch((error) => {
//       console.error("Error:", error.message);
//     });
// } catch (error) {
//   console.log(error.message);
// }
app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/group", groupRoute);
app.use("/api/chat", chatRoute);
server.listen(process.env.PORT || 3000, () => {
  console.log("Server running on http://localhost:3000");
});
