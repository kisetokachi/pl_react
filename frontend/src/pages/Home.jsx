import React from "react";
import { useNavigate } from "react-router-dom";

// 簡単なトップページの例（必要に応じて別ファイルに切り出してください）
export default function Home() {
	const navigate = useNavigate()

   return (
     <div style={{ padding: '200px', textAlign: 'center', fontFamily: 'sans-serif' }}>
       <h1>座席マッチングシステムへようこそ</h1>
       <p style={{ padding: '20px' }}>アプリを使用するには以下をクリックしてください</p>
       <button onClick={() => navigate('/match')}
		 			style={{ padding: '10px', fontSize: '18px', backgroundColor: '#328bf6', color: 'white', border: 'none', borderRadius: '10px' }}>
			マッチング画面を開く
       </button>
       <hr />
       <p style={{ padding: '10px' }}>座席マッチングシステムでは、フードコートなどで席に座りたい人と譲りたい人をマッチングさせるサービスを提供しています</p>
     </div>
	);
}