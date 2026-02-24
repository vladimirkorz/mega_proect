// src/components/NavigationBar.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx"; // 👈 Импортируем useAuth

function NavigationBar() {
	const [isOpen, setIsOpen] = useState(false);
	const navigate = useNavigate();
	const { cartCount } = useCart();
	const { user, logout } = useAuth(); // 👈 Получаем user и logout из контекста

	// Обработчик клика по "войти"
	const handleLoginClick = () => {
		setIsOpen(false);
		navigate("/login");
	};

	// 👇 Обработчик клика по "выйти"
	const handleLogoutClick = () => {
		logout(); // Очищаем токен и user из localStorage/контекста
		setIsOpen(false); // Закрываем меню
		navigate("/"); // 👈 Опционально: перенаправляем на главную
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
					{/* 👇 Условный рендеринг: вход / выход */}
					{user ? (
						<>
							{/* Показываем имя пользователя (опционально) */}
							<span className="user-greeting">
								{user.email || user.name || "Пользователь"}
							</span>

							{/* Кнопка выхода */}
							<button
								onClick={handleLogoutClick}
								className="btn-logout"
							>
								Выйти
							</button>
						</>
					) : (
						/* Кнопка входа для гостей */
						<button onClick={handleLoginClick}>Войти</button>
					)}

					<button>балланс</button>
				</div>
			</div>
		</div>
	);
}

export default NavigationBar;
