import mongoose from "mongoose";

// This will connect to my database.
export async function connectDB(uri) {
  mongoose.set("strictQuery", true);
  try {
    
    // readonce is the my Database name.
    await mongoose.connect(uri, { dbName: "readonce" });
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
}
