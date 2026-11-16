package uk.ac.rhul.CS3821.service;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Composes route and train data into a journey plan response.
 */
@Service
public class JourneyPlanningService {

    private final RouteService routeService;
    private final TrainService trainService;

    public JourneyPlanningService(RouteService routeService, TrainService trainService) {
        this.routeService = routeService;
        this.trainService = trainService;
    }

    /**
     * Builds a complete journey plan with an optional train recommendation.
     *
     * @param start route start node
     * @param goal route goal node
     * @param station station lookup token
     * @return map payload consumed by existing frontend screens
     */
    public Map<String, Object> planJourney(String start, String goal, String station) {
        RouteService.RouteResult routeResult = routeService.findShortestRoute(start, goal);
        List<Map<String, Object>> services = trainService.getLiveTrains(station);

        Map<String, Object> route = Map.of(
                "nodes", routeResult.path(),
                "totalCostMinutes", routeResult.totalCostMinutes(),
                "algorithm", routeResult.algorithm()
        );

        String nextStop = routeResult.path().size() > 1 ? routeResult.path().get(1) : null;
        Map<String, Object> recommended = recommendTrain(services, nextStop);

        Map<String, Object> response = new HashMap<>();
        response.put("route", route);
        response.put("trains", services);
        response.put("recommendedTrain", recommended);
        return response;
    }

    private Map<String, Object> recommendTrain(List<Map<String, Object>> services, String nextStop) {
        if (nextStop == null || services == null) {
            return null;
        }

        String normalizedStop = nextStop.replace("_", " ");
        for (Map<String, Object> service : services) {
            Object destination = service.get("destination");
            if (!(destination instanceof List<?> destinations) || destinations.isEmpty()) {
                continue;
            }

            Object first = destinations.get(0);
            if (!(first instanceof Map<?, ?> firstMap)) {
                continue;
            }

            Object locationName = firstMap.get("locationName");
            if (locationName != null && normalizedStop.equalsIgnoreCase(String.valueOf(locationName))) {
                return service;
            }
        }

        return null;
    }
}
