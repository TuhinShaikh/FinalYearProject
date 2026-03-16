package uk.ac.rhul.CS3821.controller;

import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class JourneyControllerTest {

    @Test
    @SuppressWarnings("unchecked")
    void planJourneySelectsRecommendedTrainMatchingNextStop() {
        JourneyController controller = new JourneyController();
        TravelController travelController = mock(TravelController.class);
        TrainController trainController = mock(TrainController.class);

        ReflectionTestUtils.setField(controller, "travelController", travelController);
        ReflectionTestUtils.setField(controller, "trainController", trainController);

        Map<String, Object> route = Map.of(
                "nodes", List.of("STADIUM", "SEVEN_SISTERS", "MILTON_KEYNES"),
                "totalCostMinutes", 100.0,
                "algorithm", "DIJKSTRA"
        );

        Map<String, Object> matchingService = Map.of(
                "destination", List.of(Map.of("locationName", "Seven Sisters")),
                "std", "12:30",
                "etd", "On time"
        );
        Map<String, Object> otherService = Map.of(
                "destination", List.of(Map.of("locationName", "Ipswich")),
                "std", "12:40",
                "etd", "On time"
        );

        when(travelController.route("STADIUM", "MILTON_KEYNES")).thenReturn(ResponseEntity.ok(route));
        when(trainController.getGreaterAnglia("LST")).thenReturn(
                ResponseEntity.ok(Map.of("trainServices", List.of(otherService, matchingService)))
        );

        ResponseEntity<?> response = controller.planJourney("STADIUM", "MILTON_KEYNES", "LST");

        assertThat(response.getStatusCode().is2xxSuccessful()).isTrue();
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertThat(body).isNotNull();
        assertThat(body.get("route")).isEqualTo(route);
        assertThat(body.get("recommendedTrain")).isEqualTo(matchingService);
    }
}
