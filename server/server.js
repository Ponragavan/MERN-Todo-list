const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true })); // No need for replace

// mongoose and model creation
mongoose
  .connect(process.env.CONNECTION_URL)
  .then((con) => {
    console.log("Database connected to the host: " + con.connection.host);
  })
  .catch((err) => console.log(err));

// Test route
app.get('/', (req, res) => {
  res.json("Hello World");
});

// mongoose model
const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: String,
});

const todoModel = mongoose.model("Todo", todoSchema);

// Add todos
app.post("/todos", async (req, res) => {
  const { title, description } = req.body;
  try {
    const newTodo = new todoModel({ title, description });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get todos
app.get("/todos", async (req, res) => {
  try {
    const todos = await todoModel.find();
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update todos
app.put("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  try {
    const updatedTodo = await todoModel.findByIdAndUpdate(id, { title, description }, { new: true });
    res.status(200).json(updatedTodo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete todos
app.delete("/todos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await todoModel.findByIdAndDelete(id);
    res.status(204).send(); // No content
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
