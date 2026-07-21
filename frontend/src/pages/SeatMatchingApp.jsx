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
  
  // 初期値は空配列にしておき、サーバーから送られてきたデータで上書きします
  const [seats, setSeats] = useState([]);

  // 1. 場所ごとの座席情報をサーバーから取得する（locationをクエリパラメータで渡す）
  const getSeats = async (selectedLocation) => {
    try {
      const response = await fetch(`${API_BASE_URL}?location=${encodeURIComponent(selectedLocation)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        const data = await response.json();
        // サーバーから返ってきた座席配列をセット
        setSeats(data.seats);
      }
    } catch (error) {
      console.error('座席情報を取得できませんでした', error);
    }
  };

  // 2. 選ばれた場所の情報をサーバーに送信する
  const sendLocation = async (selectedLocation) => {
    try {
      const response = await fetch(`${API_BASE_URL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location: selectedLocation })
      });
      if (!response.ok) throw new Error('リクエストに失敗しました');
    } catch (error) {
      console.error('場所情報を送信できませんでした', error);
    }
  };

  // 3. 属性選択ボタンが押されたときの処理（async化して順番に処理を行う）
  const handleClick = async (selectedRole) => {
    if (!location) {
      setRole('NONE');
      alert("場所を選択してください");
      return;
    }

    setRole(selectedRole);
    
    // ① サーバーへ場所を送信
    await sendLocation(location);
    // ② 選択された場所に対応する座席情報を取得
    await getSeats(location);
  };

  // ポーリング処理（ステータス監視）
  useEffect(() => {
    let intervalId;

    if (role === 'KIBOU' && status === 'WAITING') {
      intervalId = setInterval(async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/status?role=${role}`);
          if (response.ok) {
            const data = await response.json();
            if (data.isMatched) {
              setStatus('MATCHED');
              setMatchedInfo(data.matchDetails);
            } else {
              setStatus('IDLE');
            }
          }
        } catch (error) {
          console.error('ステータス確認エラー', error);
        }
      }, 3000);
    }

    if (role === 'JOTO' && status === 'SUBMITTED') {
      intervalId = setInterval(async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/status?role=${role}`);
          if (response.ok) {
            const data = await response.json();
            if (data.isMatched) {
              setStatus('MATCHED');
              setMatchedInfo(data.matchDetails);
            }
          }
        } catch (error) {
          console.error('ステータス確認エラー', error);
        }
      }, 3000);
    }

    return () => clearInterval(intervalId);
  }, [status, role]);

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

  return (
    <div className={styles.main}>
      <Header />
      {role === 'KIBOU' && (
        <SeatRequest location={location} status={status} matchedInfo={matchedInfo} seats={seats} setStatus={setStatus} />
      )}
      {role === 'JOTO' && (
        <SeatTransfer location={location} status={status} seats={seats} setStatus={setStatus} />
      )}
    </div>
  );
}