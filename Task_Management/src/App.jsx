import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "https://todos-65f6a-default-rtdb.firebaseio.com/todos.json";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [name, setName] = useState("");
  const [priority, setPriority] = useState("");

  // Fetch todos from Firebase
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get(API_URL);
        if (response.data) {
          const todosArray = Object.keys(response.data).map((key) => ({
            id: key,
            ...response.data[key],
          }));
          setTodos(todosArray);
        }
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    };
    fetchTodos();
  }, []);

  // Add a new todo
  const addTodo = async () => {
    if (!name || !priority) return;
    const newTodo = {
      name,
      priority,
      completed: false,
    };
    try {
      const response = await axios.post(API_URL, newTodo);
      setTodos([...todos, { id: response.data.name, ...newTodo }]);
      setName("");
      setPriority("");
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  // Toggle completion
  const toggleComplete = async (id, completed) => {
    try {
      await axios.patch(`https://todos-65f6a-default-rtdb.firebaseio.com/todos/${id}.json`, { completed: !completed });
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  // Delete a todo
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`https://todos-65f6a-default-rtdb.firebaseio.com/todos/${id}.json`);
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  return (
    <div className="container">
      <h1 className="title">Todo List</h1>
      <div className="input-container">
        <input
          type="text"
          className="todo-input"
          placeholder="Enter todo name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <select className="priority-select" value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="" disabled>Select Priority</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <button className="add-button" onClick={addTodo}>Add Todo</button>
      </div>

      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id} className={`todo-item ${todo.completed ? "completed" : ""}`}>
            <input
              type="checkbox"
              className="todo-checkbox"
              checked={todo.completed}
              onChange={() => toggleComplete(todo.id, todo.completed)}
            />
            <span className="todo-text">{todo.name} ({todo.priority})</span>
            <button className="delete-button" onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
