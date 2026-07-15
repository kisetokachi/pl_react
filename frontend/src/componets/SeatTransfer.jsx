import { useState } from "react";
import SchoolSeatLocation from "../assets/SeatLocation.png";

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
			<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: 'whitesmoke', borderRadius: '20px', border: '2px solid #333', marginBottom: '20px' }}>
				<h2 style={{marginTop: '10px'}}>{location}の座席情報</h2>
				<hr style={{ width: '20cm' }} />
				{location === "学食" && (
					<img src={SchoolSeatLocation} style={{ width: '700px', marginBottom: '10px', borderRadius: '20px' }}></img>
				)}
			</div> 
			<p>座席を指定してください:</p>
			{/* ここで座席を決めている */}
			{/* 学食の場合 */}
			{location === "学食" && (
				<div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '7px' }}>
					{schoolSeats.map(seat => (
					<button
						key={seat}
						disabled={status !== 'IDLE'}
						onClick={() => {setSelectedSeat(seat)}}
						style={{
							width: '160px',
							height: '50px',
							backgroundColor: selectedSeat === seat ? '#10b981' : '#fff',
							color: selectedSeat === seat ? 'white' : 'black',
							border: '1px solid #ccc',
							borderRadius: '5px'
						}}
					>
						{seat}
					</button>
					))}
				</div>
			)}

			<div style={{ marginTop: '30px', textAlign: 'center' }}>
				{status === 'IDLE' && (
					<button 
						onClick={() => {
							offerSeat()
							// console.log("送信ボタンが押されました")
						}}
						disabled={!selectedSeat}
						style={{ padding: '15px 30px', backgroundColor: selectedSeat ? '#10b981' : '#d1d5db', color: 'white', border: 'none', borderRadius: '10px', width: '100%' }}>
						この席を譲る準備をする
					</button>
				)}
				{status === 'WAITING' && <p>希望者を待機中... (席: {selectedSeat}番)</p>}
				{status === 'MATCHED' && (
					<div style={{ padding: '20px', backgroundColor: '#d1fae5', borderRadius: '10px' }}>
						<h3>マッチング成立！</h3>
						<p>希望者がこちらへ向かっています。</p>
					</div>
				)}
			</div>
		</div>
	)
}