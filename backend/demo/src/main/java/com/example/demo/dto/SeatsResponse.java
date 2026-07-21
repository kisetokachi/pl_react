package com.example.demo.dto;

import java.util.List;

public class SeatsResponse {
    private List<Integer> seats;

    public SeatsResponse(List<Integer> seats) {
        this.seats = seats;
    }

    public List<Integer> getSeats() { return seats; }
    public void setSeats(List<Integer> seats) { this.seats = seats; }
}