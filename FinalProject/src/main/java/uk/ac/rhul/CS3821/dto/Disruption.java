package uk.ac.rhul.CS3821.dto;

// I use this DTO to represent one disruption entry in travel status responses.
public class Disruption {
    private String line;
    private String status;

    public Disruption() {}

    public Disruption(String line, String status) {
        this.line = line;
        this.status = status;
    }

    // I keep this class lightweight because it only carries display data.
}