package com.example.demo.controller;

import com.example.demo.dto.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/match")
@CrossOrigin(origins = "*") // CORSエラー防止
public class MatchController {

    // 現在のオファー情報（キー：席番号）
    private final Map<Integer, SeatOfferRequest> activeOffers = new ConcurrentHashMap<>();

    // マッチング成立済みの記録（キー：ロール）
    private final Map<String, Map<String, Object>> matchResults = new ConcurrentHashMap<>();

    // 1. 【譲る側】座席を譲るリクエスト (POST /api/match/offer)
    @PostMapping("/offer")
    public ResponseEntity<Map<String, String>> offerSeat(@RequestBody SeatOfferRequest request) {
        System.out.println("【座席譲渡登録】場所: " + request.getLocation() + " | 席: " + request.getSeatNumber());

        // オファー情報を保持
        activeOffers.put(request.getSeatNumber(), request);

        Map<String, String> response = new HashMap<>();
        response.put("status", "SUCCESS");
        return ResponseEntity.ok(response);
    }

    // 2. 【探す側】譲渡可能な空席一覧を取得 (GET /api/match/request)
    @GetMapping("/request")
    public ResponseEntity<PossibleSeatsResponse> getPossibleSeats() {
        // 現在提供されている席番号のリストを返す
        List<Integer> seats = new ArrayList<>(activeOffers.keySet());
        return ResponseEntity.ok(new PossibleSeatsResponse(seats));
    }

    // 3. 【探す側】座席を希望するリクエスト (POST /api/match/request)
    @PostMapping("/request")
    public ResponseEntity<Map<String, String>> requestSeat(@RequestBody SeatRequestDto request) {
        System.out.println("【座席希望登録】希望席: " + request.getSeatNumber());

        Integer seatNum = request.getSeatNumber();

        // 該当するオファーが存在すればマッチング成立！
        if (seatNum != null && activeOffers.containsKey(seatNum)) {
            SeatOfferRequest offer = activeOffers.remove(seatNum); // 一覧から削除

            // マッチング成立情報をセット
            Map<String, Object> details = new HashMap<>();
            details.put("location", offer.getLocation());
            details.put("seatNumber", offer.getSeatNumber());

            // 譲る側(JOTO)と探す側(KIBOU)の両方に成立通知用データを記録
            matchResults.put("JOTO", details);
            matchResults.put("KIBOU", details);
        }

        Map<String, String> response = new HashMap<>();
        response.put("status", "SUCCESS");
        return ResponseEntity.ok(response);
    }

    // 4. 【ポーリング】マッチング状態の確認 (GET /api/match/status?role=KIBOU または JOTO)
    @GetMapping("/status")
    public ResponseEntity<StatusCheckResponse> checkStatus(@RequestParam("role") String role) {
        if (matchResults.containsKey(role)) {
            Map<String, Object> details = matchResults.remove(role);
            // マッチング成立を返却
            return ResponseEntity.ok(new StatusCheckResponse(true, details));
        }

        // 未成立を返却
        return ResponseEntity.ok(new StatusCheckResponse(false, null));
    }
}