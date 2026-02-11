// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Добавляем импорт
import "../App.css";

export default function Registration() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate(); // Хук для возврата

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log("Вход:", { email, password });
		// После успешного входа: navigate("/");
	};

	return (
		<div
			className="login-container"
			style={{ padding: "50px", maxWidth: "400px", margin: "0 auto" }}
		>
			<h2>Создание  аккаунта</h2>
			<form onSubmit={handleSubmit}>
								<input
					className="login-input"
					placeholder="Имя"
					type="text"
				/>
				<input
					className="login-input"
					placeholder="Почта"
					type="text"
				/>
				<input
					className="login-input"
					placeholder="Пароль"
					type="text"
				/>
				<button type="submit">Создать</button>
			</form>

			{/* Кнопка возврата на главную */}
			<button type="button" onClick={() => navigate("/")}>
				← Вернуться на главную
			</button>
			<p>Есть аккаунт?</p><a href="/Login">Войти</a>
		</div>
	);
}
