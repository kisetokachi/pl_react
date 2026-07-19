package com.example.demo.dto;

public class SeatOfferRequest {
    private String userId;
    private String location;
    private int seatNumber;

    // ゲッター・セッター
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public int getSeatNumber() { return seatNumber; }
    public void setSeatNumber(int seatNumber) { this.seatNumber = seatNumber; }
}