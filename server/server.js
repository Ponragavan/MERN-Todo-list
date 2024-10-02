const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
require('dotenv').config();

app.use(express.json());
app.use(cors());

// mongoose and model creation
mongoose
  .connect(
    process.env.CONNECTION_URL
  )
  .then((con) => {
    console.log("Database connected to the host : " + con.connection.host);
  })
  .catch((err) => console.log(err));

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

//add todos
app.post("/todos", async (req, res) => {
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

//get todos
app.get("/todos", async (req, res) => {
  try {
    const todos = await todoModel.find();
    res.json(todos);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

//update todo
app.put("/todos/:id", async (req, res) => {
  try {
    const { title, description } = req.body;
    const id = req.params.id;
    const updatedTodo = await todoModel.findByIdAndUpdate(
      id,
      {
        title,
        description,
      },
      {
        new: true,
      }
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

//delete todo
app.delete("/todos/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await todoModel.findByIdAndDelete(id);
    res.status(204).end();
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

//front-end connection
// app.use(express.static(path.join(__dirname,'../client/dist')));
// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname,'../client/dist/index.html'));
// })

// server
const PORT = process.env.PORT || 8000;
app.listen(PORT, (res) => {
  console.log("Server listening on port " + PORT);
});
