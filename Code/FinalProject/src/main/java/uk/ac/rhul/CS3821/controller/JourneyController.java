package uk.ac.rhul.CS3821.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uk.ac.rhul.CS3821.service.JourneyPlanningService;

import java.util.Map;

/**
 * REST controller that combines route and train services into one journey plan.
 */
@RestController
@RequestMapping("/api/travel")
public class JourneyController {

    private final JourneyPlanningService journeyPlanningService;

    public JourneyController(JourneyPlanningService journeyPlanningService) {
        this.journeyPlanningService = journeyPlanningService;
    }

    /**
     * Returns a composed journey plan containing route, train services, and recommendation.
     *
     * @param start route start node
     * @param goal route goal node
     * @param station station used for train lookup
     * @return composed journey payload
     */
    @GetMapping("/plan")
    public ResponseEntity<?> planJourney(
            @RequestParam String start,
            @RequestParam String goal,
            @RequestParam String station
    ) {
        Map<String, Object> response = journeyPlanningService.planJourney(start, goal, station);
        return ResponseEntity.ok(response);
    }
}