import React, { useState, useEffect } from "react";
import SeatLocation from "../assets/SeatLocation.png";

export default function SeatMatchingApp() {
	const [role, setRole] = useState('NONE'); // 'NONE', 'KOU' (甲), 'OTSU' (乙)
  const [status, setStatus] = useState('IDLE'); // 'IDLE', 'WAITING', 'MATCHED'
  const [location, setLocation] = useState('学食');
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [matchedInfo, setMatchedInfo] = useState(null);
  const [seats, setSeats] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);

  const API_BASE_URL = 'http://localhost:8080/api/match'; // Spring BootサーバーのURL

  // --- データのやり取り部分 (Spring Boot APIとの連携) ---

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

  // ログアウト処理
  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/logout`, { method: 'POST' });
    } catch (error) {
      console.error('ログアウト通信エラー:', error);
    } finally {
      setRole('NONE');
      setStatus('IDLE');
      setSelectedSeat(null);
      setMatchedInfo(null);
    }
  };

  // マッチング状態の確認 (ポーリング処理)
  useEffect(() => {
    let intervalId;
    if (status === 'WAITING') {
      intervalId = setInterval(async () => {
        try {
          // 自身の状態をサーバーに確認するエンドポイント
          const response = await fetch(`${API_BASE_URL}/status?role=${role}`);
          if (response.ok) {
            const data = await response.json();
            if (data.isMatched) {
              setStatus('MATCHED');
              setMatchedInfo(data.matchDetails); // { location: '学食', seatNumber: 5 } など
            }
          }
        } catch (error) {
          console.error('ステータス確認エラー', error);
        }
      }, 3000); // 3秒ごとに確認
    }
    return () => clearInterval(intervalId);
  }, [status, role]);

  // --- UI描画部分 ---

  // 1. 役割選択画面
  if (role === 'NONE') {
    return (
      <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <h2>座席マッチングシステム</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '40px' }}>
          <button 
            onClick={() => setRole('KOU')}
            style={{ padding: '20px', fontSize: '18px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '10px' }}>
            座席を探す (甲)
          </button>
          <button 
            onClick={() => setRole('OTSU')}
            style={{ padding: '20px', fontSize: '18px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '10px' }}>
            座席を譲る (乙)
          </button>
        </div>
      </div>
    );
  }

  // 2. メイン画面
  return (
    <div style={{ fontFamily: 'sans-serif', padding: '10px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f3f4f6', padding: '10px', borderRadius: '8px', marginBottom: '20px' }}>
        <strong>{role === 'KOU' ? '座席を探す' : '座席を譲る'}</strong>
        {/*
        <button onClick={handleLogout} style={{ padding: '5px 10px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '5px' }}>
          ログアウト
        </button>
        */}
      </header>

      {/* 甲 (座席希望者) の画面 */}
      {role === 'KOU' && (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          {status === 'IDLE' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: 'whitesmoke', borderRadius: '20px' }}>
              <h2 style={{marginTop: '10px'}}>{location}の座席情報</h2>
              <hr style={{ width: '20cm' }} />
              <img src={SeatLocation} style={{ width: '700px', marginBottom: '10px', borderRadius: '20px' }}></img>
              <hr style={{ width: '20cm' }} />
              <button onClick={requestSeat}
                      style={{ width: '150px', height: '150px', borderRadius: '50%', backgroundColor: '#3b82f6', color: 'white', fontSize: '20px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}}>
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
      )}

      {/* 乙 (座席譲渡者) の画面 */}
      {role === 'OTSU' && (
        <div>
          <div style={{ marginBottom: '20px' }}>
            <label>場所: </label>
            <input 
              type="text" 
              value={location} 
              onChange={(e) => setLocation(e.target.value)}
              style={{ padding: '8px', width: '100%', boxSizing: 'border-box', marginTop: '5px' }}
            />
          </div>
          
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
      )}
    </div>
  );
}