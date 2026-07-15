import { useState } from "react";
import SchoolSeatLocation from "../assets/SeatLocation.png";
import styles from "../componets/SeatTransfer.module.css";

export function SeatTransfer({location, status, setStatus}) {
	const [selectedSeat, setSelectedSeat] = useState(0);
	const [schoolSeats, setSchoolSeats] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]);

	const API_BASE_URL = 'http://localhost:8080/api/match'; // Spring BootサーバーのURL

	// 座席を譲るリクエストを送信
	const offerSeat = async () => {
		if (!selectedSeat) return;
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
		} catch (error) {
			console.error(error);
			setStatus('IDLE');
			alert('通信エラーが発生しました。');
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
					{schoolSeats.map(seat => (
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
							// console.log("送信ボタンが押されました")
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