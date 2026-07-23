import styles from "./RequestMatched.module.css"

export default function RequestMatched({matchedInfo}) {
	return (
		<div className={styles.result}>
			<span className={styles.check}>✓</span>
			<h1>マッチングしました！</h1>
			<p>以下の座席へ移動してください</p>
			<div className={styles.ticket}>
				<span>{matchedInfo.location}</span>
				<strong>{matchedInfo.seatNumber}<small>番</small></strong>
			</div>
		</div>
	);
}
