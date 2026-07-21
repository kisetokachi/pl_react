import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SignUp.module.css";

export default function SignUp() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSignUp = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("パスワードが一致しません");
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                }),
            });

            if (response.ok) {
                alert("新規登録が完了しました");
                navigate("/login");
            } else {
                alert("登録に失敗しました");
            }
        } catch (error) {
            console.error(error);
            alert("サーバーに接続できません");
        }
    };

    return (
        <main className={styles.page}>
        <div className={styles.container}>
            <button className={styles.brand} onClick={() => navigate('/')} aria-label="トップへ戻る"><span>S</span>SeatLink</button>
            <div className={styles.heading}><span>無料ではじめる</span><h1>アカウント作成</h1><p>必要な情報を入力してください</p></div>

            <form onSubmit={handleSignUp} className={styles.form}>
                <div className={styles.inputGroup}>
                    <label htmlFor="name">ユーザー名</label>
                    <input
                        id="name"
                        type="text"
                        placeholder="ユーザー名"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="email">メールアドレス</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="example@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="password">パスワード</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="パスワード"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="confirmPassword">パスワード（確認）</label>
                    <input
                        id="confirmPassword"
                        type="password"
                        placeholder="もう一度入力"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className={styles.signupButton}>
                    新規登録
                </button>
            </form>

            <p className={styles.loginText}>すでにアカウントをお持ちですか？ <button onClick={() => navigate("/login")}>ログイン</button></p>
        </div>
        </main>
    );
}
