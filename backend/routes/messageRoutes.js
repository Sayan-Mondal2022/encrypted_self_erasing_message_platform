import express from "express";
import { Message } from "../models/message.js";
import { User } from "../models/user.js";
import { encrypt, decrypt } from "../utils/crypto.js";

const router = express.Router();

// ---------------- SEND MESSAGE ----------------
router.post("/send", async (req, res) => {
  try {
    const { senderId, receiverId, text } = req.body || {};
    if (!senderId || !receiverId || typeof text !== "string" || !text.trim()) {
      return res.status(400).json({ error: "senderId, receiverId, and text required" });
    }

    const [sender, receiver] = await Promise.all([
      User.findById(senderId).lean(),
      User.findById(receiverId).lean(),
    ]);
    if (!sender || !receiver) {
      return res.status(404).json({ error: "sender or receiver not found" });
    }

    const blob = encrypt(text.trim());

    const doc = {
      senderId,
      receiverId,
      ...blob,
      ...(process.env.TTL_SECONDS
        ? {
            expiresAt: new Date(Date.now() + Number(process.env.TTL_SECONDS) * 1000),
          }
        : {}),
    };

    const saved = await Message.create(doc);
    res.status(201).json({ id: saved._id.toString() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to send message" });
  }
});

// ---------------- HISTORY ROUTE ----------------
// Get all messages between two users (for loading DM history)
router.get("/history", async (req, res) => {
  try {
    const { user1, user2 } = req.query || {};
    if (!user1 || !user2) {
      return res.status(400).json({ error: "user1 and user2 required" });
    }

    const msgs = await Message.find({
      $or: [
        { senderId: user1, receiverId: user2 },
        { senderId: user2, receiverId: user1 },
      ],
    }).sort({ createdAt: 1 }).lean();

    // Decrypt messages before sending
    const decrypted = msgs.map((m) => {
      let text;
      try {
        text = decrypt(m);
      } catch {
        text = "[decryption failed]";
      }
      return {
        _id: m._id,
        senderId: m.senderId,
        receiverId: m.receiverId,
        text,
        createdAt: m.createdAt,
      };
    });

    res.json({ messages: decrypted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to load history" });
  }
});

// ---------------- RECEIVE ROUTE ----------------
// Fetch unseen messages from one sender -> receiver
router.get("/receive", async (req, res) => {
  try {
    const { receiverId, senderId } = req.query || {};
    if (!receiverId || !senderId) {
      return res.status(400).json({ error: "receiverId and senderId required" });
    }

    const msgs = await Message.find({ receiverId, senderId })
      .sort({ createdAt: 1 })
      .lean();

    if (!msgs.length) {
      return res.json({ messages: [] });
    }

    const decrypted = msgs.map((m) => {
      let text;
      try {
        text = decrypt(m);
      } catch {
        text = "[decryption failed]";
      }
      return {
        _id: m._id,
        senderId: m.senderId,
        receiverId: m.receiverId,
        text,
        createdAt: m.createdAt,
      };
    });

    res.json({ messages: decrypted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to receive messages" });
  }
});

// ---------------- DELETE ROUTE ----------------
// Delete a specific message by ID
router.post("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Message.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "message not found" });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to delete message" });
  }
});

// ---------------- ENCRYPTED DEBUG ROUTE ----------------
router.get("/:id/encrypted", async (req, res) => {
  try {
    const msg = await Message.findById(req.params.id, {
      iv: 1,
      ciphertext: 1,
      tag: 1,
      senderId: 1,
      receiverId: 1,
      createdAt: 1,
    }).lean();
    if (!msg) return res.status(404).json({ error: "not found" });
    res.json({
      encrypted: { iv: msg.iv, ciphertext: msg.ciphertext, tag: msg.tag },
      meta: {
        senderId: msg.senderId,
        receiverId: msg.receiverId,
        createdAt: msg.createdAt,
      },
    });
  } catch {
    res.status(500).json({ error: "failed to fetch encrypted message" });
  }
});

export default router;
