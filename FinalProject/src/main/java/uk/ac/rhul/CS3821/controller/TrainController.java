package uk.ac.rhul.CS3821.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/trains")
@CrossOrigin(origins = "http://localhost:5173")
public class TrainController {

    private final String API_KEY = "89d8e325-a26c-457c-bd90-8eb8fd9ffee6";

    @GetMapping("/greater-anglia")
    public ResponseEntity<Object> getDepartures(@RequestParam(defaultValue = "LST") String station) {

        String url = "https://huxley2.azurewebsites.net/departures/"
                + station
                + "?accessToken="
                + API_KEY;

        RestTemplate rest = new RestTemplate();
        Object response = rest.getForObject(url, Object.class);

        return ResponseEntity.ok(response);
    }
}