import { useState } from "react";
import SchoolSeatLocation from "../assets/SchoolSeatLocation.jpg";
import styles from "../componets/SeatTransfer.module.css";

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
		} catch (error) {
			console.error(error);
			alert('譲渡する座席の情報を送信できませんでした');
			setStatus('IDLE');
		}
	};

	return (
		<div>
			<div className={styles.seatInfo}>
				<h2>{location}の座席情報</h2>
				<hr />
				{location === "学食" && (
					<img src={SchoolSeatLocation}></img>
				)}
			</div> 
			<p>座席を指定してください:</p>
			{/* ここで座席を決めている */}
			{/* 学食の場合 */}
			{location === "学食" && (
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
			)}

			<div className={styles.idle}>
				{status === 'IDLE' && (
					<button 
						onClick={() => {
							offerSeat()
						}}
						disabled={!selectedSeat}
						className={selectedSeat ? styles.selected : ''}>
						この席を譲る準備をする
					</button>
				)}
				{status === 'WAITING' && <p>希望者を待機中... (席: {selectedSeat}番)</p>}
				{status === 'MATCHED' && (
					<div className={styles.matched}>
						<h3>マッチング成立！</h3>
						<p>希望者がこちらへ向かっています。</p>
					</div>
				)}
			</div>
		</div>
	)
}