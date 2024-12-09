import Chat from "../models/chat.js";
import Group from "../models/group.js";
import mongoose from "mongoose";
import User from "../models/user.js";
import UserChat from "../models/userChat.js";

const getGroupInfoController = async (req, res) => {
  try {
    const { groupId } = req.params;
    if (!groupId.trim()) {
      throw new Error("Group id cant be empty");
    }
    const chats = await Chat.findOne({
      group: new mongoose.Types.ObjectId(groupId),
      type: "Group",
    })
      .populate("group", "name")
      .populate("messages.owner", "username"); //fetch username from messages.owner
    if (!chats) {
      throw new Error("Group chat not found");
    }
    res.status(200).json({
      success: true,
      data: chats,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        message: error.message || "Error fetching chat info",
      });
    } else {
      res.status(500).json({
        message: "Error fetching chat info",
      });
    }
  }
};

const getChatInfoController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { chatUserId } = req.params;
    if (!chatUserId.trim()) {
      throw new Error("Chat user id cant be empty");
    }
    const userChat = await UserChat.findOne({
      users: {
        $all: [userId, new mongoose.Types.ObjectId(chatUserId)],
      }, // both users must be present
    }).populate("users");
    if (!userChat) {
      return res.status(200).json({
        success: true,
      });
    }
    console.log(userId, chatUserId);
    console.log(userChat);
    console.log("CHECKING", userChat?.users[0]._id + "", userId + "");
    let otherUser = userChat?.users[0];
    if (userChat?.users[0]._id + "" !== userChat?.users[1]._id) {
      otherUser =
        userChat?.users[0]?._id + "" === userId + ""
          ? userChat?.users[1]
          : userChat?.users[0];
    }

    console.log(otherUser);
    res.status(200).json({
      success: true,
      data: {
        group: {
          name: otherUser?.username,
          _id: otherUser?._id,
        },
        messages: userChat?.messages,
        _id: userChat._id,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        message: error.message || "Error fetching chat info",
      });
    } else {
      res.status(500).json({
        message: "Error fetching chat info",
      });
    }
  }
};

const userInitialHandshake = async (req, res) => {
  try {
    const userId = req.user._id;
    const { chatUserId } = req.params;
    if (!chatUserId.trim()) {
      throw new Error("Chat user id cant be empty");
    }
    const chatUser = await User.findById(chatUserId);
    if (!chatUser) {
      throw new Error("No chat user found");
    }
    const userChat = await UserChat.create({
      users: [
        new mongoose.Types.ObjectId(userId),
        new mongoose.Types.ObjectId(chatUserId),
      ],
      messages: [],
    });
    res.status(200).json({
      success: true,
      data: {
        group: {
          name: chatUser?.username,
          _id: chatUser?._id,
        },
        messages: userChat?.messages,
        _id: userChat._id,
      },
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Error making intital handshake",
    });
  }
};

export { getGroupInfoController, getChatInfoController, userInitialHandshake };
