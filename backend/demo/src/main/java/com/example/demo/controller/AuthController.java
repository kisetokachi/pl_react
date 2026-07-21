package com.example.demo.controller;

import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.LoginResponse;
import com.example.demo.dto.SignupRequest;
import com.example.demo.dto.SignupResponse;
import com.example.demo.service.UserService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    /**
     * 新規登録
     */
    @PostMapping("/signup")
    public ResponseEntity<SignupResponse> signup(
            @RequestBody SignupRequest request) {

        userService.signup(request);

        return ResponseEntity.ok(
                new SignupResponse("登録が完了しました"));
    }

    /**
     * ログイン
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @RequestBody LoginRequest request) {

        userService.login(request);

        return ResponseEntity.ok(
                new LoginResponse("ログイン成功"));
    }
}