import User from "../models/user.js";
import jwt from "jsonwebtoken";
const isLoggedIn = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    console.log(req.cookies);
    if (!token) {
      throw new Error("User not authorized");
    }
    const decoded = jwt.verify(token, "shhhhh");
    const user = await User.findOne({
      username: decoded.username,
    });
    console.log("user", user, decoded);
    if (!user) {
      throw new Error("User not authorized");
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message || "User not authorized",
    });
  }
};

export { isLoggedIn };
