import User from "../models/user.js";

const createUser = async (req, res) => {
  try {
    console.log("create user");
    const { username, password } = req.body;
    if (username.trim() && password.trim()) {
      const user = await User.create({
        username: username,
        password: password,
      });
      console.log(user);
      res.status(200).json({
        success: true,
        message: "User successfully created",
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        message: error.message,
      });
    } else {
      res.status(500).json({
        message: "An unknown error occurred",
      });
    }
  }
};

const filterByUserName = async (req, res) => {
  try {
    const { userName } = req.query;
    let users = await User.find({
      username: { $regex: userName, $options: "i" },
    }).populate("");
    users = users
      ?.filter((user) => {
        if (user._id + "" !== req.user._id + "") {
          return true;
        }
        return false;
      })
      .map((user, index) => {
        return {
          _id: user._id,
          isMember: true,
          name: user.username,
        };
      });
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        message: error.message,
      });
    } else {
      res.status(500).json({
        message: "Error fetching user",
      });
    }
  }
};

const getUserHistory = async (req, res) => {
  try {
    const user = req.user;
    const groupData = await User.findById(user._id)
      .populate("joinedGroups")
      .populate({
        path: "history",
        select: "users",
        populate: {
          path: "users",
          match: { _id: { $ne: req.user._id } },
          select: "username _id",
        },
      });
    const data = {};
    data["group"] = groupData?.joinedGroups?.map((currGrp) => {
      //LEARNT SOMETHING NEW
      const groupObject = currGrp.toObject();
      return {
        ...groupObject,
        isMember: true,
      };
    });
    data["user"] = groupData?.history?.map((currUser) => {
      const groupObject = currUser.toObject();
      return {
        name: groupObject.users[0].username,
        _id: groupObject.users[0]._id,
        isMember: true,
      };
      return currUser;
    });
    res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        message: error.message,
      });
    } else {
      res.status(500).json({
        message: "Error fetching user",
      });
    }
  }
};

export { createUser, filterByUserName, getUserHistory };
