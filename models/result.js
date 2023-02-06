const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: [true, "student is required"],
  },
  date: {
    type: Date,
    default: new Date().toDateString(),
  },
  response: {
    type: [
      {
        question: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "question",
          required: true,
        },
        answer: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "option",
        },
      },
    ],
    default: []
  },
});

module.exports = mongoose.model("result", resultSchema);
