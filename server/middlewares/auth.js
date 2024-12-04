import User from "../models/user.js";

const isLoggedIn = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      throw new Error("User not authorized");
    }
    const decoded = jwt.verify(token, "shhhhh");
    const user = User.findOne({
      username: decoded.username,
    });
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
