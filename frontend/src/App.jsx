// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext.jsx"; // Импортируем провайдер

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Registration from "./pages/Registration.jsx";

import Cart from "./pages/Cart.jsx"; // 👈 Импортируем новую страницу

import "./App.css";

function App() {
	return (
		<BrowserRouter>
			<CartProvider>
				{" "}
				{/* 👈 Оборачиваем всё приложение */}
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/login" element={<Login />} />
					<Route path="/registration" element={<Registration />} />
					<Route path="/cart" element={<Cart />} />{" "}
					{/* 👈 Новый маршрут */}
				</Routes>
			</CartProvider>
		</BrowserRouter>
	);
}

export default App;
