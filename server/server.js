const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors({ origin: "https://todo-list-seven-sable.vercel.app", credentials: true }));

// mongoose and model creation
mongoose
  .connect(process.env.CONNECTION_URL) // Use environment variable
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
app.post("/api/todos", async (req, res) => {
  const { title, description } = req.body;
  try {
    const newTodo = new todoModel({ title, description });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

// Get todos
app.get("/api/todos", async (req, res) => {
  try {
    const todos = await todoModel.find();
    res.json(todos);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

// Update todo
app.put("/api/todos/:id", async (req, res) => {
  try {
    const { title, description } = req.body;
    const id = req.params.id;
    const updatedTodo = await todoModel.findByIdAndUpdate(
      id,
      { title, description },
      { new: true }
    );
    if (!updatedTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.json(updatedTodo);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

// Delete todo
app.delete("/api/todos/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await todoModel.findByIdAndDelete(id);
    res.status(204).end();
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

// Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log("Server listening on port " + PORT);
});
