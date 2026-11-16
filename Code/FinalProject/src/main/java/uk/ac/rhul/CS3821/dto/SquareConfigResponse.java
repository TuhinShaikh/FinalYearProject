package uk.ac.rhul.CS3821.dto;

/**
 * Response payload containing Square checkout configuration required by frontend.
 */
public class SquareConfigResponse {
    private final String locationId;

    /**
     * Creates a Square configuration response.
     *
     * @param locationId Square location identifier
     */
    public SquareConfigResponse(String locationId) {
        this.locationId = locationId;
    }

    /**
     * @return Square location identifier
     */
    public String getLocationId() {
        return locationId;
    }
}
