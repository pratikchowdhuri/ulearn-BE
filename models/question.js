const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  marks: {
    type: Number,
    required: true,
  },
  options: {
    type: [String],
    required: true,
  },
  correctAnswer: {
    type: String,
    required: true,
  },
  solutionLink: {
    type: String,
    require: false,
    default:""
  },
});

module.exports = mongoose.model("question", questionSchema);
