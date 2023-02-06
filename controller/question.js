const express = require("express");
const router = express.Router();
const Question = require("../models/question");
const authenticate = require("../middleware/check-auth");

router.post("/",authenticate, async (req, res) => {
  try {
    const { options, title, correctAnswer, marks, solutionLink } = req.body;

    const newQuestion = {
      title,
      marks: +marks,
      options,
      correctAnswer,
      solutionLink
    };

    const questionCreationResult = await new Question(newQuestion).save();
    newQuestion._id = questionCreationResult._id;
    res.status(201).send(newQuestion);
    console.info("question is successfully created");
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

router.get("/",authenticate, async (req, res) => {
  try {
    const questions = await Question.find({},["-__v"]).populate([
      "options",
    ]);
    res.status(200).send(questions);
    console.info("all questions fetched successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

module.exports = router;
