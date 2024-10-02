import React, { useEffect, useState } from "react";
import axios from "axios";
axios.defaults.withCredentials = true;
const Todo = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const apiUrl = "https://todo-list-server-lime-three.vercel.app";

  const handleSubmit = (e) => {
    setError("");
    setMessage("");

    if (title.trim() !== "" && description.trim() !== "") {
      axios
        .post(apiUrl + "/todos", {
          title,
          description,
        })
        .then((res) => {
          setTodos([...todos, { title, description }]);
          setMessage("Item added successfully");
          setTitle("");
          setDescription("");
          setTimeout(() => {
            setMessage("");
          }, 3000);
        })
        .catch((err) => {
          setError("Error creating todo item");
        });
    } else {
      setError("Title and description cannot be empty");
    }
  };

  useEffect(() => {
    getItems();
  }, []);

  const getItems = () => {
    axios
      .get(apiUrl + "/todos")
      .then((res) => {
        setTodos(res.data);
      })
      .catch((err) => {
        setError("Error fetching todos");
      });
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setEditTitle(item.title);
    setEditDescription(item.description);
  };

  const handleEditCancel = () => {
    setEditId(null);
    setEditTitle("");
    setEditDescription("");
  };

  const handleUpdate = (id) => {
    setError("");
    setMessage("");

    if (editTitle.trim() !== "" && editDescription.trim() !== "") {
      axios
        .put(apiUrl + `/todos/${id}`, {
          title: editTitle,
          description: editDescription,
        })
        .then((res) => {
          const updatedTodos = todos.map((todo) => {
            if (todo._id === id) {
              todo.title = editTitle;
              todo.description = editDescription;
            }
            return todo;
          });
          setTodos(updatedTodos);
          setMessage("Item updated successfully");
          setTimeout(() => {
            setMessage("");
          }, 3000);
          setEditTitle("");
          setEditDescription("");
          setEditId(null);
        })
        .catch((err) => {
          setError("Error updating todo item");
        });
    } else {
      setError("Title and description cannot be empty");
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete?")) {
      axios
        .delete(apiUrl + `/todos/${id}`)
        .then(() => {
          const updatedTodos = todos.filter((item) => item._id !== id);
          setTodos(updatedTodos);
          setMessage("Item deleted successfully");
          setTimeout(() => {
            setMessage("");
          }, 3000);
        })
        .catch((err) => {
          setError("Error deleting todo item");
        });
    }
  };

  return (
    <>
      <div className="w-full p-3 text-2xl text-center text-white bg-indigo-400">
        <h1>Todo project with MERN stack</h1>
      </div>
      <div>
        <h3 className="my-3 ml-6 text-xl">Add Item</h3>
        {message && (
          <p
            className={`message ${
              message ? "animation-enter" : "animation-exit"
            }`}
          >
            {message}
          </p>
        )}
        <div className="flex gap-3 mx-6 max-[500px]:flex-col max-[500px]:mx-3">
          <input
            className="px-3 py-1 text-base capitalize w-1/6 max-[500px]:w-full outline-none border border-stone-400 focus:border-2 focus:border-cyan-500"
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className="px-3 py-1 text-base w-3/4 max-[500px]:w-full outline-none border border-stone-400 focus:border-2 focus:border-cyan-500"
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button
            onClick={handleSubmit}
            className="p-2 bg-black w-1/6 max-[500px]:w-full text-white rounded-md"
          >
            Submit
          </button>
        </div>
        {error && <p className="ml-6 text-red-600">{error}</p>}
      </div>
      <div className="flex flex-col gap-3 mt-5">
        <h3 className="text-xl text-center uppercase text-amber-700">Tasks</h3>
        {todos.length > 0 ? (
          todos.map((item) => (
            <li
              key={item._id}
              className="flex items-center justify-between mx-6 max-[500px]:mx-3 bg-cyan-200 h-auto px-5 py-3 max-[500px]:px-3 max-[500px]:py-2 rounded-lg"
            >
              <div className="flex flex-col gap-1">
                {editId === item._id ? (
                  <>
                    <input
                      value={editTitle}
                      className="capitalize bg-cyan-100"
                      type="text"
                      onChange={(e) => setEditTitle(e.target.value)}
                    />
                    <input
                      value={editDescription}
                      className="bg-cyan-100"
                      type="text"
                      onChange={(e) => setEditDescription(e.target.value)}
                    />
                  </>
                ) : (
                  <>
                    <span className="font-bold capitalize">{item.title}</span>
                    <span className="font-light text-wrap">{item.description}</span>
                  </>
                )}
              </div>
              <div className="flex gap-3">
                {editId === item._id ? (
                  <button
                    className="px-2 py-1 ml-1 bg-green-400 rounded-md"
                    onClick={() => handleUpdate(item._id)}
                  >
                    Save
                  </button>
                ) : (
                  <button
                    className="px-2 py-1 ml-1 bg-yellow-400 rounded-md"
                    onClick={() => handleEdit(item)}
                  >
                    Edit
                  </button>
                )}
                {editId !== item._id ? (
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="px-2 py-1 text-white bg-red-500 rounded-md"
                  >
                    Delete
                  </button>
                ) : (
                  <button
                    onClick={handleEditCancel}
                    className="px-2 py-1 text-white bg-red-400 rounded-md"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </li>
          ))
        ) : (
          <p className="m-5 text-xl text-center ">
            Add tasks to display...
          </p>
        )}
      </div>
    </>
  );
};

export default Todo;
