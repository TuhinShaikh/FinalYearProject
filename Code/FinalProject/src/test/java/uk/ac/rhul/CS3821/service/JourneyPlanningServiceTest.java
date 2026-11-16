package uk.ac.rhul.CS3821.service;

import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class JourneyPlanningServiceTest {

    @Test
    @SuppressWarnings("unchecked")
    void planJourneyPicksRecommendedTrainWhenDestinationMatchesNextStop() {
        RouteService routeService = mock(RouteService.class);
        TrainService trainService = mock(TrainService.class);
        JourneyPlanningService service = new JourneyPlanningService(routeService, trainService);

        when(routeService.findShortestRoute("STADIUM", "MILTON_KEYNES"))
                .thenReturn(new RouteService.RouteResult(List.of("STADIUM", "SEVEN_SISTERS", "MILTON_KEYNES"), 99.0, "DIJKSTRA"));

        Map<String, Object> match = Map.of(
                "destination", List.of(Map.of("locationName", "Seven Sisters")),
                "std", "12:30",
                "etd", "On time",
                "operator", "National Rail"
        );

        when(trainService.getLiveTrains("LST")).thenReturn(List.of(
                Map.of(
                        "destination", List.of(Map.of("locationName", "Ipswich")),
                        "std", "12:10",
                        "etd", "On time",
                        "operator", "National Rail"
                ),
                match
        ));

        Map<String, Object> response = service.planJourney("STADIUM", "MILTON_KEYNES", "LST");

        assertThat(response).containsKeys("route", "trains", "recommendedTrain");
        assertThat(response.get("recommendedTrain")).isEqualTo(match);
    }

    @Test
    @SuppressWarnings("unchecked")
    void planJourneyReturnsNullRecommendationWhenNoDestinationMatches() {
        RouteService routeService = mock(RouteService.class);
        TrainService trainService = mock(TrainService.class);
        JourneyPlanningService service = new JourneyPlanningService(routeService, trainService);

        when(routeService.findShortestRoute("STADIUM", "SEVEN_SISTERS"))
                .thenReturn(new RouteService.RouteResult(List.of("STADIUM", "SEVEN_SISTERS"), 20.0, "DIJKSTRA"));

        when(trainService.getLiveTrains("LST")).thenReturn(List.of(
                Map.of(
                        "destination", List.of(Map.of("locationName", "Ipswich")),
                        "std", "12:10",
                        "etd", "On time",
                        "operator", "National Rail"
                )
        ));

        Map<String, Object> response = service.planJourney("STADIUM", "SEVEN_SISTERS", "LST");

        assertThat(response.get("recommendedTrain")).isNull();
    }
}
