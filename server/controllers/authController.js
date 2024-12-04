import User from "../models/user.js";
import jwt from "jsonwebtoken";

const loginController = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username.trim() || !password.trim()) {
      throw new Error("Username and password cant be empty");
    }
    const user = await User.findOne({
      username: username,
      password: password,
    });
    if (!user) {
      throw new Error("Incorrect username or password");
    }
    var token = jwt.sign(
      { username: username, currTime: new Date() },
      "shhhhh"
    );
    res.cookie("token", token, {
      httpOnly: true, // Accessible only by the server
      // secure: true, // Send only over HTTPS
      // sameSite: "Strict", // Prevent cross-site usage
      maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
    });
    res.status(200).json({
      success: true,
      message: "Successfully signed in",
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        message: error.message,
      });
    } else {
      res.status(500).json({
        message: error.message || "An unknown error occurred",
      });
    }
  }
};

const logoutController = async (req, res) => {
  try {
    res.clearCookie();
    res.status(200).json({
      success: true,
      message: "Successfully logges out",
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        message: error.message,
      });
    } else {
      res.status(500).json({
        message: error.message || "An unknown error while loggin out",
      });
    }
  }
};

export { loginController, logoutController };
