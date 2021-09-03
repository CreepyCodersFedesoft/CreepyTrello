const express = require("express");
const cors = require("cors");
const { dbConnection } = require("./db/db");
require("dotenv").config();

const Role = require('./routes/role');
const User = require('./routes/user');
const Board = require('./routes/board');
const Task = require('./routes/task');
const Comment = require('./routes/comment');

const app = express();

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads")); 
app.use("/api/role", Role);
app.use("/api/user", User);
app.use("/api/board", Board);
app.use("/api/task", Task); //o subo mejor todo a main y luego vuelvo a crear devGeneral?, voy  a intentar eso 
app.use("/api/comment", Comment);

app.listen(
  process.env.PORT || 3000, () =>
  console.log("Backend server running on port: " + process.env.PORT)
);

dbConnection();
