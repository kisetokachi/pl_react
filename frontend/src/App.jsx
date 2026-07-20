import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// 作成したページコンポーネントをインポート
import Home from './pages/Home';
import SeatMatchingApp from './pages/SeatMatchingApp';
import AfterTransfer from './pages/TransferSubmitted';
import TransferSubmitted from './pages/TransferSubmitted';
import RequestSended from './pages/RequestSended';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* http://localhost:3000/ のときに表示するページ */}
        <Route path="/" element={<Home />} />

        {/* http://localhost:3000/match のときに表示するページ */}
        <Route path="/match" element={<SeatMatchingApp />} />

        {/* http://localhost:3000/sended_JOTO のときに表示するページ */}
        <Route path="/sended_JOTO" element={<TransferSubmitted />} />

        {/* http://localhost:3000/sended_KIBOU のときに表示するページ */}
        <Route path="/sended_KIBOU" element={<RequestSended />} />

        {/* 存在しないURLにアクセスされた場合の404ページ */}
        <Route path="*" element={<h2>404 Not Found: ページが見つかりません</h2>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
