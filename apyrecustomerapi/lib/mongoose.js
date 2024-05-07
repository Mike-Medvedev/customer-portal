"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToMongoDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const MONGODB_URI = "mongodb://localhost:27017";
async function connectToMongoDB() {
    try {
        await mongoose_1.default.connect(MONGODB_URI);
        console.log("Mongoose connected to MongoDB");
    }
    catch (error) {
        console.error("MongoDB connection error:", error);
    }
}
exports.connectToMongoDB = connectToMongoDB;
