import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx"; // 👈 ИМПОРТИРУЕМ useAuth
import "../App.css";

const api = axios.create({
	baseURL: "http://localhost:3000/api",
	headers: { "Content-Type": "application/json" },
});

export default function Login() {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const navigate = useNavigate();
	const { login } = useAuth(); // 👈 ПОЛУЧАЕМ функцию login из контекста

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setIsLoading(true);

		try {
			const response = await api.post("/auth/login", formData);

			// 👇 ВАЖНО: Вызываем login() из контекста, чтобы обновить состояние
			login(response.data.user, response.data.token);

			console.log("Вход успешен:", response.data);
			navigate("/");
		} catch (err) {
			console.error("Ошибка входа:", err);
			setError(err.response?.data?.error || "Неверный email или пароль");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div
			className="login-container"
			style={{ padding: "50px", maxWidth: "400px", margin: "0 auto" }}
		>
			<h2>Вход в аккаунт</h2>

			{error && <p style={{ color: "red" }}>{error}</p>}

			<form onSubmit={handleSubmit}>
				{/* Поле Email */}
				<input
					className="login-input"
					name="email"
					type="email"
					placeholder="Почта"
					value={formData.email}
					onChange={handleChange}
					required
				/>

				{/* Поле Пароль */}
				<input
					className="login-input"
					name="password"
					type="password"
					placeholder="Пароль"
					value={formData.password}
					onChange={handleChange}
					required
				/>

				<button
					type="submit"
					disabled={isLoading}
					style={{ opacity: isLoading ? 0.7 : 1 }}
				>
					{isLoading ? "Вход..." : "Войти"}
				</button>
			</form>

			<button type="button" onClick={() => navigate("/")}>
				← Вернуться на главную
			</button>

			<p>Нет аккаунта?</p>
			<Link to="/Registration">Зарегистрироваться</Link>
		</div>
	);
}
