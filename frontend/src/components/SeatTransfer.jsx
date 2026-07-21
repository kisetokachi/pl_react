import { useState } from "react";
import SchoolSeatLocation from "../assets/SchoolSeatLocation.jpg";
import FoodcourtSeatLocation from "../assets/FoodcourtSeatLocation.jpg";
import TransferSubmitted from "./TransferSubmitted";
import styles from "./SeatTransfer.module.css";

export function SeatTransfer({location, status, seats, setStatus}) {
	const [selectedSeat, setSelectedSeat] = useState(0);
	const API_BASE_URL = 'http://localhost:8080/api/match';

	// 座席を譲るリクエストを送信
	const offerSeat = async () => {
		setStatus('WAITING');
		try {
			const response = await fetch(`${API_BASE_URL}/offer`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					userId: 'user-otsu-456',
					location: location,
					seatNumber: selectedSeat
				})
			});
			if (!response.ok) throw new Error('リクエストに失敗しました');
			setStatus('SUBMITTED');
		} catch (error) {
			console.error(error);
			alert('譲渡する座席の情報を送信できませんでした');
			setStatus('IDLE');
		}
	};

	return (
		<>
			{status === 'IDLE' && (
				<div className={styles.container}>
					<h2 className={styles['line-title']}>座席を譲る</h2>
					<div className={styles.seatInfo}>
						<h2>{location}の座席情報</h2>
						<hr />
						{location === "学食" && (
							<img src={SchoolSeatLocation} alt="学食の座席図" />
						)}
						{location === "フードコート" && (
							<img src={FoodcourtSeatLocation} alt="フードコートの座席図" />
						)}
					</div> 
					<p>座席を指定してください:</p>

					<div className={styles.seats}>
						{seats.map(seat => (
							<button
								key={seat}
								disabled={status !== 'IDLE'}
								onClick={() => setSelectedSeat(seat)}
								className={selectedSeat === seat ? styles.selected : ''}
							>
								{seat}
							</button>
						))}
					</div>

					<div className={styles.idle}>
						<button 
							onClick={offerSeat}
							disabled={!selectedSeat}
							className={selectedSeat ? styles.selected : ''}
						>
							この席を譲る準備をする
						</button>
					</div>
				</div>
			)}

			{/* 座席を送信したときの表示 */}
			{status === 'SUBMITTED' && (
				<TransferSubmitted />
			)}

			{/* マッチング成立したときの表示 */}
			{status === 'MATCHED' && (
				<h2>マッチングが成立しました</h2>
			)}
		</>
	);
}