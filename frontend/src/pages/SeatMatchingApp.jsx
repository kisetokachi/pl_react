import React, { useState, useEffect } from "react";
import { SeatRequest } from "../components/SeatRequest";
import { SeatTransfer } from "../components/SeatTransfer";
import Header from "../components/Header";
import styles from "./SeatMatchingApp.module.css";

export default function SeatMatchingApp() {
  const API_BASE_URL = 'http://localhost:8080/api/match';

  const [role, setRole] = useState('NONE'); // 'NONE', 'KIBOU', 'JOTO'
  const [status, setStatus] = useState('IDLE'); // 'IDLE', 'WAITING', 'MATCHED'
  const [location, setLocation] = useState(null);
  const [matchedInfo, setMatchedInfo] = useState(null);
  const [seats, setSeats] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32]);

  // 全座席情報の取得
  const getSeats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        const data = await response.json();
        if (data.seats) setSeats(data.seats);
      }
    } catch (error) {
      console.error('座席情報を取得できませんでした', error);
    }
  };

  // 場所情報の送信
  const sendLocation = async () => {
    try {
      await fetch(`${API_BASE_URL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location: location })
      });
    } catch (error) {
      console.error('場所情報を送信できませんでした', error);
    }
  };

  // 属性選択ボタンクリック時
  const handleClick = (selectedRole) => {
    if (location == null) {
      setRole('NONE');
      alert("場所を選択してください");
    } else {
      setRole(selectedRole);
      sendLocation();
      getSeats();
    }
  };

  // ポーリング処理（マッチング監視）
  useEffect(() => {
    let intervalId;

    if (status === 'WAITING') {
      intervalId = setInterval(async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/status?role=${role}`);
          if (response.ok) {
            const data = await response.json();
            if (data.isMatched) {
              if (role === 'KIBOU') {
                // 💡 席希望側：マッチング成功時は場所・役割選択画面へ戻す
                alert(`【マッチング成立】${data.matchDetails.location}の${data.matchDetails.seatNumber}番席へお向かいください！`);
                setRole('NONE');
                setStatus('IDLE');
                setLocation(null);
              } else if (role === 'JOTO') {
                // 💡 譲る側：マッチング成立通知を表示して終了
                setStatus('MATCHED');
                setMatchedInfo(data.matchDetails);
              }
            } else {
              // 💡 マッチング失敗・未成立時は希望席選択画面へとどまる（IDLEに戻す）
              setStatus('IDLE');
            }
          }
        } catch (error) {
          console.error('ステータス確認エラー', error);
        }
      }, 2000);
    }

    return () => clearInterval(intervalId);
  }, [status, role]);

  // 1. 役割選択画面
  if (role === 'NONE') {
    return (
      <div className={styles.selectRole}>
        <h2>座席マッチングシステム</h2>
        <label>場所を選んでください: </label>
        <select name="location" id="location" onChange={(e) => setLocation(e.target.value)}>
          <option value="">--- 場所 ---</option>
          <option value="学食">学食</option>
          <option value="フードコート">フードコート</option>
        </select>
        <div className={styles.selectRoleButton}>
          <button onClick={() => handleClick('KIBOU')} className={styles.selectKibouButton}>
            座席を探す
          </button>
          <button onClick={() => handleClick('JOTO')} className={styles.selectJotoButton}>
            座席を譲る
          </button>
        </div>
      </div>
    );
  }

  // 2. メイン画面
  return (
    <div className={styles.main}>
      <Header />
      {role === 'KIBOU' && (
        <SeatRequest location={location} status={status} matchedInfo={matchedInfo} seats={seats} setStatus={setStatus} />
      )}
      {role === 'JOTO' && (
        <SeatTransfer location={location} status={status} matchedInfo={matchedInfo} seats={seats} setStatus={setStatus} />
      )}
    </div>
  );
}