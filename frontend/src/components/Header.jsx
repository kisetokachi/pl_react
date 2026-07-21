import styles from "./Header.module.css";
import { useNavigate } from "react-router-dom";

export default function Header() {
	const navigate = useNavigate();
	return (
		<header className={styles.header}>
			<button className={styles.brand} onClick={() => navigate('/')}><span>S</span>SeatLink</button>
			<span className={styles.title}>座席マッチング</span>
			<button className={styles.exit} onClick={() => navigate('/')}>終了</button>
		</header>
	);
}
