import Header from "./Header"

export default function RequestSended({matchedInfo}) {
	return (
		<div>
			<h2>希望の座席はマッチングされました</h2>
			<div>
				<p>場所：　{matchedInfo.matchDetails.location}</p>
				<p>座席番号：　{matchedInfo.matchDetails.setNumber}番</p>
			</div>
			<h2>座席に移動してください</h2>
		</div>
	);
}