import mongoose from "mongoose";

const { TTL_SECONDS } = process.env;

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    iv: { type: String, required: true },
    ciphertext: { type: String, required: true },
    tag: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, index: true },
    expiresAt: { type: Date, default: null },
  },
  { collection: "messages" }
);

// Indexes for efficiency
messageSchema.index({ receiverId: 1, createdAt: 1 });

// Optional TTL for auto-expiry
if (TTL_SECONDS && Number(TTL_SECONDS) > 0) {
  messageSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
}

export const Message = mongoose.model("Message", messageSchema);