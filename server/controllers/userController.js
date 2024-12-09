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
    }).populate('');
    users = users?.map((user, index) => {
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

export { createUser, filterByUserName };
