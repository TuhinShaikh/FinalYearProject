package uk.ac.rhul.CS3821.dto;

public class SquareConfigResponse {
    private final String locationId;

    public SquareConfigResponse(String locationId) {
        this.locationId = locationId;
    }

    public String getLocationId() {
        return locationId;
    }
}
