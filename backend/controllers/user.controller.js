import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserModel from "../models/user.model.js";
import dotenv from "dotenv";

dotenv.config();

export const RegisterController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name.trim() || !email.trim() || !password.trim()) {
      return res.status(400).json({ message: "Fill all required fields" });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const isExist = await UserModel.findOne({ email: normalizedEmail });

    if (isExist) {
      return res
        .status(400)
        .json({ message: "This email is already registered" });
    }

    const cleanedPassword = password.trim();

    const hashedPassword = await bcrypt.hash(cleanedPassword, 10);

    const newUser = new UserModel({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    await newUser.save();

    const { password: _, ...userData } = newUser.toObject();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(201)
      .json({ message: "Registered successfully", user: userData });
  } catch (error) {
    console.error("Error in User Register Controller:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const LoginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email.trim() || !password.trim()) {
      return res.status(400).json({ message: "Fill all required fields" });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const isExist = await UserModel.findOne({ email: normalizedEmail });

    if (!isExist) {
      return res.status(404).json({ message: "This email is not registered" });
    }

    const cleanedPassword = password.trim();

    const matchPassword = await bcrypt.compare(
      cleanedPassword,
      isExist.password
    );

    if (!matchPassword) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign(
      {
        id: isExist._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    const { password: _, ...userData } = isExist.toObject();

    return res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(201)
      .json({ message: "Login successfully", user: userData });
  } catch (error) {
    console.log(`Error in User Login Controller: ${error}`);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const LogoutController = async (req, res) => {
  try {
    return res
      .clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      })
      .status(200)
      .json({ message: "Logout successfully" });
  } catch (error) {
    console.log(`Error in User Logout Controller: ${error}`);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
