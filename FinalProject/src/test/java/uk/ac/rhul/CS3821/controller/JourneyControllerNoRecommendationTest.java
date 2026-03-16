package uk.ac.rhul.CS3821.controller;

import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;

class JourneyControllerNoRecommendationTest {

    @Test
    @SuppressWarnings("unchecked")
    void planJourneyReturnsNullRecommendedWhenNoMatchingDestination() {
        JourneyController controller = new JourneyController();
        TravelController travelController = mock(TravelController.class);
        TrainController trainController = mock(TrainController.class);

        ReflectionTestUtils.setField(controller, "travelController", travelController);
        ReflectionTestUtils.setField(controller, "trainController", trainController);

        Map<String, Object> route = Map.of(
                "nodes", List.of("STADIUM", "SEVEN_SISTERS"),
                "totalCostMinutes", 20.0,
                "algorithm", "DIJKSTRA"
        );

        Map<String, Object> service = Map.of(
                "destination", List.of(Map.of("locationName", "Ipswich")),
                "std", "12:30",
                "etd", "On time"
        );

        doReturn(ResponseEntity.ok(route))
            .when(travelController)
            .route("STADIUM", "SEVEN_SISTERS");
        doReturn(ResponseEntity.ok(Map.of("trainServices", List.of(service))))
            .when(trainController)
            .getGreaterAnglia("LST");

        ResponseEntity<?> response = controller.planJourney("STADIUM", "SEVEN_SISTERS", "LST");

        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertThat(body).isNotNull();
        assertThat(body.get("recommendedTrain")).isNull();
    }
}
