// src/components/NavigationBar.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Импортируем хук

function NavigationBar() {
	const [isOpen, setIsOpen] = useState(false);
	const navigate = useNavigate(); // Получаем функцию навигации

	// Обработчик клика по "войти": закрывает меню + переходит на /login
	const handleLoginClick = () => {
		setIsOpen(false);
		navigate("/login");
	};

	return (
		<div className="navigationBar">
			<button>корзина</button>
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
