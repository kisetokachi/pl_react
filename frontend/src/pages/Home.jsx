import React from "react";
import { useNavigate } from "react-router-dom";
import heroImage from "../assets/hero.png";
import styles from "./Home.module.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <main className={styles.page}>
      <nav className={styles.nav} aria-label="メインナビゲーション">
        <div className={styles.brand}><span className={styles.logo}>S</span><span>SeatLink</span></div>
        <button className={styles.navButton} onClick={() => navigate('/login')}>ログイン</button>
      </nav>

      <section className={styles.hero}>
        <div className={styles.copy}>
          <span className={styles.badge}>かんたん座席マッチング</span>
          <h1>空いている席を、<br /><em>必要な人へ。</em></h1>
          <p>フードコートや学食で、席を探している人と譲りたい人をスムーズにつなぎます。</p>
          <button className={styles.cta} onClick={() => navigate('/login')}>
            今すぐはじめる <span aria-hidden="true">→</span>
          </button>
          <div className={styles.trust}><span>✓ 登録は無料</span><span>✓ すぐに使える</span></div>
        </div>
        <div className={styles.visual}>
          <div className={styles.blob}></div>
          <img src={heroImage} alt="スマートフォンで座席を探す人" />
          <div className={`${styles.floatCard} ${styles.available}`}><b>12</b><span>空席があります</span></div>
          <div className={`${styles.floatCard} ${styles.matched}`}><span className={styles.check}>✓</span><span><b>マッチしました</b><small>席へ向かいましょう</small></span></div>
        </div>
      </section>

      <section className={styles.features} aria-label="サービスの特徴">
        <article><span>⌕</span><div><h2>席をすぐ探せる</h2><p>リアルタイムの空席情報から選べます</p></div></article>
        <article><span>↗</span><div><h2>席をかんたん譲渡</h2><p>席番号を選ぶだけで登録できます</p></div></article>
        <article><span>⚡</span><div><h2>スピーディーにマッチ</h2><p>成立したらすぐにお知らせします</p></div></article>
      </section>
    </main>
  );
}
