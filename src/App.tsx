import { useState, useEffect } from "react";
import "./App.css";

interface Todo {
  name: string;
  about: string;
  completed: boolean;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [filter, setFilter] = useState<"all" | "completed" | "active">("all");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // editing state
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // localStorage dan yuklash
  useEffect(() => {
    const savedTodos = localStorage.getItem("todos");
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  // localStorage ga saqlash
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTask = () => {
    if (title.trim() === "" || description.trim() === "") return;
    setTodos([...todos, { name: title, about: description, completed: false }]);
    setTitle("");
    setDescription("");
  };

  const toggleTodo = (index: number) => {
    const newTodos = [...todos];
    newTodos[index].completed = !newTodos[index].completed;
    setTodos(newTodos);
  };

  const deleteTodo = (index: number) => {
    const newTodos = todos.filter((_, i) => i !== index);
    setTodos(newTodos);
  };

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditTitle(todos[index].name);
    setEditDescription(todos[index].about);
  };

  const saveEdit = (index: number) => {
    const newTodos = [...todos];
    newTodos[index].name = editTitle;
    newTodos[index].about = editDescription;
    setTodos(newTodos);
    setEditingIndex(null);
    setEditTitle("");
    setEditDescription("");
  };

  const filteredTodos = todos.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true; // all
  });

  return (
    <div className="todo-app">
      <div className="container">
        {/* input form */}
        <div className="task__wrapper">
          <div className="task__items">
            <input
              type="text"
              placeholder="Title... "
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="task__item-title"
            />
            <input
              type="text"
              placeholder="About..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="task__item-description"
            />
          </div>
          <div className="task__add-btn" onClick={addTask}>
            +
          </div>
        </div>

        {/* custom dropdown */}
        <div className="filter-btn">
          <div
            className={`dropdown ${dropdownOpen ? "open" : ""}`}
            onClick={() => setDropdownOpen(!dropdownOpen)}>
            <div className="dropdown-selected">
              {filter}
              <svg
                className={`arrow ${dropdownOpen ? "rotate" : ""}`}
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ff8303"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
            <ul className="dropdown-options">
              <li
                onClick={() => {
                  setFilter("all");
                  setDropdownOpen(false);
                }}>
                All
              </li>
              <li
                onClick={() => {
                  setFilter("completed");
                  setDropdownOpen(false);
                }}>
                Completed
              </li>
              <li
                onClick={() => {
                  setFilter("active");
                  setDropdownOpen(false);
                }}>
                Active
              </li>
            </ul>
          </div>
        </div>

        {/* todos list */}
        <ul>
          {filteredTodos.map((todo, index) => (
            <li key={index}>
              {editingIndex === index ? (
                <div className="edit-form">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="edit-input"
                    placeholder="Edit title..."
                  />
                  <input
                    type="text"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="edit-input"
                    placeholder="Edit description..."
                  />
                  <button onClick={() => saveEdit(index)}>Save</button>
                  <button onClick={() => setEditingIndex(null)}>Cancel</button>
                </div>
              ) : (
                <div className="task-item">
                  <div
                    style={{
                      textDecoration: todo.completed ? "line-through" : "none",
                    }}
                    onClick={() => toggleTodo(index)}>
                    <div className="todo-title">{todo.name}</div>
                    <div className="todo-description">{todo.about}</div>
                  </div>
                  <div className="todo-actions">
                    <button onClick={() => startEditing(index)}>Edit</button>
                    <button onClick={() => deleteTodo(index)}>Delete</button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
