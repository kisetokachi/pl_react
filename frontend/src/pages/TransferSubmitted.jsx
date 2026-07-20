import Header from "../components/Header"
import styles from "./TransferSubmitted.module.css"

export default function TransferSubmitted() {
	return (
		<div>
			<Header />
			<div className={styles.strings}>
				<h2>譲渡する座席を登録できました</h2>
				<hr />
				<p>次に座る人が来るまでお待ちください...</p>
			</div>
		</div>
	);
}