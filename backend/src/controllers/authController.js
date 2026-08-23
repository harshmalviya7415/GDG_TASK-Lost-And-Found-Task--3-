const User = require("../models/User");
const bcrypt = require("bcryptjs");
const gentoken = require("../config/gen");

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      res.json({ mess: "please fill the fild" });
      return;
    }

    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      res.json({ mess: "user already exists" });
      return;
    }

    const user = new User({ username, email, password });
    await user.save();

    const token = await gentoken(user._id);
    const isProduction = process.env.NODE_ENV === "production" || !!process.env.VERCEL;
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
    });

    res.status(201).json({ message: "Registration successful", user: { id: user._id, username: user.username } });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ error: error.message || "Database connection error" });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.json({ mess: "please fill the fild" });
      return;
    }

    const user = await User.findOne({ username });
    if (!user) {
      res.json({ mess: "user not exixt" });
      return;
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      res.json({ mess: "password not match" });
      return;
    }

    const token = await gentoken(user._id);
    const isProduction = process.env.NODE_ENV === "production" || !!process.env.VERCEL;
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
    });

    res.status(200).json({ message: "Login successful", user: { id: user._id, username: user.username } });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: error.message || "Database connection error" });
  }
};

const logout = async (req, res) => {
  const isProduction = process.env.NODE_ENV === "production" || !!process.env.VERCEL;
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "None" : "Lax",
  });
  res.status(200).json({ message: "Logout successful" });
};

const getMe = async (req, res) => {
  res.status(200).json(req.user);
};

module.exports = { register, login, logout, getMe };
