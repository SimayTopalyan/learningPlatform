// routes/users.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const Connection = require("../models/Connection"); // Add this line
const jwt = require("jsonwebtoken");

// Create a new user
router.post("/", async (req, res) => {
  try {
    // Hash the password before saving to the database
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Create a new user
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });

    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});


router.get('/userss/:email', async (req, res) => {
  try {
    const email = req.params.email;
    const user = await User.findOne({ where: {email }});

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  console.log(req.body);
  if (!email || !password) {
    return res.status(400).send({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ where: { email } });
    console.log(user);

    if (!user) {
      return res.status(400).send({ message: "Invalid credentials" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(400).send({ message: "Invalid credentials" });
    }

    // Passwords match, authentication successful
    const token = jwt.sign({ id: user._id }, "your_jwt_secret");

    res.status(200).send({ token,user });
  } catch (error) {
    console.error("Error logging in:", error); // Log the error to the console
    res.status(500).send({ message: "Error logging in", error });
  }
});

// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/:userId/connections", async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const connection = await Connection.create({ name: req.body.name });
    await user.addConnection(connection);
    res.status(201).json(connection);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/:userId/connections/:connectionId", async (req, res) => {
  const { userId, connectionId } = req.params;
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const connection = await Connection.findByPk(connectionId);
    if (!connection) {
      return res.status(404).json({ message: "Connection not found" });
    }
    await user.addConnection(connection);
    res
      .status(201)
      .json({ message: "User associated with connection successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all connections for a user
router.get("/:userId/connections", async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const connections = await user.getConnections();
    res.json(connections);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get a single user by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/name/:name", async (req, res) => {
  try {
    const name = req.params.name;
    const user = await User.findOne({ name });
    console.log(name);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update a user by ID
router.put("/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user attributes
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete a user by ID
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.destroy();
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
