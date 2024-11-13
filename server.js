const express = require("express");
const cors = require("cors"); // If you need to allow cross-origin requests
const { v4: uuidv4 } = require("uuid");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); // Enable CORS if needed
app.use(express.json()); // Middleware to parse JSON request bodies
app.use(express.static("public")); // Serve static files from 'public' folder

// In-memory data structure to store tasks
let tasks = [{ id: uuidv4(), title: "Sample Task", completed: false }];

// Route to get all tasks
app.get("/tasks", (req, res) => {
  try {
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve tasks" });
  }
});

// Route to add a new task
app.post("/create-task", (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ error: "Task title is required" });
  }

  const newTask = {
    id: uuidv4(), // Use UUID for unique ID generation
    title,
    completed: false,
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// Route to update a task (mark as completed or incomplete)
app.put("/tasks/:id", (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  const task = tasks.find((task) => task.id === id);

});

app.delete("/tasks/delete/:id", (request, response) => {
  const { id } = request.params
  const { completed } = request.body
  const task = tasks.find((task) => task.id === id)
})

app.listen(port, () => {
  console.log(`Server running on port: ${port}`)
})