// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import "./App.css";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home />} />{" "}
				{/* Главная по умолчанию */}
				<Route path="/login" element={<Login />} />{" "}
				{/* Доступна по кнопке */}
			</Routes>
		</BrowserRouter>
	);
}

export default App;
