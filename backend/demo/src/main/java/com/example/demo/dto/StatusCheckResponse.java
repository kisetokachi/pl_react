package com.example.demo.dto;

import java.util.Map;

public class StatusCheckResponse {
    private boolean isMatched;
    private Map<String, Object> matchDetails;

    public StatusCheckResponse(boolean isMatched, Map<String, Object> matchDetails) {
        this.isMatched = isMatched;
        this.matchDetails = matchDetails;
    }

    public boolean isIsMatched() { return isMatched; }
    public void setIsMatched(boolean isMatched) { this.isMatched = isMatched; }

    public Map<String, Object> getMatchDetails() { return matchDetails; }
    public void setMatchDetails(Map<String, Object> matchDetails) { this.matchDetails = matchDetails; }
}