package uk.ac.rhul.CS3821.controller;

import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;
import uk.ac.rhul.CS3821.service.JourneyPlanningService;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class JourneyControllerTest {

    @Test
    @SuppressWarnings("unchecked")
    void planJourneyReturnsComposedPayloadFromService() {
        JourneyPlanningService journeyPlanningService = mock(JourneyPlanningService.class);
        JourneyController controller = new JourneyController(journeyPlanningService);

        Map<String, Object> route = Map.of(
                "nodes", java.util.List.of("STADIUM", "SEVEN_SISTERS", "MILTON_KEYNES"),
                "totalCostMinutes", 100.0,
                "algorithm", "DIJKSTRA"
        );

        Map<String, Object> matchingService = Map.of(
                "destination", java.util.List.of(Map.of("locationName", "Seven Sisters")),
                "std", "12:30",
                "etd", "On time"
        );

        Map<String, Object> responsePayload = Map.of(
                "route", route,
                "trains", java.util.List.of(matchingService),
                "recommendedTrain", matchingService
        );
        when(journeyPlanningService.planJourney("STADIUM", "MILTON_KEYNES", "LST"))
                .thenReturn(responsePayload);

        ResponseEntity<?> response = controller.planJourney("STADIUM", "MILTON_KEYNES", "LST");

        assertThat(response.getStatusCode().is2xxSuccessful()).isTrue();
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertThat(body).isNotNull();
        assertThat(body.get("route")).isEqualTo(route);
        assertThat(body.get("recommendedTrain")).isEqualTo(matchingService);
                verify(journeyPlanningService).planJourney("STADIUM", "MILTON_KEYNES", "LST");
    }
}
