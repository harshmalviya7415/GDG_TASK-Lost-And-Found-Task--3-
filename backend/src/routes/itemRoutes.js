const express = require("express");
const router = express.Router();
const { createItem, getItems, getItem, editItem, deleteItem } = require("../controllers/itemController");
const auth = require("../middleware/auth");

router.post("/", auth, createItem);
router.get("/", getItems);
router.get("/:id", getItem);
router.post("/edit", auth, editItem);
router.post("/delete", auth, deleteItem);

module.exports = router;
