import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";

// 簡単なトップページの例（必要に応じて別ファイルに切り出してください）
export default function Home() {
	const navigate = useNavigate()

	return (
		<div className={styles.container}>
			<h1>座席マッチングシステムへようこそ</h1>
			<p className={styles.target}>アプリを使用するには以下をクリックしてください</p>
			<button onClick={() => navigate('/login')}>
				マッチング画面を開く(ログイン)
			</button>
			<hr />
			<p className={styles.explanation}>座席マッチングシステムでは、フードコートなどで席に座りたい人と譲りたい人をマッチングさせるサービスを提供しています</p>
    	</div>
	);
}