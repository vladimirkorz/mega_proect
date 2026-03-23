// frontend/src/components/Goods.jsx
function Goods({ goods, onAddToCart }) {
	if (!goods || goods.length === 0) {
		return (
			<div style={{ textAlign: "center", padding: "50px" }}>
				<p>Товары временно отсутствуют</p>
			</div>
		);
	}

	return (
		<div className="goods-container">
			{goods.map((item) => (
				<div key={item.id} className="good-card">
					{item.image && (
						<img 
							src={item.image} 
							alt={item.name}
							onError={(e) => {
								e.target.src = "/placeholder.jpg";
							}}
						/>
					)}
					<h3>{item.name}</h3>
					<p>{item.description}</p>
					<div className="price">{item.price} ₽</div>
					{item.stock > 0 ? (
						<button onClick={() => onAddToCart(item)}>
							В корзину
						</button>
					) : (
						<button disabled>Нет в наличии</button>
					)}
				</div>
			))}
		</div>
	);
}

export default Goods;