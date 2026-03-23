// src/components/NavigationBar.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

function NavigationBar() {
	const [isOpen, setIsOpen] = useState(false);
	const navigate = useNavigate();
	const { cartCount } = useCart();
	const { user, logout } = useAuth();

	console.log("=== NavigationBar Debug ===");
	console.log("Current user:", user);
	console.log("User role:", user?.role);

	// Обработчик клика по "войти"
	const handleLoginClick = () => {
		setIsOpen(false);
		navigate("/login");
	};

	// Обработчик клика по "выйти"
	const handleLogoutClick = () => {
		logout();
		setIsOpen(false);
		navigate("/");
	};

	// 👇 Обработчик клика по админ-панели
	const handleAdminClick = () => {
		setIsOpen(false);
		navigate("/admin");
	};

	return (
		<div className="navigationBar">
			<button>
				<Link to="/cart" className="cart-link">
					🛒 Корзина
					{cartCount > 0 && (
						<span className="cart-badge">{cartCount}</span>
					)}
				</Link>
			</button>
			<button>наш телеграм</button>

			<div className="dropdown">
				<button id="menuButton" onClick={() => setIsOpen(!isOpen)}>
					Настройки
				</button>
				<div
					id="dropdownContent"
					className={`dropdown-content ${isOpen ? "show" : ""}`}
				>
					{/* Показываем email пользователя, если авторизован */}
					{user && (
						<span className="user-greeting" style={{ 
							padding: "8px", 
							fontSize: "12px", 
							color: "#666",
							borderBottom: "1px solid #eee",
							display: "block"
						}}>
							{user.email}
						</span>
					)}

					{/* 👇 Кнопка админ-панели (только для админов) */}
					{user?.role === "admin" && (
						<button 
							onClick={handleAdminClick}
							className="btn-admin"
							style={{
								backgroundColor: "#4CAF50",
								color: "white"
							}}
						>
							👑 Админ-панель
						</button>
					)}

					{/* Кнопка входа/выхода */}
					{user ? (
						<button onClick={handleLogoutClick} className="btn-logout">
							Выйти
						</button>
					) : (
						<button onClick={handleLoginClick}>Войти</button>
					)}

					<button>балланс</button>
				</div>
			</div>
		</div>
	);
}

export default NavigationBar;