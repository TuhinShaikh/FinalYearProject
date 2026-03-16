package uk.ac.rhul.CS3821.dto;

// I use this wrapper to return the JWT cleanly after login.
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