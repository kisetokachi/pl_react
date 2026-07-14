package com.example.login.util;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;
import java.util.Date;
@Component
public class JwtUtil {
// 実際の運用では環境変数や設定ファイルから取得し、より長い安全なキーを使用してください
private final String SECRET_KEY = "your_secret_key_your_secret_key_your_secret_key";
private final long EXPIRATION_TIME = 86400000; // 24時間 (ミリ秒単位)
public String generateToken(String username) {
return Jwts.builder()
.setSubject(username)
.setIssuedAt(new Date())
.setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
.signWith(SignatureAlgorithm.HS256, SECRET_KEY.getBytes())
.compact();
}
}