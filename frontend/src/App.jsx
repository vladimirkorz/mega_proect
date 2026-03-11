// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext.jsx";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Registration from "./pages/Registration.jsx";
import Cart from "./pages/Cart.jsx";

import "./App.css";

function App() {
	return (
		<BrowserRouter>
			<CartProvider>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/login" element={<Login />} />
					<Route path="/registration" element={<Registration />} />
					<Route path="/cart" element={<Cart />} />
				</Routes>
			</CartProvider>
		</BrowserRouter>
	);
}

export default App;