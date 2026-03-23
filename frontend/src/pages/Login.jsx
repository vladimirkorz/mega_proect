// frontend/src/pages/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/axios";
import "../App.css";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await api.post("/auth/login", formData);
      
      // Используем login из контекста
      login(response.data.user, response.data.token);
      
      console.log("Вход успешен:", response.data);
      navigate("/");
    } catch (err) {
      console.error("Ошибка входа:", err);
      
      // Обработка ошибок валидации
      if (err.response?.data?.errors) {
        const errorMessages = err.response.data.errors
          .map(e => e.message)
          .join(", ");
        setError(errorMessages);
      } else {
        setError(err.response?.data?.error || "Неверный email или пароль");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container" style={{ padding: "50px", maxWidth: "400px", margin: "0 auto" }}>
      <h2>Вход в аккаунт</h2>

      {error && <p style={{ color: "red", background: "#ffeeee", padding: "10px", borderRadius: "5px" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          className="login-input"
          name="email"
          type="email"
          placeholder="Почта"
          value={formData.email}
          onChange={handleChange}
          required
        />

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

      <button type="button" onClick={() => navigate("/")} style={{ marginTop: "10px" }}>
        ← Вернуться на главную
      </button>

      <p style={{ marginTop: "20px" }}>
        Нет аккаунта? <Link to="/Registration">Зарегистрироваться</Link>
      </p>
    </div>
  );
}