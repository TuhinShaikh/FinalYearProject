package uk.ac.rhul.CS3821.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uk.ac.rhul.CS3821.service.RouteService;

import java.util.Map;

/**
 * REST controller exposing shortest-route travel planning endpoints.
 */
@RestController
@RequestMapping("/api/travel")
public class TravelController {
    private final RouteService routeService;

    public TravelController(RouteService routeService) {
        this.routeService = routeService;
    }

    /**
     * Returns a shortest route between start and goal using a predefined demo graph.
     *
     * @param start start node id
     * @param goal goal node id
     * @return route payload containing nodes and total cost
     */
    @GetMapping("/route")
    public ResponseEntity<?> route(@RequestParam String start, @RequestParam String goal) {
        RouteService.RouteResult route = routeService.findShortestRoute(start, goal);
        return ResponseEntity.ok(Map.of(
                "nodes", route.path(),
                "totalCostMinutes", route.totalCostMinutes(),
                "algorithm", route.algorithm()
        ));
    }
}