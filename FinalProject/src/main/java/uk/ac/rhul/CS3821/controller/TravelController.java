package uk.ac.rhul.CS3821.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uk.ac.rhul.CS3821.service.TravelPlannerService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/travel")
public class TravelController {

    private final TravelPlannerService travelPlannerService;

    public TravelController(TravelPlannerService travelPlannerService) {
        this.travelPlannerService = travelPlannerService;
    }

    @PostMapping("/recommend")
    public ResponseEntity<List<Map<String, Object>>> recommend(
            @RequestParam String origin,
            @RequestParam String destination,
            @RequestParam(defaultValue = "false") boolean accessibilityNeeded,
            @RequestParam(defaultValue = "false") boolean badWeather) {

        List<Map<String, Object>> recommendations =
                travelPlannerService.getRecommendations(origin, destination, accessibilityNeeded, badWeather);

        return ResponseEntity.ok(recommendations);
    }
}