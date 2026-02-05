import React, { useState } from "react";

function Search() {
	const [isActive, setIsActive] = useState(false);

	const handleClick = () => {
		setIsActive((prev) => !prev);
	};

	return (
		<input
			className="Search"
			type="text"
			onClick={handleClick}
			placeholder={isActive ? "Активен" : "Не активен"}
		/>
	);
}

export default Search;
