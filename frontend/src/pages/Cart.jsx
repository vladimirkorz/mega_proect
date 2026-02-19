import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

export default function Cart() {
	const { cart, removeFromCart, updateQuantity, totalPrice, clearCart } =
		useCart();

	if (cart.length === 0) {
		return (
			<div className="cart-empty">
				<h2>Корзина пуста</h2>
				<Link to="/">← Вернуться к товарам</Link>
			</div>
		);
	}

	return (
		<div className="cart-page">
			<h1>Корзина</h1>

			{cart.map((item) => (
				<div key={item.id} className="cart-item">
					<img src={item.image} alt={item.name} />
					<div>
						<h3>{item.name}</h3>
						<p>
							{item.price}$ × {item.quantity}
						</p>
					</div>
					<div>
						<button
							onClick={() =>
								updateQuantity(item.id, item.quantity - 1)
							}
						>
							-
						</button>
						<button
							onClick={() =>
								updateQuantity(item.id, item.quantity + 1)
							}
						>
							+
						</button>
						<button onClick={() => removeFromCart(item.id)}>
							Удалить
						</button>
					</div>
				</div>
			))}

			<div className="cart-total">
				<strong>Итого: {totalPrice}$</strong>
				<button onClick={clearCart}>Очистить</button>
				<button>Оформить заказ</button>
			</div>

			<Link to="/">← Продолжить покупки</Link>
		</div>
	);
}
