package com.example.demo.dto;

public class SeatRequestDto {
    private String userId;
    private Integer seatNumber;
    private String location;

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public Integer getSeatNumber() { return seatNumber; }
    public void setSeatNumber(Integer seatNumber) { this.seatNumber = seatNumber; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
}