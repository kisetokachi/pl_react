import styles from "./RequestSended.module.css"

export default function RequestSended({matchedInfo}) {
	return (
		<div className={styles.result}>
			<span className={styles.check}>✓</span>
			<h1>マッチングしました！</h1>
			<p>以下の座席へ移動してください</p>
			<div className={styles.ticket}>
				<span>{matchedInfo.location}</span>
				<strong>{matchedInfo.seatNumber ?? matchedInfo.setNumber}<small>番</small></strong>
			</div>
		</div>
	);
}
