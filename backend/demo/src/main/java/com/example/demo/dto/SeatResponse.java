package com.example.demo.dto;

import java.util.List;

public class SeatResponse {
    private List<Integer> possibleSeats;

    public SeatResponse(List<Integer> possibleSeats) {
        this.possibleSeats = possibleSeats;
    }

    public List<Integer> getPossibleSeats() { return possibleSeats; }
    public void setPossibleSeats(List<Integer> possibleSeats) { this.possibleSeats = possibleSeats; }
}