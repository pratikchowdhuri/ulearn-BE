const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: true,
    enum: {
      values: ["math", "physics"],
      message: "currently 'math' & 'physics' teachers are only available",
    },
  },
  title: {
    type: String,
    required: true,
  },
  docLink: {
    type: String,
    required: false,
  },
  videoLink: {
    type: String,
    required: true,
  },
  viewCount: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("course", courseSchema);
