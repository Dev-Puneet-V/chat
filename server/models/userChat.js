import mongoose, { Schema } from "mongoose";
import { messageSchema } from "./chat.js";

const userChatSchema = new Schema({
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  messages: [messageSchema],
});

// Ensure that a chat is unique for any two users, regardless of order
userChatSchema.index(
  { users: 1 }, //creates index
  {
    unique: true,
    partialFilterExpression: { users: { $size: 2 } }, // Ensure only 2-user chats are unique
  }
);

const UserChat = mongoose.model("UserChat", userChatSchema);

export default UserChat;
