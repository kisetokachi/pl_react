import { useState } from "react";
import clsx from 'clsx';
import styles from "../componets/SeatRequestButton.module.css";

export default function SeatRequestButton({location, status, seats, possibleSeats, setStatus}) {
	const API_BASE_URL = 'http://localhost:8080/api/match'; // Spring BootサーバーのURL

	const [selectedSeat, setSelectedSeat] = useState(0);

	// 座りたいリクエストを送信
	const requestSeat = async (seat) => {
		setStatus('WAITING');
		try {
			const response = await fetch(`${API_BASE_URL}/request`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					userId: 'user-kou-123', // 実際の環境では認証情報などを使用
					seatNumber: seat
				})
			});
			if (!response.ok) throw new Error('リクエストに失敗しました');
		} catch (error) {
			console.error(error);
			alert('希望する座席の情報を送信できませんでした');
			setStatus('IDLE');
		}
	};

	return (
		<>
			<div className={styles.buttons}>
				{status === 'IDLE' && <p>座りたい座席を指定してください:</p>}
				{status === 'WAITING' && <p>マッチング結果を受信中ですのでお待ちください...</p>}
				<div className={styles.seats}>
					{seats.map(seat => (
						<button key={seat}
								disabled={!possibleSeats.includes(seat)}
								onClick={() => {setSelectedSeat(seat)}}
								className={clsx(
									possibleSeats.includes(seat) && styles.included,
									seat === selectedSeat && styles.selected
								)}>
							{seat}
						</button>
					))}
				</div>
			</div>

			<div className={styles.sending}>
				<button onClick={() => {requestSeat(selectedSeat)}} disabled={!selectedSeat} className={selectedSeat ? styles.selected : ''}>
					{status === 'IDLE' && 'この座席を希望する'}
					{status === 'WAITING' && '希望の座席を送信完了'}
				</button>
			</div>
		</>
	)
}