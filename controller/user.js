const express = require("express");
const User = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.info("request received for user registration");
    try {
      //check if email already exist
      const user = await User.findOne({ email }).exec();
      if (user) {
        throw new Error("email already exists");
      }
    } catch (err) {
      console.error(err);
      res.status(400).send(err.message);
      throw err;
    }
    console.info("user registration request is valid");

    let hashedPassword = null;
    try {
      hashedPassword = await bcrypt.hash(password, 5);
    } catch (err) {
      res.status(500).send(err.message);
      throw err;
    }
    console.info("hashedPassword is generated");

    const newUser = {
      name,
      email,
      password: hashedPassword,
    };

    try {
      await new User(newUser).save();
      delete newUser.password;
      res.status(201).send({
        ...newUser,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
      throw err;
    }
    console.info(`user with email: ${email}, registration is successful`);
  } catch (err) {
    console.warn("Error inside signup route");
    console.error(err);
  }
});

router.post("/login", async (req, res) => {
  let currentUser = "";
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).exec();
    if (!user) return res.status(401).json({ msg: "authentication failed" });

    currentUser = JSON.parse(JSON.stringify(user));
    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword)
      return res.status(401).json("authentication failed");

    delete currentUser.password;
    const token = jwt.sign(
      { userId: currentUser._id },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token: token, duration: 3600, ...currentUser });
  } catch (err) {
    console.error(err);
    return res.status(401).send(err.message);
  }
});

module.exports = router;
