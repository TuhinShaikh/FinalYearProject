package uk.ac.rhul.CS3821.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;

/**
 * I use this service as a thin proxy to TfL APIs for journey and status data.
 */
@Service
public class TfLService {

    private static final String BASE_URL = "https://api.tfl.gov.uk";

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * I build the journey URL and return TfL's response body directly.
     */
    public String getJourneyPlan(String from, String to) {
        String url = BASE_URL + "/Journey/JourneyResults/" + from + "/to/" + to;
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
        return response.getBody();
    }

    /**
     * I fetch disruption status by transport mode so the UI can show live issues.
     */
    public String getDisruptions(String mode) {
        String url = BASE_URL + "/Line/Mode/" + mode + "/Status";
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
        return response.getBody();
    }
}