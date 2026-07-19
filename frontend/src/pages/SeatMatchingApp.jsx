import React, { useState, useEffect } from "react";
import { SeatRequest } from "../componets/SeatRequest";
import { SeatTransfer } from "../componets/SeatTransfer";
import styles from "./SeatMatchingApp.module.css";

export default function SeatMatchingApp() {
  const API_BASE_URL = 'http://localhost:8080/api/match'; // Spring BootサーバーのURL

  const [role, setRole] = useState('NONE'); // 'NONE', 'KIBOU', 'JOTO'
  const [status, setStatus] = useState('IDLE'); // 'IDLE', 'WAITING', 'MATCHED'
  const [location, setLocation] = useState(null); // 場所の情報
  const [matchedInfo, setMatchedInfo] = useState(null); // マッチング後のデータ
  const [schoolSeats, setSchoolSeats] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]);

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

  // ポーリング処理
  useEffect(() => {
	let intervalId;

	// マッチング結果の取得
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
			else setStatus('IDLE'); // マッチングが成立していない場合はもう一回選び直す
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
	  <div className={styles.selectRole}>
		<h2>座席マッチングシステム</h2>
		<label>場所を選んでください: </label>
			<select name="location"
					id="Location"
					onChange={(e) => setLocation(e.target.value)}>
			  <option value="" value>--- 場所 ---</option>
			  <option value="学食">学食</option>
			  <option value="フードコート">フードコート</option>
			</select>
		<div className={styles.selectRoleButton}>
		  <button 
			onClick={() => {
			  if (location == null)
			  {
				setRole('NONE')
				alert("場所を選択してください")
			  }
			  else setRole('KIBOU')
			}}
			className={styles.selectKibouButton}>
			座席を探す
		  </button>
		  <button 
			onClick={() => {
			  if (location == null)
			  {
				setRole('NONE')
				alert("場所を選択してください")
			  }
			  else setRole('JOTO')
			}}
			className={styles.selectJotoButton}>
			座席を譲る
		  </button>
		</div>
	  </div>
	);
  }

  // 2. メイン画面
  return (
	<div className={styles.main}>
	  <header>
		{/* <strong>{role === 'KIBOU' ? '座席を探す' : '座席を譲る'}</strong> */}
		<strong>座席マッチングアプリ</strong>
	  </header>

	  {/* (座席希望者) の画面 */}
	  {role === 'KIBOU' && (
		<SeatRequest location={location} status={status} matchedInfo={matchedInfo} seats={schoolSeats} setStatus={setStatus} />
	  )}

	  {/* (座席譲渡者) の画面 */}
	  {role === 'JOTO' && (
		<SeatTransfer location={location} status={status} seats={schoolSeats} setStatus={setStatus} />
	  )}
	</div>
  );
}