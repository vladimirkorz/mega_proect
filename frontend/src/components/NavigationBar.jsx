// src/components/NavigationBar.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom"; // Импортируем хук
import { useCart } from "../context/CartContext.jsx";

function NavigationBar() {
	const [isOpen, setIsOpen] = useState(false);
	const navigate = useNavigate(); // Получаем функцию навигации

	// Обработчик клика по "войти": закрывает меню + переходит на /login
	const handleLoginClick = () => {
		setIsOpen(false);
		navigate("/login");
	};
	const { cartCount } = useCart();

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
					<button onClick={handleLoginClick}>войти</button>{" "}
					{/* Клик ведёт на /login */}
					<button>балланс</button>
				</div>
			</div>
		</div>
	);
}

export default NavigationBar;
