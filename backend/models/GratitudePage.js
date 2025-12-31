import mongoose from "mongoose";
import { nanoid } from "nanoid";

const gratitudePageSchema = new mongoose.Schema({
  pageId: {
    type: String,
    required: true,
    unique: true,
    default: () => nanoid(10), // Generates a URL-friendly unique ID
  },
  creatorName: {
    type: String,
    trim: true,
    default: "Someone Special",
  },
  lovedOneName: {
    type: String,
    required: [true, "Please enter the name of your loved one"],
    trim: true,
  },
  nickname: {
    type: String,
    trim: true,
  },
  message: {
    type: String,
    required: [true, "Please write a gratitude message"],
  },
  wishes: {
    type: String,
    default: "",
  },
  photos: [
    {
      type: String, // URLs from Cloudinary
    },
  ],
  theme: {
    type: String,
    default: "default", // For future theming
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400, // 24 hours in seconds
  },
});

const GratitudePage = mongoose.model("GratitudePage", gratitudePageSchema);

export default GratitudePage;
