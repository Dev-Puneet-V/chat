import { Request, Response } from "express";

const createUser = (req: Request, res: Response): void => {
  try {
    const { username, password } = req.body;
    if (!username.trim() || !password.trim()) {
    }
  } catch (error: unknown) {
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

const getUser = (req: Request, res: Response): void => {
    try {
        const { name, password } = req.body;
        if (!name.trim() || !password.trim()) {
        }
    } catch (error: unknown) {
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
