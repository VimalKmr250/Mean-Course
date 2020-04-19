const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const Post = require('./models/post');

const app = express();

mongoose.connect("mongodb+srv://Vimal:cqzVUMcLdCx2OZXN@mycluster-lhb8q.mongodb.net/Mean-Couse?retryWrites=true&w=majority")
    .then(()=>{
      console.log("Connected to DB");
    })
    .catch(()=>{
      console.log("Connection failed");
    })
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.post("/api/posts", (req, res, next) => {
  const post = Post({
    title: req.body.title,
    content: req.body.content
  });
  console.log(post);
  post.save().then(createdPost=>{
    console.log(createdPost);
    res.status(201).json({
      message: 'Post added successfully',
      postId:createdPost._id
    });
  });
});

app.get("/api/posts", (req, res, next) => {
  Post.find().then(documents=>{
    console.log(documents);
    res.status(200).json({
      message: "Posts fetched successfully!",
      posts: documents
    });
  });

});

app.delete("/api/posts/:id", (req,res,next)=>{
  Post.deleteOne({_id: req.params.id}).then(result =>{
    console.log(result);
    res.status(200).json({message:"Deleted post"});
  })
  console.log(req.params.id);

});

module.exports = app;
