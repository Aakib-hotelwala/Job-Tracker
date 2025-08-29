import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";

const authMiddleware = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    let decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userData = await UserModel.findById(decoded.id);

    if (!userData) {
      return res.status(401).json({ message: "User not Found" });
    }

    const { password: _, ...user } = userData.toObject();

    req.user = user;

    next();
  } catch (error) {
    console.log(`Authentication Error: ${error}`);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default authMiddleware;
