package uk.ac.rhul.CS3821.controller;

import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;
import uk.ac.rhul.CS3821.service.JourneyPlanningService;

import java.util.HashMap;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class JourneyControllerNoRecommendationTest {

    @Test
    @SuppressWarnings("unchecked")
    void planJourneyReturnsNullRecommendedWhenNoMatchingDestination() {
        JourneyPlanningService journeyPlanningService = mock(JourneyPlanningService.class);
        JourneyController controller = new JourneyController(journeyPlanningService);

        Map<String, Object> route = Map.of(
                "nodes", java.util.List.of("STADIUM", "SEVEN_SISTERS"),
                "totalCostMinutes", 20.0,
                "algorithm", "DIJKSTRA"
        );

        Map<String, Object> serviceResponse = new HashMap<>();
        serviceResponse.put("route", route);
        serviceResponse.put("trains", java.util.List.of());
        serviceResponse.put("recommendedTrain", null);
        when(journeyPlanningService.planJourney("STADIUM", "SEVEN_SISTERS", "LST")).thenReturn(serviceResponse);

        ResponseEntity<?> response = controller.planJourney("STADIUM", "SEVEN_SISTERS", "LST");

        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertThat(body).isNotNull();
        assertThat(body.get("recommendedTrain")).isNull();
    }

    @Test
    @SuppressWarnings("unchecked")
    void planJourneyReturnsNullRecommendedWhenRouteHasSingleNode() {
        JourneyPlanningService journeyPlanningService = mock(JourneyPlanningService.class);
        JourneyController controller = new JourneyController(journeyPlanningService);

        Map<String, Object> route = Map.of(
            "nodes", java.util.List.of("STADIUM"),
            "totalCostMinutes", 0.0,
            "algorithm", "DIJKSTRA"
        );

        Map<String, Object> serviceResponse = new HashMap<>();
        serviceResponse.put("route", route);
        serviceResponse.put("trains", java.util.List.of());
        serviceResponse.put("recommendedTrain", null);
        when(journeyPlanningService.planJourney("STADIUM", "STADIUM", "LST")).thenReturn(serviceResponse);

        ResponseEntity<?> response = controller.planJourney("STADIUM", "STADIUM", "LST");

        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertThat(body).isNotNull();
        assertThat(body.get("recommendedTrain")).isNull();
    }
}
