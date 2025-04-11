import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateTask = () => {
  const [task, setTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "low",
    status: "active",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error state before submission
    setSuccess(""); // Reset success state before submission

    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found. Please log in.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:8001/api/v1/task/create",
        task,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      setSuccess("Task created successfully!");
      setTask({
        title: "",
        description: "",
        dueDate: "",
        priority: "low",
        status: "active",
      }); // Clear the form after successful submission
      setTimeout(() => navigate("/tasks"), 2000); // Redirect after a brief delay
    } catch (error) {
      setError(error.response?.data?.message || "Task creation failed.");
    }
  };

  return (
    <div className="container">
      <h2>Create Task</h2>

      {/* Success/Error Message */}
      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            className="form-control"
            placeholder="Enter task title"
            value={task.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            className="form-control"
            placeholder="Enter task description"
            value={task.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="dueDate" className="form-label">
            Due Date
          </label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            className="form-control"
            value={task.dueDate}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="priority" className="form-label">
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            className="form-select"
            value={task.priority}
            onChange={handleChange}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary">
          Create Task
        </button>
      </form>

      {/* View Tasks Button */}
      <button
        onClick={() => navigate("/tasks")}
        className="btn btn-secondary mt-2"
      >
        View Tasks
      </button>
    </div>
  );
};

export default CreateTask;
