import React, { useState, useEffect } from "react";
import "./home.css";
import { FaTrash } from "react-icons/fa";

const API_URL = "https://playground.4geeks.com/todo/";

const Home = () => {
  const [inputValue, setInputValue] = useState("");
  const [todo, setTodo] = useState([]);

  // Función para cargar tareas desde localStorage
  const loadTodosFromLocalStorage = () => {
    const storedTodos = localStorage.getItem("todos");
    if (storedTodos) {
      return JSON.parse(storedTodos);
    }
    return [];
  };

  // Función para guardar tareas en localStorage
  const saveTodosToLocalStorage = (todos) => {
    localStorage.setItem("todos", JSON.stringify(todos));
  };

  // Inicializa usuario si no existe
  const initializeUser = async () => {
    try {
      const response = await fetch(API_URL + "users/gloria");
      if (response.status === 404) {
        await fetch(API_URL + "users/gloria", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify([]),
        });
        console.log("Usuario creado exitosamente.");
      }
    } catch (error) {
      console.error("Error al inicializar usuario:", error);
    }
  };

  // Cargar tareas desde el backend y desde localStorage
  const loadTodos = async () => {
    try {
      const response = await fetch(API_URL + "users/gloria");
      if (!response.ok) throw new Error(response.statusText);

      const data = await response.json();
      if (Array.isArray(data)) {
        setTodo(data);
        saveTodosToLocalStorage(data); // Guardar tareas en localStorage
      } else {
        console.error("Estructura de datos inesperada:", data);
      }
    } catch (error) {
      console.error("Error al cargar tareas:", error);
      setTodo(loadTodosFromLocalStorage()); // Si hay error, cargar desde localStorage
    }
  };

  // Agregar nueva tarea
  const addTodo = async () => {
    if (inputValue.trim() === "") return;
    const newTodo = { label: inputValue, is_done: false };

    const response = await fetch(API_URL + "todos/gloria", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTodo),
    });

    if (response.ok) {
      const newTask = await response.json();  // Supongamos que la respuesta contiene el ID de la tarea creada
      const updatedTodos = [...todo, newTask];
      setTodo(updatedTodos);  // Agregar la tarea nueva al estado
      saveTodosToLocalStorage(updatedTodos);  // Guardar las tareas actualizadas en localStorage
      setInputValue("");  // Limpiar el input
    } else {
      console.error("Error al agregar tarea:", response.statusText);
    }
  };

  // Eliminar tarea
  const deleteTodo = async (todoId) => {
    const updatedTodos = todo.filter((t) => t.id !== todoId);
    setTodo(updatedTodos);
    saveTodosToLocalStorage(updatedTodos); // Guardar en localStorage
    await deleteTodoBackend(todoId);
  };

  // Eliminar tarea del backend
  const deleteTodoBackend = async (todoId) => {
    try {
      const response = await fetch(API_URL + "todos/" + todoId, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error(response.statusText);
    } catch (error) {
      console.error("Error al eliminar tarea:", error);
    }
  };

  // Eliminar todas las tareas
  const deleteAllTodos = async () => {
    const updatedTodos = [];
    setTodo(updatedTodos); // Limpiar las tareas en el estado
    saveTodosToLocalStorage(updatedTodos); // Limpiar en localStorage
    await deleteAllTodosBackend();
  };

  // Eliminar todas las tareas del backend
  const deleteAllTodosBackend = async () => {
    try {
      for (const task of todo) {
        await fetch(`${API_URL}todos/${task.id}`, {
          method: "DELETE",
        });
      }
      console.log("Todas las tareas fueron eliminadas individualmente.");
    } catch (error) {
      console.error("Error al eliminar tareas individualmente:", error);
    }
  };

  useEffect(() => {
    const initializeAndLoad = async () => {
      await initializeUser();
      const todosFromLocalStorage = loadTodosFromLocalStorage();
      if (todosFromLocalStorage.length > 0) {
        setTodo(todosFromLocalStorage); // Cargar las tareas desde localStorage si existen
      } else {
        await loadTodos(); // Si no hay tareas en localStorage, cargar desde la API
      }
    };
    initializeAndLoad();
  }, []);

  return (
    <div className="container">
      <h1>Lista de cosas por hacer</h1>
      <ul>
        <li>
          <input
            type="text"
            onChange={(e) => setInputValue(e.target.value)}
            value={inputValue}
            onKeyUp={(e) => {
              if (e.key === "Enter") addTodo();
            }}
            placeholder="¿Qué necesitas hacer?"
          />
        </li>
        {todo.map((item) => (
          <li
            key={item.id}
            className="todo-item"
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "1.5rem",
            }}
          >
            <span
              style={{
                textDecoration: item.is_done ? "line-through" : "none",
              }}
            >
              {item.label}
            </span>
            <FaTrash
              onClick={() => deleteTodo(item.id)}
              style={{ cursor: "pointer", color: "red" }}
              className="trash-icon"
            />
          </li>
        ))}
      </ul>
      <div>
        {todo.length} tareas
        <button
          onClick={deleteAllTodos}
          style={{
            marginLeft: "20px",
            padding: "5px 10px",
            backgroundColor: "red",
            color: "white",
            border: "none",
            cursor: "pointer",
            borderRadius: "5px",
          }}
        >
          Eliminar todas
        </button>
      </div>
    </div>
  );
};

export default Home;