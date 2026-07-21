import SchoolSeatLocation from "../assets/SchoolSeatLocation.jpg";
import FoodcourtSeatLocation from "../assets/FoodcourtSeatLocation.jpg";
import styles from "./SeatRequest.module.css";
import { useState, useEffect } from "react";
import SeatRequestButton from "./SeatRequestButton";

export function SeatRequest({location, status, matchedInfo, seats, setStatus}) {
	const API_BASE_URL = 'http://localhost:8080/api/match';
	const [possibleSeats, setPossibleSeats] = useState([]);

	const getPossibleSeats = async () => {
		try {
			const response = await fetch(`${API_BASE_URL}/request`, {
				method: 'GET',
				headers: { 'Content-Type': 'application/json' }
			});
			if (!response.ok) throw new Error('リクエストに失敗しました');
			const data = await response.json();
			setPossibleSeats(data.possibleSeats || []);
		} catch (error) {
			console.error("空席情報の取得に失敗しました:", error);
		}
	};

	useEffect(() => {
		getPossibleSeats();
		const timer = setInterval(() => {
			getPossibleSeats();
		}, 3000);
		return () => clearInterval(timer);
	}, []);

	return (
		<div className={styles.container}>
			<h2 className={styles['line-title']}>座席を探す</h2>
			<div className={styles.idle}>
				<h2>{location}の座席情報</h2>
				<hr />
				{location === "学食" && <img src={SchoolSeatLocation} alt="学食の座席図" />}
				{location === "フードコート" && <img src={FoodcourtSeatLocation} alt="フードコートの座席図" />}
			</div>
			<SeatRequestButton location={location} status={status} seats={seats} possibleSeats={possibleSeats} setStatus={setStatus} />
		</div>
	);
}