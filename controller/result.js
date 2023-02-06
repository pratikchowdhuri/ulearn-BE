const express = require("express");
const User = require("../models/users");
const router = express.Router();
const question = require("../models/question");
const authenticate = require("../middleware/check-auth");

router.post("/",authenticate, async (req, res) => {
  try {
    const { score, userId } = req.body;
    if (!(score && userId))
      throw new Error(
        `Incorrect request body, either 'score' or 'userId' missing`
      );
    const result = await User.findByIdAndUpdate(
      userId,
      { score },
      {
        overwrite: false,
        new: true,
      }
    );
    res.status(200).send(result);
    console.info("exam result is submitted");
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

router.get("/",authenticate, async (req, res) => {
  try {
    let results = await User.find({}, ["-__v", "-password"]);
    results = JSON.parse(JSON.stringify(results))
    let totalMarks = await question
      .aggregate([
        { $group: { _id: null, total_marks: { $sum: "$marks" } } },
        { $project: { _id: 0, total_marks: 1 } },
      ]);
    totalMarks = JSON.parse(JSON.stringify(totalMarks))
    const reports = results.map(result=>({
      ...result,
      totalScore: totalMarks[0]["total_marks"]
    }))
    res.status(200).send(reports);
    console.info("exam result is fetched");
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

module.exports = router;
