import Chat from "../models/chat.js";
import Group from "../models/group.js";
import mongoose from "mongoose";
const createGroupController = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const user = req.user;
    const { name } = req.body;
    if (!name?.trim()) {
      throw new Error("Group name cannot be empty");
    }
    const newGroup = await Group.create(
      [
        {
          admin: user._id,
          members: [user._id],
          name,
        },
      ],
      { session }
    );
    await Chat.create(
      [
        {
          type: "Group",
          group: new mongoose.Types.ObjectId(newGroup[0]._id),
          messages: [],
        },
      ],
      { session }
    );
    await session.commitTransaction();
    session.endSession();
    if (!newGroup) {
      throw new Error("Group name must be unique");
    }
    res.status(200).json({
      success: true,
      data: newGroup,
    });
  } catch (error) {
    console.log(error);
    await session.abortTransaction();
    session.endSession();
    if (error instanceof Error) {
      res.status(500).json({
        message: "Group name must be unique",
      });
    } else {
      res.status(500).json({
        message: "Group name must be unique",
      });
    }
  }
};

const filterByNames = async (req, res) => {
  try {
    const { grpName } = req.query;
    const groups = await Group.find({
      name: { $regex: grpName, $options: "i" },
    });
    res.status(200).json({
      success: true,
      data: groups,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching group",
    });
  }
};

export { createGroupController, filterByNames };
