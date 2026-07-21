import React, { useState, useEffect } from "react";
import { SeatRequest } from "../components/SeatRequest";
import { SeatTransfer } from "../components/SeatTransfer";
import Header from "../components/Header";
import styles from "./SeatMatchingApp.module.css";

export default function SeatMatchingApp() {
  const API_BASE_URL = 'http://localhost:8080/api/match';

  const [role, setRole] = useState('NONE'); // 'NONE', 'KIBOU', 'JOTO'
  const [status, setStatus] = useState('IDLE'); // 'IDLE', 'WAITING', 'MATCHED', 'SUBMITTED'
  const [location, setLocation] = useState(null); // 場所の情報
  const [matchedInfo, setMatchedInfo] = useState(null); // マッチング後のデータ
  const [seats, setSeats] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32]);

  // 場所ごとの座席情報を取得する
  const getSeats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        const data = await response.json();
        setSeats(data.seats);
      }
    } catch (error) {
      console.error('座席情報を取得できませんでした', error);
    }
  };

  // 場所の情報を送信する
  const sendLocation = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location: location })
      });
      if (!response.ok) throw new Error('リクエストに失敗しました');
    } catch (error) {
      console.error('場所情報を送信できませんでした', error);
    }
  };

  // 属性選択ボタンが押されたときの処理
  const handleClick = (role) => {
    if (location == null) {
      setRole('NONE');
      alert("場所を選択してください");
    } else {
      setRole(role);
      sendLocation();
      getSeats();
    }
  };

  // ポーリング処理（ステータス監視）
  useEffect(() => {
    let intervalId;

	// マッチング結果の取得
	if (role === 'KIBOU' && status === 'WAITING') {
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
			else setStatus('IDLE'); // マッチングが成立していない場合はもう一回選び直す
		  }
		} catch (error) {
		  console.error('ステータス確認エラー', error);
		}
	  }, 3000); // 3秒ごとに確認
	}

	if (role === 'JOTO' && status === 'SUBMITTED') {
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

  if (role === 'NONE') {
    return (
      <main className={styles.selectionPage}>
      <Header />
      <div className={styles.selectRole}>
        <div className={styles.step}>STEP 1 / 2</div>
        <h1>どこで利用しますか？</h1>
        <p>座席を探す場所を選んでください</p>
        <label htmlFor="location">利用する場所</label>
        <select name="location" id="location" value={location || ''} onChange={(e) => setLocation(e.target.value || null)}>
          <option value="">場所を選択してください</option>
          <option value="学食">学食</option>
          <option value="フードコート">フードコート</option>
        </select>
        <div className={styles.divider}><span>つぎに目的を選択</span></div>
        <div className={styles.selectRoleButton}>
          <button onClick={() => handleClick('KIBOU')} className={styles.selectKibouButton}>
            <span className={styles.roleIcon}>⌕</span><span><b>座席を探す</b><small>空いている席を見つけたい</small></span><i>→</i>
          </button>
          <button onClick={() => handleClick('JOTO')} className={styles.selectJotoButton}>
            <span className={styles.roleIcon}>↗</span><span><b>座席を譲る</b><small>今いる席を誰かに譲りたい</small></span><i>→</i>
          </button>
        </div>
      </div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <Header />
      {role === 'KIBOU' && (
        <SeatRequest location={location} status={status} matchedInfo={matchedInfo} seats={seats} setStatus={setStatus} />
      )}
      {role === 'JOTO' && (
        <SeatTransfer location={location} status={status} seats={seats} setStatus={setStatus} />
      )}
    </main>
  );
}
