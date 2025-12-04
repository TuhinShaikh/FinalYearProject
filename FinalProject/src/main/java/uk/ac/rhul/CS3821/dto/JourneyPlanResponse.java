package uk.ac.rhul.CS3821.dto;

public class JourneyPlanResponse {
    private String origin;
    private String destination;
    private String duration;

    public JourneyPlanResponse() {}

    public JourneyPlanResponse(String origin, String destination, String duration) {
        this.origin = origin;
        this.destination = destination;
        this.duration = duration;
    }

    // getters and setters
}