import mongoose, { Schema } from "mongoose";

const groupSchema = new Schema({
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
  ],
  name: {
    type: String,
    required: true,
  },
});

//it makes sure that admin+name are unique combinely
groupSchema.index({ admin: 1, name: 1 }, { unique: true });

const Group = mongoose.model("Group", groupSchema);

export default Group;
