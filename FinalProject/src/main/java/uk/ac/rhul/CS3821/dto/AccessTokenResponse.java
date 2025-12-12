package uk.ac.rhul.CS3821.dto;

// Lightweight wrapper to send a JWT access token back to the client after authentication
public class AccessTokenResponse {
    private String accessToken;

    public AccessTokenResponse() {}

    public AccessTokenResponse(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }
}