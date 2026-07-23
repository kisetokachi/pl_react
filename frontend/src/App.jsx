import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// 作成したページコンポーネントをインポート
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import SeatMatchingApp from './pages/SeatMatchingApp';
import ProtectedRoute from "./components/ProtectedRoute";
import Match from "./pages/SeatMatchingApp"
// import TransferSubmitted from './pages/TransferSubmitted';
// import RequestSended from './components/RequestSended';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* http://localhost:3000/ のときに表示するページ */}
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* http://localhost:3000/match のときに表示するページ */}
        <Route
          path="/match"
          element={
            <ProtectedRoute>
              <Match />
            </ProtectedRoute>
          }
        />
        {/* http://localhost:3000/sended_JOTO のときに表示するページ */}
        {/* <Route path="/sended_JOTO" element={<TransferSubmitted />} /> */}

        {/* http://localhost:3000/sended_KIBOU のときに表示するページ */}
        {/* <Route path="/sended_KIBOU" element={<RequestSended />} /> */}

        {/* 存在しないURLにアクセスされた場合の404ページ */}
        <Route path="*" element={<main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', textAlign: 'center', padding: 24 }}><div><h1>404</h1><p>ページが見つかりません</p></div></main>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
