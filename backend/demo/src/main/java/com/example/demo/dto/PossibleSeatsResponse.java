package com.example.demo.dto;

import java.util.List;

public class PossibleSeatsResponse {
    private List<Integer> possibleSeats;

    public PossibleSeatsResponse(List<Integer> possibleSeats) {
        this.possibleSeats = possibleSeats;
    }

    public List<Integer> getPossibleSeats() { return possibleSeats; }
    public void setPossibleSeats(List<Integer> possibleSeats) { this.possibleSeats = possibleSeats; }
}