import SchoolSeatLocation from "../assets/SeatLocation.png";

export function SeatRequest({location, status, matchedInfo}) {
	const API_BASE_URL = 'http://localhost:8080/api/match'; // Spring BootサーバーのURL

	// 甲：座りたいリクエストを送信
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
		<div style={{ textAlign: 'center', marginTop: '50px' }}>
			{status === 'IDLE' && (
				<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: 'whitesmoke', borderRadius: '20px' }}>
					<h2 style={{marginTop: '10px'}}>{location}の座席情報</h2>
					<hr style={{ width: '20cm' }} />
					{location === "学食" && (
						<img src={SchoolSeatLocation} style={{ width: '700px', marginBottom: '10px', borderRadius: '20px' }}></img>
					)}
					<hr style={{ width: '20cm' }} />
					<button onClick={requestSeat} style={{ width: '150px', height: '150px', borderRadius: '50%', backgroundColor: '#3b82f6', color: 'white', fontSize: '20px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}}>
						座席を希望
					</button>
				</div>
			)}
			{status === 'WAITING' && <p>近くの譲り手を探しています... (通信中)</p>}
			{status === 'MATCHED' && matchedInfo && (
				<div style={{ padding: '20px', backgroundColor: '#dbeafe', borderRadius: '10px' }}>
					<h3>マッチング成立！</h3>
					<p>場所: <strong>{matchedInfo.location}</strong></p>
					<p>座席: <strong>{matchedInfo.seatNumber}番</strong></p>
					<p>速やかに移動してください。</p>
				</div>
			)}
		</div>
	)
}