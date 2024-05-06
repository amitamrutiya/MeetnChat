import mongoose from "mongoose";

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  try {
    await mongoose.connect(process.env.MONGO_DB_URI ?? "");
    console.log("\n MongoDB connected");
  } catch (error) {
    console.log("MongoDB connection FAILED", error);
    process.exit(1);
  }
};

export default connectDB;
