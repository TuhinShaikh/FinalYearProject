package uk.ac.rhul.CS3821.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.*;

@RestController
@RequestMapping("/api/travel")
public class JourneyController {

    @Autowired
    private TravelController travelController;

    @Autowired
    private TrainController trainController;

    @GetMapping("/plan")
    public ResponseEntity<?> planJourney(
            @RequestParam String start,
            @RequestParam String goal,
            @RequestParam String station
    ) {
        ResponseEntity<?> routeResponse = travelController.route(start, goal);
        Map<String, Object> route = (Map<String, Object>) routeResponse.getBody();

        ResponseEntity<?> trainResponse = trainController.getGreaterAnglia(station);
        Map<String, Object> trains = (Map<String, Object>) trainResponse.getBody();

        List<Map<String, Object>> services =
                (List<Map<String, Object>>) trains.get("trainServices");

        List<String> nodes = (List<String>) route.get("nodes");
        String nextStop = nodes.size() > 1 ? nodes.get(1) : null;

        Map<String, Object> recommended = null;

        if (nextStop != null) {
            for (var t : services) {
                String dest = (String) ((Map<String, Object>) ((List<?>) t.get("destination")).get(0)).get("locationName");
                if (dest.equalsIgnoreCase(nextStop.replace("_", " "))) {
                    recommended = t;
                    break;
                }
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("route", route);
        response.put("trains", services);
        response.put("recommendedTrain", recommended);

        return ResponseEntity.ok(response);
    }
}