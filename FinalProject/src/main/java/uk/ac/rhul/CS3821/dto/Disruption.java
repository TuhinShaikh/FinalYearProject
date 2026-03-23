package uk.ac.rhul.CS3821.dto;

/**
 * Lightweight DTO representing a single service disruption.
 */
public class Disruption {
    private String line;
    private String status;

    /**
     * Default constructor for serialization/deserialization.
     */
    public Disruption() {}

    /**
     * Creates a disruption payload.
     *
     * @param line affected line name
     * @param status disruption status description
     */
    public Disruption(String line, String status) {
        this.line = line;
        this.status = status;
    }
}