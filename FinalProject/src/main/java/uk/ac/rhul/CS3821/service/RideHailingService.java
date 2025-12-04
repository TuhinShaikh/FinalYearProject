package uk.ac.rhul.CS3821.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;

@Service
public class RideHailingService {

    private static final String UBER_BASE_URL = "https://api.uber.com/v1.2"; // placeholder
    private static final String LYFT_BASE_URL = "https://api.lyft.com/v1";   // placeholder

    private final RestTemplate restTemplate = new RestTemplate();

    public String getAvailableRides(String location) {
        // Example placeholder call
        String url = UBER_BASE_URL + "/estimates/time?start_latitude=" + location;
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
        return response.getBody();
    }

    public String getFareEstimates(String start, String end) {
        // Example placeholder call
        String url = LYFT_BASE_URL + "/cost?start=" + start + "&end=" + end;
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
        return response.getBody();
    }
}