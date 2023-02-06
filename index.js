require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    " X-Requested-With, Content-Type, Accept, authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, PUT, PATCH, DELETE, POST, OPTIONS"
  );
  next();
});

app.use(express.json());

mongoose.connect(process.env.DB_url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("Connected to Database"));

//routes
const questionRouter = require('./controller/question')
app.use('/question', questionRouter)
const resultRouter = require('./controller/result')
app.use('/result', resultRouter)
const authRouter = require('./controller/user')
app.use('/auth', authRouter)
const courseRouter = require('./controller/course')
app.use('/course', courseRouter)
app.use("*", (req, res) => {
  res.status(404).send("route not found");
});

const port = process.env.PORT || 4999;
const server = app.listen(port, () => {
  console.info(`Server started on port: ${port}`);
});

process.on("unhandledRejection", () => {
  console.log("add catch block to all promise");
});
process.on("uncaughtException", (error) => {
  console.log(`handle error: ${error}`);
});
function shutDown() {
  console.info("Received kill signal, shutting down gracefully");
  server.close(async () => {
    await db.close();
    console.info("Closed all the DB connections");
    process.exit(0);
  });
}
process.on("SIGTERM", shutDown);
process.on("SIGINT", shutDown);
