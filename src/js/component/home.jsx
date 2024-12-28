import React, { useState } from "react";
import './home.css';
import { FaTrash } from 'react-icons/fa';

//create your first component
const Home = () => {
	const [inputValue, setInputValue] = useState("");
	const [todos, setTodos] = useState([]);

	// Add into array - concat
	// Delete from array - filter
	// Update - map

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
							if (e.key === 'Enter' && inputValue.trim() !== "") {
								setTodos(todos.concat([inputValue]));
								setInputValue("");
							}
						}}
						placeholder="¿Qué necesitas hacer?"
					/>
				</li>
				{todos.map((item, index) => (
					<li key={index} className="todo-item" style={{ display: "flex", justifyContent: "space-between", fontSize:"2rem"}}>
						{item}{" "}
						<FaTrash
							onClick={() =>
								setTodos(
									todos.filter((_, currentIndex) => index !== currentIndex)
								)
							}
							style={{cursor: "pointer", color:"red"}}
						className="trash-icon"/>
					</li>
				))}
			</ul>
			<div>{todos.length} tareas</div>
		</div>
	);
};

export default Home;

