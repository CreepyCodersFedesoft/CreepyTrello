const express = require("express");
const cors = require("cors");
const { dbConnection } = require("./db/db");
require("dotenv").config();

//here goes routes

const app = express();

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads")); //con esto indicamos que use y vuelva publica la carpeta uploads

app.listen(
  process.env.PORT || 3000, () =>
  console.log("Backend server running on port: " + process.env.PORT)
);

dbConnection();
