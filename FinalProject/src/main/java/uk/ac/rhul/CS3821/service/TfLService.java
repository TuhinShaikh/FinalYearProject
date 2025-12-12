package uk.ac.rhul.CS3821.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;

/**
 * Proxies calls to the TfL (Transport for London) REST endpoints for journey planning.
 */
@Service
public class TfLService {

    private static final String BASE_URL = "https://api.tfl.gov.uk";

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * Builds the journey planning URL and returns TfL's response as-is for now.
     */
    public String getJourneyPlan(String from, String to) {
        String url = BASE_URL + "/Journey/JourneyResults/" + from + "/to/" + to;
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
        return response.getBody();
    }

    /**
     * Retrieves the current disruption status for the requested transport mode.
     */
    public String getDisruptions(String mode) {
        String url = BASE_URL + "/Line/Mode/" + mode + "/Status";
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
        return response.getBody();
    }
}