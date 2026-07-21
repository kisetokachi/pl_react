import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";

export default function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            });

            if (response.ok) {
                alert("ログイン成功");
                navigate("/match");
            } else {
                alert("メールアドレスまたはパスワードが違います");
            }
        } catch (error) {
            console.error(error);
            alert("サーバーに接続できません");
        }
    };

    return (
        <div className={styles.container}>
            <h1>ログイン</h1>

            <form onSubmit={handleLogin} className={styles.form}>
                <div className={styles.inputGroup}>
                    <label>メールアドレス</label>
                    <input
                        type="email"
                        value={email}
                        placeholder="example@example.com"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label>パスワード</label>
                    <input
                        type="password"
                        value={password}
                        placeholder="パスワード"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className={styles.loginButton}>
                    ログイン
                </button>
            </form>

            <p className={styles.registerText}>
                アカウントをお持ちでない方
            </p>

            <button
                className={styles.registerButton}
                onClick={() => navigate("/signup")}
            >
                新規登録
            </button>

            <button
                className={styles.backButton}
                onClick={() => navigate("/")}
            >
                トップへ戻る
            </button>
        </div>
    );
}