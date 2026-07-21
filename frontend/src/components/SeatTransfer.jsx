import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SchoolSeatLocation from "../assets/SchoolSeatLocation.jpg";
import FoodcourtSeatLocation from "../assets/FoodcourtSeatLocation.jpg";
import TransferSubmitted from "./TransferSubmitted";
import styles from "./SeatTransfer.module.css";

export function SeatTransfer({location, status, seats, setStatus}) {
	const [selectedSeat, setSelectedSeat] = useState(0);

	const API_BASE_URL = 'http://localhost:8080/api/match'; // Spring BootサーバーのURL

	// 座席を譲るリクエストを送信
	const offerSeat = async () => {
		setStatus('WAITING');
		try {
			const response = await fetch(`${API_BASE_URL}/offer`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					userId: 'user-otsu-456', // 実際の環境では認証情報などを使用
					location: location,
					seatNumber: selectedSeat
				})
			});
			if (!response.ok) throw new Error('リクエストに失敗しました');
			setStatus('MATCHED');
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
							<img src={SchoolSeatLocation}></img>
						)}
						{location === "フードコート" && (
							<img src={FoodcourtSeatLocation} alt="フードコートの座席図" />
						)}
					</div> 
					{status === 'IDLE' && <p>座席を指定してください:</p>}
					{status === 'WAITING' && <p>譲渡可能な座席を送信しています...</p>}
					{/* ここで座席を決めている */}
					<div className={styles.seats}>
						{seats.map(seat => (
						<button
							key={seat}
							disabled={status !== 'IDLE'}
							onClick={() => {setSelectedSeat(seat)}}
							className={selectedSeat === seat ? styles.selected : ''}
						>
							{seat}
						</button>
						))}
					</div>

					<div className={styles.idle}>
						<button 
							onClick={() => {
								offerSeat()
							}}
							disabled={!selectedSeat}
							className={selectedSeat ? styles.selected : ''}>
							{status === 'IDLE' && 'この席を譲る準備をする'}
							{status === 'WAITING' && `${selectedSeat}番の席を送信完了`}
						</button>
					</div>
				</div>
			)}

			{/* マッチングが成立したときの表示 */}
			{status === 'MATCHED' && (
				<TransferSubmitted />
			)}
		</>
	)
}