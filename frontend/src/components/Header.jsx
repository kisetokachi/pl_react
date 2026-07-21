import styles from "./Header.module.css";

export default function Header() {
	return (
		<div className={styles.Header}>
			<header>
				<strong>座席マッチングアプリ</strong>
			</header>
		</div>
	);
}