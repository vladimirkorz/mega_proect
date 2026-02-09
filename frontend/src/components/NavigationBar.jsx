import { useState } from "react";

function NavigationBar() {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<div className="navigationBar">
			<button>Х закрыть</button>
			<button>наш телеграм</button>
			<div className="dropdown">
				<button id="menuButton" onClick={() => setIsOpen(!isOpen)}>
					Настройки
				</button>
				<div
					id="dropdownContent"
					className={`dropdown-content ${isOpen ? "show" : ""}`}
				>
					<button>войти</button>
					<button>балланс</button>
				</div>
			</div>
		</div>
	);
}

export default NavigationBar;
