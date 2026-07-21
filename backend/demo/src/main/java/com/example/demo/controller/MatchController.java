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

    private final Map<Integer, SeatOfferRequest> activeOffers = new ConcurrentHashMap<>();
    private final Map<String, Map<String, Object>> matchResults = new ConcurrentHashMap<>();
    private String currentLocation = "学食";

    @PostMapping
    public ResponseEntity<Map<String, String>> receiveLocation(@RequestBody LocationRequest request) {
        if (request.getLocation() != null) {
            this.currentLocation = request.getLocation();
        }
        System.out.println("【場所設定】選択された場所: " + this.currentLocation);

        Map<String, String> response = new HashMap<>();
        response.put("status", "SUCCESS");
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<SeatsResponse> getAllSeats() {
        List<Integer> allSeats = new ArrayList<>();
        for (int i = 1; i <= 32; i++) {
            allSeats.add(i);
        }
        return ResponseEntity.ok(new SeatsResponse(allSeats));
    }

    @PostMapping("/offer")
    public ResponseEntity<Map<String, String>> offerSeat(@RequestBody SeatOfferRequest request) {
        System.out.println("【座席譲渡登録】場所: " + request.getLocation() + " | 席番号: " + request.getSeatNumber());

        // 新規オファー時に古いJOTO通知データをリセット
        matchResults.remove("JOTO");

        activeOffers.put(request.getSeatNumber(), request);

        Map<String, String> response = new HashMap<>();
        response.put("status", "SUCCESS");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/request")
    public ResponseEntity<PossibleSeatsResponse> getPossibleSeats() {
        List<Integer> seats = new ArrayList<>(activeOffers.keySet());
        return ResponseEntity.ok(new PossibleSeatsResponse(seats));
    }

    @PostMapping("/request")
    public ResponseEntity<Map<String, String>> requestSeat(@RequestBody SeatRequestDto request) {
        System.out.println("【座席希望リクエスト】希望席: " + request.getSeatNumber());

        // 新規リクエスト時に古いKIBOU通知データをリセット
        matchResults.remove("KIBOU");

        Integer seatNum = request.getSeatNumber();

        if (seatNum != null && activeOffers.containsKey(seatNum)) {
            SeatOfferRequest offer = activeOffers.remove(seatNum);

            Map<String, Object> details = new HashMap<>();
            details.put("location", offer.getLocation() != null ? offer.getLocation() : currentLocation);
            details.put("seatNumber", offer.getSeatNumber());

            matchResults.put("JOTO", details);
            matchResults.put("KIBOU", details);
        }

        Map<String, String> response = new HashMap<>();
        response.put("status", "SUCCESS");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/status")
    public ResponseEntity<StatusCheckResponse> checkStatus(@RequestParam("role") String role) {
        if (matchResults.containsKey(role)) {
            Map<String, Object> details = matchResults.remove(role);
            return ResponseEntity.ok(new StatusCheckResponse(true, details));
        }

        return ResponseEntity.ok(new StatusCheckResponse(false, null));
    }
}