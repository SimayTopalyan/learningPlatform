// server.js
const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const sequelize = require("./app/config/database");
const cors = require("cors");
const User = require("./app/models/User");
const Connection = require("./app/models/Connection");
const Message = require("./app/models/Message");
const Post = require("./app/models/Post");
const Comment = require("./app/models/Comment");
const mysql = require("mysql");

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
// Middleware
app.use(bodyParser.json());

// Define associations between models
User.belongsToMany(Connection, { through: "UserConnection" });
Connection.belongsToMany(User, { through: "UserConnection" });
Connection.hasMany(Message);
Message.belongsTo(Connection);

Post.hasMany(Comment);
Comment.belongsTo(Post);

// Routes
app.use("/api/users", require("./app/routes/users"));
app.use("/api/connections", require("./app/routes/connections"));
app.use("/api/messages", require("./app/routes/messages"));
app.use("/api/posts", require("./app/routes/posts"));
app.use("/api/comments", require("./app/routes/comments"));

// Set up storage engine

// Serve frontend

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "social",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL: ", err);
    return;
  }
  console.log("Connected to MySQL");
});

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Save uploaded files to 'uploads' directory
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original file name
  },
});

const upload = multer({ storage: storage });

app.post("/api/photoss", upload.single("photo"), async (req, res) => {
  try {
    const post = await Post.create({
      text: req.body.caption,
      senderid: req.body.userId,
      img: req.file.filename,
    });
    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/images/:imageName", (req, res) => {
  const { imageName } = req.params;
  // Construct the path to the image
  const imagePath = path.join(__dirname, "uploads", imageName);

  // Serve the image using Express's built-in 'sendFile' function
  res.sendFile(imagePath, (err) => {
    if (err) {
      console.error("Error serving image:", err);
      res.status(404).send("Image not found");
    }
  });
});

// Sync models with database and start the server
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Database & tables created!");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => console.error("Unable to sync database:", error));
