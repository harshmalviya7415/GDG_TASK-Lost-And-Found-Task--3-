const express = require("express");
const router = express.Router();
const { getNotifications, markAsRead, markAllAsRead } = require("../controllers/notificationController");
const auth = require("../middleware/auth");

router.get("/", auth, getNotifications);
router.put("/mark-all-read", auth, markAllAsRead);
router.put("/:id/read", auth, markAsRead);

module.exports = router;
