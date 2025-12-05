package uk.ac.rhul.CS3821.dto;

public class Disruption {
    private String line;
    private String status;

    public Disruption() {}

    public Disruption(String line, String status) {
        this.line = line;
        this.status = status;
    }

    // getters and setters
}