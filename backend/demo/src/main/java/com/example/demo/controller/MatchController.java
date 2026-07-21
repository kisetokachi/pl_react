package com.example.demo.controller;

import com.example.demo.dto.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/match")
@CrossOrigin(origins = "*")
public class MatchController {

    // 1. 場所と座席リストのセットを管理するMap
    private static final Map<String, List<Integer>> LOCATION_SEATS_MAP = new HashMap<>();

    static {
        // 「学食」の座席セット（1〜32番）
        List<Integer> gakushokuSeats = new ArrayList<>();
        for (int i = 1; i <= 32; i++) {
            gakushokuSeats.add(i);
        }
        LOCATION_SEATS_MAP.put("学食", gakushokuSeats);

        // 「フードコート」の座席セット（1〜20番）
        List<Integer> foodCourtSeats = new ArrayList<>();
        for (int i = 1; i <= 20; i++) {
            foodCourtSeats.add(i);
        }
        LOCATION_SEATS_MAP.put("フードコート", foodCourtSeats);
    }

    // 現在提供されている座席（オファー）のリスト
    private final Map<Integer, SeatOfferRequest> activeOffers = new ConcurrentHashMap<>();
    
    // ロールごとのマッチング成立結果
    private final Map<String, Map<String, Object>> matchResults = new ConcurrentHashMap<>();
    
    // 現在選択されている場所（デフォルト: 学食）
    private String currentLocation = "学食";

    // 1. 場所の保存 (POST /api/match)
    @PostMapping
    public ResponseEntity<Map<String, String>> receiveLocation(@RequestBody LocationRequest request) {
        if (request.getLocation() != null && !request.getLocation().isEmpty()) {
            this.currentLocation = request.getLocation();
        }
        System.out.println("【場所選択】: " + this.currentLocation);

        Map<String, String> response = new HashMap<>();
        response.put("status", "SUCCESS");
        return ResponseEntity.ok(response);
    }

    // 2. 場所に応じた座席リストを取得 (GET /api/match?location=学食)
    @GetMapping
    public ResponseEntity<SeatsResponse> getSeatsByLocation(@RequestParam(value = "location", required = false) String locationParam) {
        // パラメータがなければ直近の場所を使用
        String targetLocation = (locationParam != null && !locationParam.isEmpty()) ? locationParam : this.currentLocation;
        
        // Mapから指定された場所の座席リストを取得（登録されていない場所の場合は空リストを返す）
        List<Integer> seats = LOCATION_SEATS_MAP.getOrDefault(targetLocation, Collections.emptyList());

        System.out.println("【座席取得】場所: " + targetLocation + " -> 座席数: " + seats.size());
        return ResponseEntity.ok(new SeatsResponse(seats));
    }

    // 3. 座席を譲るリクエスト (POST /api/match/offer)
    @PostMapping("/offer")
    public ResponseEntity<Map<String, String>> offerSeat(@RequestBody SeatOfferRequest request) {
        System.out.println("【座席譲渡】場所: " + request.getLocation() + " | 席番号: " + request.getSeatNumber());

        matchResults.remove("JOTO");

        if (request.getSeatNumber() != null) {
            activeOffers.put(request.getSeatNumber(), request);
        }

        Map<String, String> response = new HashMap<>();
        response.put("status", "SUCCESS");
        return ResponseEntity.ok(response);
    }

    // 4. 空席（譲渡可能）リストを取得 (GET /api/match/request)
    @GetMapping("/request")
    public ResponseEntity<PossibleSeatsResponse> getPossibleSeats() {
        List<Integer> possibleSeats = new ArrayList<>(activeOffers.keySet());
        return ResponseEntity.ok(new PossibleSeatsResponse(possibleSeats));
    }

    // 5. 座席を希望するリクエスト (POST /api/match/request)
    @PostMapping("/request")
    public ResponseEntity<Map<String, String>> requestSeat(@RequestBody SeatRequestDto request) {
        System.out.println("【座席希望】希望席番号: " + request.getSeatNumber());

        matchResults.remove("KIBOU");

        Integer seatNum = request.getSeatNumber();

        if (seatNum != null && activeOffers.containsKey(seatNum)) {
            SeatOfferRequest offer = activeOffers.remove(seatNum);

            Map<String, Object> details = new HashMap<>();
            details.put("location", offer.getLocation() != null ? offer.getLocation() : currentLocation);
            details.put("setNumber", offer.getSeatNumber());

            matchResults.put("JOTO", details);
            matchResults.put("KIBOU", details);
        }

        Map<String, String> response = new HashMap<>();
        response.put("status", "SUCCESS");
        return ResponseEntity.ok(response);
    }

    // 6. ポーリング用ステータス確認 (GET /api/match/status?role=JOTO または KIBOU)
    @GetMapping("/status")
    public ResponseEntity<StatusCheckResponse> checkStatus(@RequestParam("role") String role) {
        if (matchResults.containsKey(role)) {
            Map<String, Object> details = matchResults.remove(role);
            return ResponseEntity.ok(new StatusCheckResponse(true, details));
        }

        return ResponseEntity.ok(new StatusCheckResponse(false, null));
    }
}