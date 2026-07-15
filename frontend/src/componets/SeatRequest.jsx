import SchoolSeatLocation from "../assets/SeatLocation.png";
import styles from "../componets/SeatRequest.module.css";

export function SeatRequest({location, status, matchedInfo, setStatus}) {
	const API_BASE_URL = 'http://localhost:8080/api/match'; // Spring BootサーバーのURL

	// 座りたいリクエストを送信
	const requestSeat = async () => {
		setStatus('WAITING');
		try {
			const response = await fetch(`${API_BASE_URL}/request`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ userId: 'user-kou-123' }) // 実際の環境では認証情報などを使用
			});
			if (!response.ok) throw new Error('リクエストに失敗しました');
		} catch (error) {
			console.error(error);
			setStatus('IDLE');
			alert('通信エラーが発生しました。');
		}
	};

	return (
		<div className={styles.container}>
			{status === 'IDLE' && (
				<div className={styles.idle}>
					<h2 >{location}の座席情報</h2>
					<hr />
					{location === "学食" && (
						<img src={SchoolSeatLocation}></img>
					)}
					<hr />
					<button onClick={requestSeat}>
						座席を希望
					</button>
				</div>
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