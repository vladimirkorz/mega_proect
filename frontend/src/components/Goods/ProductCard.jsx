import { useCart } from "../../context/CartContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx"; // 👈 Импортируем
import { useNavigate } from "react-router-dom"; // 👈 Импортируем

export default function ProductCard({ product }) {
	const { addToCart } = useCart();
	const { user } = useAuth(); // 👈 Получаем пользователя
	const navigate = useNavigate();

	const handleAddToCart = () => {
		if (!user) {
			// 🔐 Если не авторизован
			alert(
				"Пожалуйста, войдите в систему, чтобы добавлять товары в корзину",
			);
			navigate("/login"); // 👈 Перенаправляем на страницу входа
			return;
		}

		// ✅ Если авторизован - добавляем в корзину
		addToCart(product);
	};

	return (
		<div className="product-card">
			<img src={product.image} alt={product.name} />
			<h3>{product.name}</h3>
			<p>{product.price}$</p>
			<p>{product.description}</p>

			{user ? (
				<button onClick={handleAddToCart} className="btn-add-to-cart">
					Выбрать
				</button>
			) : (
				<button
					onClick={handleAddToCart}
					className="btn-login-required"
				>
					Войти чтобы выбрать
				</button>
			)}
		</div>
	);
}
