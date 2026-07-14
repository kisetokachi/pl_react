import { useState } from "react";

export function SeatTransfer({status}) {
	const [selectedSeat, setSelectedSeat] = useState(null);
	const [seats, setSeats] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);

	const API_BASE_URL = 'http://localhost:8080/api/match'; // Spring BootサーバーのURL

	// 乙：座席を譲るリクエストを送信
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
		}
	};

	return (
		<div>         
          <p>座席を指定してください:</p>
          {/* ここで座席の配置を決めている */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
            {seats.map(seat => (
              <button 
                key={seat}
                disabled={status !== 'IDLE'}
                onClick={() => setSelectedSeat(seat)}
                style={{
                  padding: '15px',
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

          <div style={{ marginTop: '30px', textAlign: 'center' }}>
            {status === 'IDLE' && (
              <button 
                onClick={offerSeat}
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