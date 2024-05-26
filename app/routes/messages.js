// routes/messages.js
const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

// Create a new message
router.post("/", async (req, res) => {
  try {
    const message = await Message.create({
      text: req.body.text,
      ConnectionId: req.body.connectionId,
      senderid: req.body.senderid,
      reciverid: req.body.reciverid,
    });
    res.status(201).json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all messages
router.get("/", async (req, res) => {
  try {
    const messages = await Message.findAll();
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get a single message by ID
router.get("/:id", async (req, res) => {
  try {
    const message = await Message.findByPk(req.params.id);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }
    res.json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update a message by ID
router.put("/:id", async (req, res) => {
  try {
    const message = await Message.findByPk(req.params.id);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Update message text
    message.text = req.body.text || message.text;

    await message.save();
    res.json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete a message by ID
router.delete("/:id", async (req, res) => {
  try {
    const message = await Message.findByPk(req.params.id);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    await message.destroy();
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
