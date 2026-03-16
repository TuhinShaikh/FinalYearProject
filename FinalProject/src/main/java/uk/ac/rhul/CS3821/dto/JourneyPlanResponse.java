package uk.ac.rhul.CS3821.dto;

// I use this DTO to return a compact journey summary to the frontend.
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

    // I keep this class minimal because it is just a response shape.
}