package uk.ac.rhul.CS3821.dto;

/**
 * Compact response payload for journey-planning summaries.
 */
public class JourneyPlanResponse {
    private String origin;
    private String destination;
    private String duration;

    /**
     * Default constructor for serialization/deserialization.
     */
    public JourneyPlanResponse() {}

    /**
     * Creates a journey summary response.
     *
     * @param origin journey origin
     * @param destination journey destination
     * @param duration journey duration string
     */
    public JourneyPlanResponse(String origin, String destination, String duration) {
        this.origin = origin;
        this.destination = destination;
        this.duration = duration;
    }
}