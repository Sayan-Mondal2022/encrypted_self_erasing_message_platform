import express from "express";
import bcrypt from "bcrypt";
import { User } from "../models/user.js";

const router = express.Router();

// Register user 
router.post("/register", async (req, res) => {
  try {
    const { name, username, password } = req.body || {};

    if (!name || !username || !password) {
      return res.status(400).json({ error: "name, username, and password are required" });
    }

    // check if user exists
    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(409).json({ error: "username already exists" });
    }

    // hash password
    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({ name, username, password: hashed });

    res.status(201).json({
      message: "User registered successfully",
      user: { id: user._id, name: user.name, username: user.username }
    });
  } catch (err) {
    res.status(500).json({ error: "failed to register user" });
  }
});

// Login user.
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body || {};

    if (!username || !password) {
      return res.status(400).json({ error: "username and password required" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "invalid username or password" });
    }

    // For demo → just return user (future: issue JWT)
    res.json({
      message: "Login successful",
      user: { id: user._id, name: user.name, username: user.username }
    });
  } catch (err) {
    res.status(500).json({ error: "failed to login" });
  }
});

// Get all users 
router.get("/", async (_req, res) => {
  const users = await User.find({}, { username: 1, name: 1 }).lean();
  res.json({ users });
});

export default router;