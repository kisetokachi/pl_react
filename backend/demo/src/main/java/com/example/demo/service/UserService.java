package com.example.demo.service;

import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.SignupRequest;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * 新規登録
     */
    public void signup(SignupRequest request) {

        // メールアドレスの重複チェック
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("このメールアドレスは既に登録されています");
        }

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());

        // パスワードをハッシュ化して保存
        user.setPassword(
                passwordEncoder.encode(request.getPassword()));

        userRepository.save(user);
    }

    /**
     * ログイン
     */
    public void login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("ユーザーが存在しません"));

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {

            throw new RuntimeException("パスワードが違います");
        }

        // JWTをまだ使わないので、ここでは認証成功なら何もしない
    }
}