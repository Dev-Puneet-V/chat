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

export { createUser };
