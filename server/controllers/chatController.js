import Chat from "../models/chat.js";
import mongoose from "mongoose";
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

export { getGroupInfoController };
