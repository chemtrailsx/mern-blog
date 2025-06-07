const path = require("path");
const multer = require("multer");
const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");
const Notification = require("../models/Notification");
const verifyToken = require("../middleware/verifyToken");

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", "uploads"));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, name);
  }
});

const upload = multer({ storage });

// Get all posts (with optional filters: category, author, search)
router.get("/", async (req, res) => {
  try {
    const { category, author, search } = req.query;
    let filter = {};

    if (category) filter.category = category;
    if (author) filter.author = author;

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } }
      ];
    }

    const posts = await Post.find(filter)
      .populate("author", "username")
      .populate("likes", "username");

    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get posts by logged-in user
router.get("/user", verifyToken, async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user.id })
      .sort({ createdAt: -1 })
      .populate("author", "username");
    res.json(posts);
  } catch (err) {
    console.error("Error fetching user posts:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get a single post by ID
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "username")
      .populate("likes", "username");
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Create a new post (and add notification)
router.post("/", verifyToken, upload.single("image"), async (req, res) => {
  const { title, content, category } = req.body;

  if (!title || !content || !category) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const imagePath = req.file ? `/uploads/${req.file.filename}` : "";

    const newPost = new Post({
      title,
      content,
      category,
      image: imagePath,
      author: req.user.id,
    });

    const savedPost = await newPost.save();

    // Add notification
    const author = await User.findById(req.user.id);
    const message = `${author.username} posted: "${savedPost.title}"`;
    await Notification.create({ message });

    res.status(201).json(savedPost);
  } catch (err) {
    console.error("Post creation error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Like/unlike a post
router.put("/:id/like", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const userId = req.user.id;
    const index = post.likes.indexOf(userId);

    if (index === -1) {
      post.likes.push(userId);
    } else {
      post.likes.splice(index, 1);
    }

    await post.save();
    res.json({ likes: post.likes });
  } catch (err) {
    console.error("Like error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Update a post
router.put("/:id", verifyToken, upload.single("image"), async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const { title, content, category } = req.body;

    if (title) post.title = title;
    if (content) post.content = content;
    if (category) post.category = category;
    if (req.file) post.image = `/uploads/${req.file.filename}`;

    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (err) {
    console.error("Post update error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete a post
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await post.deleteOne();
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("Post delete error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
