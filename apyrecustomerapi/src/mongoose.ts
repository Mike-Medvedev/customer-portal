import mongoose from "mongoose";

const MONGODB_URI = "mongodb://localhost:27017";

export async function connectToMongoDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Mongoose connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}
