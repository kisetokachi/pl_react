package com.example.login.controller;

import com.example.login.dto.LoginRequest;
import com.example.login.dto.AuthResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
// ★ React（3000番）からのアクセスを無条件で全許可します
//@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.OPTIONS})
public class AuthController {

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        // 簡単のため、パスワード等のチェックのみを行うシンプルなロジック
        if ("admin".equals(request.getUsername()) && "password123".equals(request.getPassword())) {
            // トークン生成を一旦ダミーの文字列にするか、既存のjwtUtilをそのまま使う
            return ResponseEntity.ok(new AuthResponse("dummy-jwt-token-for-test"));
        }
        return ResponseEntity.status(401).body("ユーザー名またはパスワードが正しくありません");
    }
}