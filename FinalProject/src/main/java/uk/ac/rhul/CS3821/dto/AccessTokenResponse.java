package uk.ac.rhul.CS3821.dto;

/**
 * Response payload containing the issued access token.
 */
public class AccessTokenResponse {
    private String accessToken;

    /**
     * Default constructor for JSON serialization/deserialization.
     */
    public AccessTokenResponse() {}

    /**
     * Creates an access token response.
     *
     * @param accessToken signed JWT access token
     */
    public AccessTokenResponse(String accessToken) {
        this.accessToken = accessToken;
    }

    /**
     * @return signed JWT access token
     */
    public String getAccessToken() {
        return accessToken;
    }

    /**
     * @param accessToken signed JWT access token
     */
    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }
}