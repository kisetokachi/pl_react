import styles from "../componets/SeatRequestButton.module.css";

export default function SeatRequestButton({location, seats, possibleSeats, setStatus}) {
	const API_BASE_URL = 'http://localhost:8080/api/match'; // Spring BootサーバーのURL

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
		<div className={styles.buttons}>
			<p>座りたい座席を指定してください:</p>
			<div className={styles.seats}>
				{seats.map(seat => (
					<button key={seat}
							disabled={!possibleSeats.includes(seat)}
							onClick={() => requestSeat(seat)}
							className={possibleSeats.includes(seat) ? styles.selected : ''}>
						{seat}
					</button>
				))}
			</div>
		</div>
	)
}