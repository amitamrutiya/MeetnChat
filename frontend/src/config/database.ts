import mongoose from "mongoose";

type ConnectioObject = {
  isConnected?: number;
};

const connection: ConnectioObject = {};

const connectDB = async () => {
  if (connection.isConnected) {
    console.log("Using existing connection");
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGO_DB_URI || "", {});
    connection.isConnected = db.connections[0].readyState;
    console.log("\n MongoDB connected");
  } catch (error) {
    console.log("MongoDB connection FAILED", error);
    process.exit(1);
  }
};

export default connectDB;
