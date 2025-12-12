package uk.ac.rhul.CS3821.dto;

// Models a disruption that might be shown alongside the TfL status UI
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