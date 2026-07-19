package com.example.demo.controller;

import com.example.demo.dto.SeatOfferRequest;
import com.example.demo.dto.SeatResponse;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/match")
@CrossOrigin(origins = "http://localhost:3000") // Reactのポートに合わせて変更してください
public class MatchController {

    // 譲り手から届いた有効なオファーをメモリ上に保持するリスト（スレッドセーフなリストを使用）
    private final List<SeatOfferRequest> activeOffers = new CopyOnWriteArrayList<>();

    // 1. もらい手側：譲る準備ができている座席番号のリストを取得する (GET)
    @GetMapping("/request")
    public SeatResponse getPossibleSeats() {
        // 現在保持しているオファーから、座席番号(seatNumber)だけを抽出してリストにする
        List<Integer> possibleSeats = activeOffers.stream()
                .map(SeatOfferRequest::getSeatNumber)
                .collect(Collectors.toList());

        return new SeatResponse(possibleSeats);
    }

    // 2. 譲り手側：この席を譲る準備をする (POST)
    @PostMapping("/offer")
    public Map<String, String> offerSeat(@RequestBody SeatOfferRequest offer) {
        // すでに同じ座席のオファーがなければリストに追加する
        boolean alreadyExists = activeOffers.stream()
                .anyMatch(o -> o.getLocation().equals(offer.getLocation()) && o.getSeatNumber() == offer.getSeatNumber());
        
        if (!alreadyExists) {
            activeOffers.add(offer);
            System.out.println("オファーを受理しました: 席番 " + offer.getSeatNumber());
        }

        return Map.of("status", "SUCCESS", "message", "オファーを受け付けました。待機中...");
    }

    // 3. もらい手側：座りたい座席を指定してリクエストを送信 (POST)
    @PostMapping("/request")
    public Map<String, String> requestSeat(@RequestBody Map<String, String> requestBody) {
        String userId = requestBody.get("userId");
        System.out.println("もらい手からリクエストが来ました: " + userId);

        // 本来はここでマッチング相手を特定し、双方の状態をMATCHEDにするロジックが入ります。
        // ここでは通信成功のレスポンスだけをひとまず返します。
        return Map.of("status", "SUCCESS", "message", "マッチング待機リストに入りました。");
    }
}