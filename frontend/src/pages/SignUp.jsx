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
        <div className={styles.container}>
            <h1>新規登録</h1>

            <form onSubmit={handleSignUp} className={styles.form}>
                <div className={styles.inputGroup}>
                    <label>ユーザー名</label>
                    <input
                        type="text"
                        placeholder="ユーザー名"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label>メールアドレス</label>
                    <input
                        type="email"
                        placeholder="example@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label>パスワード</label>
                    <input
                        type="password"
                        placeholder="パスワード"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label>パスワード（確認）</label>
                    <input
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

            <button
                className={styles.loginButton}
                onClick={() => navigate("/login")}
            >
                ログイン画面へ
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