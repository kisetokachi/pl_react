import React, { useState, useEffect } from "react";
import { SeatRequest } from "../componets/SeatRequest";
import { SeatTransfer } from "../componets/SeatTransfer";

export default function SeatMatchingApp() {
	const [role, setRole] = useState('NONE'); // 'NONE', 'KOU' (甲), 'OTSU' (乙)
  const [status, setStatus] = useState('IDLE'); // 'IDLE', 'WAITING', 'MATCHED'
  const [location, setLocation] = useState(null);
  const [matchedInfo, setMatchedInfo] = useState(null);

  {/*
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
  */}

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
        <label>場所を選んでください: </label>
            <select name="location"
                    id="Location"
                    onChange={(e) => setLocation(e.target.value)}
                    style={{width: '150px', height: '30px', borderRadius: '10px', textAlign: 'center', marginTop: '20px'}}>
              <option value="" value>--- 場所 ---</option>
              <option value="学食">学食</option>
              <option value="フードコート">フードコート</option>
            </select>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '40px' }}>
          <button 
            onClick={() => {
              if (location == null)
              {
                setRole('NONE')
                alert("場所を選択してください")
              }
              else setRole('KOU')
            }}
            style={{ padding: '20px', fontSize: '18px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '10px' }}>
            座席を探す
          </button>
          <button 
            onClick={() => {
              if (location == null)
              {
                setRole('NONE')
                alert("場所を選択してください")
              }
              else setRole('OTSU')
            }}
            style={{ padding: '20px', fontSize: '18px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '10px' }}>
            座席を譲る
          </button>
        </div>
      </div>
    );
  }

  // 2. メイン画面
  return (
    <div style={{ fontFamily: 'sans-serif', padding: '10px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f3f4f6', padding: '10px', borderRadius: '8px', marginBottom: '15px', border: '2px solid #333' }}>
        <strong>{role === 'KOU' ? '座席を探す' : '座席を譲る'}</strong>
      </header>

      {/* 甲 (座席希望者) の画面 */}
      {role === 'KOU' && (
        <SeatRequest location={location} status={status} matchedInfo={matchedInfo} setStatus={() => setStatus} />
      )}

      {/* 乙 (座席譲渡者) の画面 */}
      {role === 'OTSU' && (
        <SeatTransfer location={location} status={status} setStatus={() => setStatus} />
      )}
    </div>
  );
}