import { useState } from "react";
import clsx from 'clsx';
import styles from "./SeatRequestButton.module.css";

export default function SeatRequestButton({status, seats, possibleSeats, setStatus}) {
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
				{status === 'IDLE' && <div className={styles.seatHeader}><b>希望する座席</b><span><i className={styles.open}></i>空席 <i className={styles.unavailable}></i>利用不可</span></div>}
				{status === 'WAITING' && <p className={styles.waiting}>マッチング結果を確認しています…</p>}
				<div className={styles.seats}>
					{seats.map(seat => (
						<button key={seat}
								disabled={!possibleSeats.includes(seat)}
								onClick={() => {
									setSelectedSeat(seat)
								}}
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
					{status === 'IDLE' && (selectedSeat ? `座席 ${selectedSeat} を希望する` : '座席を選択してください')}
					{status === 'WAITING' && '希望の座席を送信完了'}
				</button>
			</div>
		</>
	)
}
