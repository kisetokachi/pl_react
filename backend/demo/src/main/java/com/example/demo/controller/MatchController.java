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

    private final Map<Integer, SeatOfferRequest> StuCafe_activeOffers = new ConcurrentHashMap<>();
    private final Map<Integer, SeatOfferRequest> FoodCourt_activeOffers = new ConcurrentHashMap<>();
    private final Map<String, Map<String, Object>> matchResults = new ConcurrentHashMap<>();
    private String currentLocation = "学食";

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

    @GetMapping
    public ResponseEntity<SeatsResponse> getAllSeats() {
        List<Integer> allSeats = new ArrayList<>();
        int seatnum = 0;
        if (currentLocation.equals("学食")) seatnum = 32;
        else if (currentLocation.equals("フードコート")) seatnum = 30;
        for (int i = 1; i <= seatnum; i++) {
            allSeats.add(i);
        }
        return ResponseEntity.ok(new SeatsResponse(allSeats));
    }

    @PostMapping("/offer")
    public ResponseEntity<Map<String, String>> offerSeat(@RequestBody SeatOfferRequest request) {
        System.out.println("【座席譲渡】場所: " + request.getLocation() + " | 席番号: " + request.getSeatNumber());

        matchResults.remove("JOTO");

        if (request.getSeatNumber() != null) {
            if ("学食".equals(request.getLocation())) StuCafe_activeOffers.put(request.getSeatNumber(), request);
            else if ("フードコート".equals(request.getLocation())) FoodCourt_activeOffers.put(request.getSeatNumber(), request);
            // activeOffers.put(request.getSeatNumber(), request);
        }

        Map<String, String> response = new HashMap<>();
        response.put("status", "SUCCESS");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/request")
    public ResponseEntity<PossibleSeatsResponse> getPossibleSeats(@RequestParam String location) {
        List<Integer> possibleSeats = null;
        if ("学食".equals(location)) possibleSeats = new ArrayList<>(StuCafe_activeOffers.keySet());
        else if ("フードコート".equals(location)) possibleSeats = new ArrayList<>(FoodCourt_activeOffers.keySet());
        return ResponseEntity.ok(new PossibleSeatsResponse(possibleSeats));
    }

    @PostMapping("/request")
    public ResponseEntity<Map<String, String>> requestSeat(@RequestBody SeatRequestDto request) {
        System.out.println("【座席希望】希望席番号: " + request.getSeatNumber());

        matchResults.remove("KIBOU");

        Integer seatNum = request.getSeatNumber();

        if (seatNum != null) {
            SeatOfferRequest offer = null;

            if ("学食".equals(request.getLocation()) && StuCafe_activeOffers.containsKey(seatNum)) offer = StuCafe_activeOffers.remove(seatNum);
            else if ("フードコート".equals(request.getLocation()) && FoodCourt_activeOffers.containsKey(seatNum)) offer = FoodCourt_activeOffers.remove(seatNum); 
        
            Map<String, Object> matchDetails = new HashMap<>();
            matchDetails.put("location", offer.getLocation() != null ? offer.getLocation() : currentLocation);
            matchDetails.put("seatNumber", offer.getSeatNumber()); // seatNumberキー名対応

            matchResults.put("JOTO", matchDetails);
            matchResults.put("KIBOU", matchDetails);    
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