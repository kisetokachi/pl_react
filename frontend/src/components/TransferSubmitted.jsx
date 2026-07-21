import Header from "./Header"
import styles from "./TransferSubmitted.module.css"

export default function TransferSubmitted() {
	return (
		<div>
			<div className={styles.strings}>
				<h2>譲渡する座席を登録できました</h2>
				<hr />
				<p>次の座る人が来るまでお待ちください...</p>
			</div>
		</div>
	);
}