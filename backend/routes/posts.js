const express = require("express");

const Post = require("../models/post");
const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");

const router = express.Router();
const postController = require("../controllers/post");

router.post("",checkAuth,extractFile,postController.createPost);

router.put("/:id",checkAuth,extractFile,postController.updatePost);

router.get("", postController.getPost);

router.get("/:id", postController.singlePost);

router.delete("/:id",checkAuth, postController.deletePost);

module.exports = router;
