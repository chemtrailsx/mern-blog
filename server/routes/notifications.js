const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");
const verifyToken = require("../middleware/verifyToken");

// GET all notifications (sorted by newest first)
router.get("/", verifyToken, async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT mark all notifications as read
router.put("/mark-all-read", verifyToken, async (req, res) => {
  try {
    await Notification.updateMany({ read: false }, { $set: { read: true } });
    res.json({ message: "All notifications marked as read" });
  } catch (err) {
    console.error("Error marking notifications as read:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
