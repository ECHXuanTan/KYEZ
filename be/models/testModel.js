import mongoose from "mongoose";

const testSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    question1: { type: String, required: true },
    keywords1: [{ type: String }],
    question2: { type: String, required: true },
    keywords2: [{ type: String }]
  },
  {
    timestamps: true,
  });

const Test = mongoose.model('Test', testSchema);
export default Test;