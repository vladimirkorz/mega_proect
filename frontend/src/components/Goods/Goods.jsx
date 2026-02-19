import ProductCard from "./ProductCard.jsx"; // 👈 Импортируем карточку из соседнего файла

export default function Goods({ onAddToCart }) {
	const products = [
		{
			id: 1,
			name: "Телефон Super X",
			price: 100,
			image: "./src/assets/телефон.jpg",
			description: "описание",
		},
		// ... другие товары
	];

	return (
		<section className="goods-section">
			{products.map((product) => (
				<ProductCard
					key={product.id}
					product={product}
					onAddToCart={onAddToCart}
				/>
			))}
		</section>
	);
}
