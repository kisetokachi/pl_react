package com.example.login.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // 全てのパスに対して適用
                // 許可する送信元オリジン（React開発サーバー）
                .allowedOrigins("http://localhost:3000") 
                // 許可するHTTPメソッドを全て書き出す
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS") 
                // 許可するリクエストヘッダーを全て書き出す
                .allowedHeaders("Authorization", "Content-Type", "X-Requested-With", "Accept", "Origin") 
                // ブラウザ側が読み取ることを許可するレスポンスヘッダー
                .exposedHeaders("Authorization") 
                // 認証情報（CookieやJWT）のやり取りを許可
                .allowCredentials(true) 
                // Preflightリクエストの結果をキャッシュする時間（1時間）
                .maxAge(3600); 
    }
}
