import { useCart } from "../../context/CartContext.jsx";

export default function ProductCard({ product, onAddToCart }) {
	return (
		<div className="product-card">
			<img src={product.image} alt={product.name} />
			<h3>{product.name}</h3>
			<p>{product.price}$</p>
			<p>{product.description}</p>
			<button onClick={() => onAddToCart(product)}>Выбрать</button>
		</div>
	);
}
