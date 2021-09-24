const path = require('path');
const express = require("express");
const cors = require("cors");
const { dbConnection } = require("./db/db");
require("dotenv").config();

const Role = require('./routes/role');
const User = require('./routes/user');
const Board = require('./routes/board');
const Sprint = require('./routes/sprint');
const Task = require('./routes/task');
const Comment = require('./routes/comment');
const SendMail = require('./routes/sendgrid');

const app = express();

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads")); 
app.use("/api/role", Role);
app.use("/api/user", User);
app.use("/api/board", Board);
app.use("/api/task", Task);
app.use("/api/comment", Comment);
app.use("/api/sendMail", SendMail);

app.use('/templates', express.static('templates'));
app.use("/api/sprint", Sprint);

app.use(express.static("public")); //a diferencia de upload, aca no damos permiso de guardar cosas sino solo de usarlo

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "public/index.html"));
});

app.listen(
  process.env.PORT || 3000, () =>
  console.log("Backend server running on port: " + process.env.PORT)
);

dbConnection();
