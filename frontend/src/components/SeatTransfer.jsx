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
					<div className={styles.pageTitle}><span>座席を譲る</span><h1>現在の席を選択</h1><p>{location}で今座っている席を指定してください</p></div>
					<div className={styles.seatInfo}>
						<div className={styles.cardTitle}><h2>{location} 座席マップ</h2><span>座席番号を確認</span></div>
						{location === "学食" && (
							<img src={SchoolSeatLocation} alt="学食の座席図" />
						)}
						{location === "フードコート" && (
							<img src={FoodcourtSeatLocation} alt="フードコートの座席図" />
						)}
					</div> 
					<p className={styles.instruction}>譲る座席を選択してください</p>

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
