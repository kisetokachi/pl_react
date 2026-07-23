import FoodcourtSeatLocation from "../assets/FoodcourtSeatLocation.jpg";
import SchoolSeatLocation from "../assets/SchoolSeatLocation.jpg";
import styles from "./RequestMatched.module.css";

export default function RequestMatched({ matchedInfo }) {
    return (
        <>
            <div className={styles.result}>
                <span className={styles.check}>✓</span>

                <h1>マッチングしました！</h1>

                <p>以下の座席へ移動してください</p>

                <div className={styles.ticket}>
                    <span>{matchedInfo.location}</span>

                    <strong>
                        {matchedInfo.seatNumber}
                        <small>番</small>
                    </strong>
                </div>

                {matchedInfo.location === "学食" && (
                    <img
                        className={styles.seatMap}
                        src={SchoolSeatLocation}
                        alt="学食の座席図"
                    />
                )}

                {matchedInfo.location === "フードコート" && (
                    <img
                        className={styles.seatMap}
                        src={FoodcourtSeatLocation}
                        alt="フードコートの座席図"
                    />
                )}
            </div>
        </>
    );
}