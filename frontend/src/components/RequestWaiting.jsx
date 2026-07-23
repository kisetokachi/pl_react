import styles from "./RequestWaiting.module.css";

export default function RequestWaiting() {
	return (
		<div className={styles.strings}>
			<h2>マッチングしています...</h2>
			<hr />
			<p>完了するまでお待ちください</p>
		</div>
	);
}