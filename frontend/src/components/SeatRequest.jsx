import SchoolSeatLocation from "../assets/SchoolSeatLocation.jpg";
import FoodcourtSeatLocation from "../assets/FoodcourtSeatLocation.jpg"
import styles from "./SeatRequest.module.css";
import { useState, useEffect } from "react";
import SeatRequestButton from "./SeatRequestButton";

export function SeatRequest({location, status, matchedInfo, seats, setStatus}) {
	const API_BASE_URL = 'http://localhost:8080/api/match'; // Spring BootサーバーのURL

	// 初期表示は空の配列にしておき、Javaから取得した本物のデータが入るようにします
	const [possibleSeats, setPossibleSeats] = useState([1, 2, 3]);

	const getPossibleSeats = async () => {
		try {
			const response = await fetch(`${API_BASE_URL}/request`, {
				method: 'GET',
				headers: { 'Content-Type': 'application/json' }
			});
			if (!response.ok) throw new Error('リクエストに失敗しました');
			const data = await response.json();
			setPossibleSeats(data.possibleSeats);
		} catch (error) {
			console.error("空席情報の取得に失敗しました:", error);
			// 3秒ごとのタイマー中に毎回ポップアップが出ると画面がフリーズするため、
			// アラートは出さずにブラウザのコンソールログのみに出力させています
		}
	}

	// 🔄 3秒ごとに全自動でJavaに空席を見に行くタイマーの処理
	/*
	useEffect(() => {
		// 1. 画面が開いた瞬間にまず1回チェックする
		getPossibleSeats();

		// 2. 3秒（3000ミリ秒）ごとにずーっとチェックし続けるタイマーをセット
		const timer = setInterval(() => {
			getPossibleSeats();
		}, 3000);

		// 3. 画面が閉じられたり移動した時は、タイマーを安全に止める（お片付け）
		return () => clearInterval(timer);
	}, []);
	*/

	return (
		<div className={styles.container}>
			<h2 className={styles['line-title']}>座席を探す</h2>
			<div className={styles.idle}>
				<h2 >{location}の座席情報</h2>
				<hr />
				{location === "学食" && (
					<img src={SchoolSeatLocation} alt="学食の座席図" />
				)}
				{location === "フードコート" && (
					<img src={FoodcourtSeatLocation} alt="フードコートの座席図" />
				)}
			</div>
			<SeatRequestButton location={location} status={status} seats={seats} possibleSeats={possibleSeats} setStatus={setStatus} />
			
			{/* マッチングが成立したときの表示 */}
			{/* {status === 'MATCHED' && matchedInfo && (
				<div className={styles.matched}>
					<h3>マッチング成立！</h3>
					<p>場所: <strong>{matchedInfo.location}</strong></p>
					<p>座席: <strong>{matchedInfo.seatNumber}番</strong></p>
					<p>速やかに移動してください。</p>
				</div>
			)} */}
		</div>
	)
}