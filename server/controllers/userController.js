import { Request, Response } from "express";

const createUser = (req, res)=> {
  try {
    const { username, password } = req.body;
    if (!username.trim() || !password.trim()) {
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
};

const getUser = (req, res) => {
    try {
        const { name, password } = req.body;
        if (!name.trim() || !password.trim()) {
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

export { createUser, getUser }
