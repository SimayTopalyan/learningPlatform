// routes/connections.js
const express = require("express");
const router = express.Router();
const Connection = require("../models/Connection");

// Create a new connection
router.post("/", async (req, res) => {
  try {
    const connection = await Connection.create({
      name: req.body.name,
    });
    res.status(201).json(connection);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/:connectionId/users", async (req, res) => {
  const { connectionId } = req.params;
  try {
    const connection = await Connection.findByPk(connectionId);
    if (!connection) {
      return res.status(404).json({ message: "Connection not found" });
    }
    const users = await connection.getUsers();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all connections
router.get("/", async (req, res) => {
  try {
    const connections = await Connection.findAll();
    res.json(connections);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get a single connection by ID
router.get("/:id", async (req, res) => {
  try {
    const connection = await Connection.findByPk(req.params.id);
    if (!connection) {
      return res.status(404).json({ message: "Connection not found" });
    }
    res.json(connection);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update a connection by ID
router.put("/:id", async (req, res) => {
  try {
    const connection = await Connection.findByPk(req.params.id);
    if (!connection) {
      return res.status(404).json({ message: "Connection not found" });
    }

    // Update connection name
    connection.name = req.body.name || connection.name;

    await connection.save();
    res.json(connection);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete a connection by ID
router.delete("/:id", async (req, res) => {
  try {
    const connection = await Connection.findByPk(req.params.id);
    if (!connection) {
      return res.status(404).json({ message: "Connection not found" });
    }

    await connection.destroy();
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
