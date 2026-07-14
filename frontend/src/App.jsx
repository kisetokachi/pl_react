import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// 作成したページコンポーネントをインポート
import Home from './pages/Home';
import SeatMatchingApp from './pages/SeatMatchingApp';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* http://localhost:3000/ のときに表示するページ */}
        <Route path="/" element={<Home />} />

        {/* http://localhost:3000/match のときに表示するページ */}
        <Route path="/match" element={<SeatMatchingApp />} />

        {/* 存在しないURLにアクセスされた場合の404ページ */}
        <Route path="*" element={<h2>404 Not Found: ページが見つかりません</h2>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
