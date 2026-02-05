function StatusBar() {
	let time = "4:20";
	return (
		<div className="StatusBar">
			{time}
			<div>
				<img src="./src/assets/CConection.svg" alt="aboba" />
				<img src="./src/assets/wifi.svg" alt="aboba" />
				<img src="./src/assets/battery-full.svg" alt="aboba" />
			</div>
		</div>
	);
}

export default StatusBar;
