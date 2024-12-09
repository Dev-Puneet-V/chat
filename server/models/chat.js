import mongoose, { Schema } from "mongoose";

export const messageSchema = new Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const chatSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["Group", "User"],
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
    },
    messages: [messageSchema],
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;
