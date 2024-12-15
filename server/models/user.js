import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  joinedGroups: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
    },
  ],
  history: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserChat",
    },
  ],
});

const User = mongoose.model("User", userSchema);

export default User;
