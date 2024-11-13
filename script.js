// script.js

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

// Fetch tasks from the server and display them
async function fetchTasks() {
  try {
    const response = await fetch("http://localhost:3000/tasks");
    if (!response.ok) throw new Error("Failed to fetch tasks");
    const tasks = await response.json();
    taskList.innerHTML = "";
    tasks.forEach(task => addTaskToDOM(task));
  } catch (error) {
    console.error("Error:", error);
  }
}

// Add a task to the DOM
function addTaskToDOM(task) {
  const li = document.createElement("li");
  li.className = task.completed ? "completed" : "";
  li.dataset.id = task.id;

  li.innerHTML = `
    <span>${task.title}</span>
    <button class="complete-btn">${task.completed ? "Undo" : "Complete"}</button>
    <button class="delete-btn">Delete</button>
  `;

  taskList.appendChild(li);
}

// Add a new task
taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = taskInput.value.trim();
  if (!title) return;

  try {
    const response = await fetch("http://localhost:3000/create-task", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title })
    });
    if (!response.ok) throw new Error("Failed to add task");
    const newTask = await response.json();
    addTaskToDOM(newTask);
    taskInput.value = "";
  } catch (error) {
    console.error("Error:", error);
  }
});

// Handle task completion and deletion
taskList.addEventListener("click", async (e) => {
  if (e.target.classList.contains("complete-btn")) {
    const li = e.target.closest("li");
    const taskId = li.dataset.id;
    const isCompleted = li.classList.contains("completed");

    try {
      const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !isCompleted })
      });
      if (!response.ok) throw new Error("Failed to update task");
      
      li.classList.toggle("completed");
      e.target.textContent = isCompleted ? "Complete" : "Undo";
    } catch (error) {
      console.error("Error:", error);
    }
  }

  if (e.target.classList.contains("delete-btn")) {
    const li = e.target.closest("li");
    const taskId = li.dataset.id;

    try {
      const response = await fetch(`http://localhost:3000/tasks/delete/${taskId}`, {
        method: "DELETE"
      });
      if (!response.ok) throw new Error("Failed to delete task");
      
      li.remove();
    } catch (error) {
      console.error("Error:", error);
    }
  }
});

// Initial fetch of tasks
fetchTasks();
