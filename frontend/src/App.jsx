import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// 作成したページコンポーネントをインポート
import Home from './pages/Home';
import SeatMatchingApp from './pages/SeatMatchingApp';
import { LoginForm } from './LoginForm'; // ログイン画面をインポート

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 【変更】一番最初のページ (http://localhost:3000/) をログイン画面にする */}
        <Route path="/" element={<LoginForm />} />

        {/* 【追加】ログイン後に遷移するホーム画面のパスを作る */}
        <Route path="/home" element={<Home />} />

        {/* http://localhost:3000/match のときに表示するページ */}
        <Route path="/match" element={<SeatMatchingApp />} />

        {/* 存在しないURLにアクセスされた場合の404ページ */}
        <Route path="*" element={<h2>404 Not Found: ページが見つかりません</h2>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;