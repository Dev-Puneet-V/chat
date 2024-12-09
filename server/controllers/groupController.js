import Chat from "../models/chat.js";
import Group from "../models/group.js";
import User from "../models/user.js";
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
    const groups = await Group.aggregate([
      {
        $match: {
          name: { $regex: grpName, $options: "i" },
        },
      },
      {
        $addFields: {
          isMember: {
            $in: [req.user._id, "$members"], // Check if userId exists in the members array
          },
        },
      },
    ]);
    res.status(200).json({
      success: true,
      data: groups,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Error fetching group",
    });
  }
};

const joinGroupController = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { groupId } = req.params;
    const user = req.user;

    // Update group to add the user as a member
    const updatedGroup = await Group.findByIdAndUpdate(
      groupId, // Fixed to use proper arguments
      {
        //add to set helps to avoid duplicasy
        $addToSet: { members: new mongoose.Types.ObjectId(user._id) },
      },
      { session, new: true } // Returns the updated document
    );

    if (!updatedGroup) {
      throw new Error("Group not found or update failed");
    }

    // Update user to add the group to joinedGroups
    const updatedUser = await User.findByIdAndUpdate(
      user._id, // Fixed to use proper arguments
      {
        $addToSet: { joinedGroups: new mongoose.Types.ObjectId(groupId) },
      },
      { session, new: true } // Returns the updated document
    );

    if (!updatedUser) {
      throw new Error("User not found or update failed");
    }

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    // Send success response
    res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error("Error during transaction:", error.message);

    // Roll back the transaction
    await session.abortTransaction();
    session.endSession();

    // Send error response with meaningful information
    res.status(500).json({
      success: false,
      message: error.message || "Error joining group",
    });
  }
};

export { createGroupController, filterByNames, joinGroupController };
