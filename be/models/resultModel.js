import mongoose from "mongoose";

const resultSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    testName: { type: String, required: true },
    question1: { type: String, required: true },
    keywords1: [{ type: String }],
    answer1: [{ type: Array }],
    audioURL1: [{ type: String }],
    question2: { type: String, required: true },
    keywords2: [{ type: String }],
    answer2: [{ type: Array }],
    audioURL2: [{ type: String }],  
  },
  {
    timestamps: true,
  });

const Result = mongoose.model('Result', resultSchema);
export default Result;