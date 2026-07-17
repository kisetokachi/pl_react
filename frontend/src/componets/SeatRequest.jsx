import SchoolSeatLocation from "../assets/SchoolSeatLocation.jpg";
import styles from "../componets/SeatRequest.module.css";
import { useState, useEffect } from "react";
import SeatRequestButton from "./SeatRequestButton";

export function SeatRequest({location, status, matchedInfo, changedSeat, seats, setStatus}) {
	const API_BASE_URL = 'http://localhost:8080/api/match'; // Spring BootサーバーのURL

	const [possibleSeats, setPossibleSeats] = useState([1, 10, 24, 30]);

	const getPossibleSeats = async () => {
		try {
			const response = await fetch(`${API_BASE_URL}/request`, {
				method: 'GET',
				headers: { 'Content-Type': 'application/json' }
			});
			if (!response.ok) throw new Error('リクエストに失敗しました');
			const data = await response.json();
			setPossibleSeats(data.possibleSeats);
			setStatus('IDLE');
		}catch (error) {
			console.error(error);
			setStatus('IDLE');
			alert('通信エラーが発生しました。');
		}
	}

	//useEffect(() => {
	//	getPossibleSeats();
	//}, [changedSeat]);

	return (
		<div className={styles.container}>
			{status === 'IDLE' && (
				<>
					<div className={styles.idle}>
						<h2 >{location}の座席情報</h2>
						<hr />
						{location === "学食" && (
							<img src={SchoolSeatLocation} alt="学食の座席図" />
						)}
					</div>
					<SeatRequestButton location={location} seats={seats} possibleSeats={possibleSeats} setStatus={setStatus} />
				</>
			)}
			{status === 'WAITING' && <p>近くの譲り手を探しています... (通信中)</p>}
			{status === 'MATCHED' && matchedInfo && (
				<div className={styles.matched}>
					<h3>マッチング成立！</h3>
					<p>場所: <strong>{matchedInfo.location}</strong></p>
					<p>座席: <strong>{matchedInfo.seatNumber}番</strong></p>
					<p>速やかに移動してください。</p>
				</div>
			)}
		</div>
	)
}