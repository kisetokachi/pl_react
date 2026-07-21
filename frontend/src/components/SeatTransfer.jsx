import { useState } from "react";
import SchoolSeatLocation from "../assets/SchoolSeatLocation.jpg";
import FoodcourtSeatLocation from "../assets/FoodcourtSeatLocation.jpg";
import styles from "./SeatTransfer.module.css";

export function SeatTransfer({location, status, seats, setStatus, matchedInfo}) {
	const [selectedSeat, setSelectedSeat] = useState(0);
	const API_BASE_URL = 'http://localhost:8080/api/match';

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
			alert('譲渡する座席の情報を送信できませんでした');
			setStatus('IDLE');
		}
	};

	return (
		<div className={styles.container}>
			<h2 className={styles['line-title']}>座席を譲る</h2>
			<div className={styles.seatInfo}>
				<h2>{location}の座席情報</h2>
				<hr />
				{location === "学食" && <img src={SchoolSeatLocation} alt="学食の座席図" />}
				{location === "フードコート" && <img src={FoodcourtSeatLocation} alt="フードコートの座席図" />}
			</div> 

			{status === 'IDLE' && <p>座席を指定してください:</p>}
			{status === 'WAITING' && <p style={{color: '#d97706', fontWeight: 'bold'}}>次に座る人が来るまでお待ちください...</p>}

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
				{status !== 'MATCHED' ? (
					<button 
						onClick={offerSeat}
						disabled={!selectedSeat || status === 'WAITING'}
						className={selectedSeat ? styles.selected : ''}
					>
						{status === 'IDLE' && 'この席を譲る準備をする'}
						{status === 'WAITING' && `${selectedSeat}番の席を送信完了（待機中）`}
					</button>
				) : (
					/* 譲る側：マッチング成立通知エリア */
					<div className={styles.matched} style={{padding: '20px', backgroundColor: '#e6ffe6', borderRadius: '8px', marginTop: '15px', border: '2px solid #22c55e'}}>
						<h3 style={{color: '#15803d', margin: 0}}>🎉 マッチング成立！</h3>
						<p style={{marginTop: '8px'}}>希望者が <strong>{selectedSeat || (matchedInfo && matchedInfo.seatNumber)}番</strong> の席に向かっています。お譲りいただきありがとうございました。</p>
					</div>
				)}
			</div>
		</div>
	);
}