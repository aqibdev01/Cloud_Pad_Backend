import mongoose from "mongoose";
const { Schema } = mongoose;

const NotesSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    unique: true,
  },
  tag: {
    type: String,
    default: "General"
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export const Notes = mongoose.model('notes', NotesSchema)