package uk.ac.rhul.CS3821.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;

@Service
public class GreaterAngliaService {

    private static final String BASE_URL = "https://api.greateranglia.co.uk"; // placeholder

    private final RestTemplate restTemplate = new RestTemplate();

    public String getJourneyPlan(String from, String to) {
        String url = BASE_URL + "/journey/" + from + "/to/" + to;
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
        return response.getBody();
    }

    public String getDisruptions() {
        String url = BASE_URL + "/disruptions";
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
        return response.getBody();
    }
}