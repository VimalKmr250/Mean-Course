const path = require("path")
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const postsRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");

const app = express();

mongoose.connect("mongodb+srv://Vimal:"+ process.env.MONGODB_ATLASS_PWD + "@mycluster-lhb8q.mongodb.net/Mean-Couse?retryWrites=true&w=majority")
    .then(()=>{
      console.log("Connected to DB");
    })
    .catch(()=>{
      console.log("Connection failed");
    })
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images",express.static(path.join("backend/images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST,PUT, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/posts",postsRoutes);
app.use("/api/user",userRoutes);

module.exports = app;
