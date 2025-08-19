import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const KEY = Buffer.from(process.env.READONCE_MASTER_KEY, "base64");
if (KEY.length !== 32) {
  console.error("❌ READONCE_MASTER_KEY must decode to 32 bytes.");
  process.exit(1);
}

// Encryption of the message is done here.
export function encrypt(text) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", KEY, iv);
  const ciphertext = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return {
    iv: iv.toString("base64"),
    ciphertext: ciphertext.toString("base64"),
    tag: tag.toString("base64"),
  };
}

// Decryption of the message is done in this.
export function decrypt({ iv, ciphertext, tag }) {
  const ivBuf = Buffer.from(iv, "base64");
  const ctBuf = Buffer.from(ciphertext, "base64");
  const tagBuf = Buffer.from(tag, "base64");
  const decipher = crypto.createDecipheriv("aes-256-gcm", KEY, ivBuf);
  decipher.setAuthTag(tagBuf);
  const plaintext = Buffer.concat([decipher.update(ctBuf), decipher.final()]);
  return plaintext.toString("utf8");
}
