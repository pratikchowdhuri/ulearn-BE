const express = require("express");
const router = express.Router();
const Course = require("../models/course");
const authenticate = require("../middleware/check-auth");

router.post("/", authenticate, async (req, res) => {
  try {
    const { topic, title, docLink, videoLink } = req.body;

    const newCourse = {
      topic,
      title,
      docLink,
      videoLink,
    };

    const courseCreationResult = await new Course(newCourse).save();
    newCourse._id = courseCreationResult._id;
    newCourse.viewCount = courseCreationResult.viewCount
    res.status(201).send(newCourse);
    console.info("course is successfully created");
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

router.get("/frequentVideos", authenticate, async (req, res) => {
  const getAll = req.query.getAll

  const pipeline = [{
    $sort: { viewCount: -1 },
  }]
  if(getAll!=='true'){
    pipeline.push({
      $limit: 2,
    })
  }
  pipeline.push({
    $project: {videoLink: 1}
  })

  try {
    const videos = await Course.aggregate(pipeline);
    res.status(200).send(videos);
    console.info("all most watched videos fetched successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

router.get('/frequentCourses', authenticate, async(req, res)=>{
  const getAll = req.query.getAll
  const pipeline = [{
    $group: {
      _id: '$topic'
    },
  }]

  if(getAll!=='true'){
    pipeline.push({
      $limit: 2,
    })
  }
  try{
    const courses = await  Course.aggregate(pipeline) 
    res.status(200).send(courses);
    console.info("all most watched courses fetched successfully");
  }
  catch(err){
    console.error(err);
    res.status(500).send(err.message);
  }
})

router.get('/getCourse/:topic', authenticate, async (req, res)=>{
  try{
    const courses = await  Course.find({topic: req.params.topic}) 
    res.status(200).send(courses);
    console.info(`all topics of ${req.params.topic} course fetched successfully`);
  }
  catch(err){
    console.error(err);
    res.status(500).send(err.message);
  }
})

module.exports = router;
