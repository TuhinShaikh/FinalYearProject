package uk.ac.rhul.CS3821.service;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class RouteServiceTest {

    @Test
    void findShortestRouteReturnsExpectedNodesAndCost() {
        RouteService service = new RouteService();

        RouteService.RouteResult result = service.findShortestRoute("STADIUM", "MILTON_KEYNES");

        assertThat(result.algorithm()).isEqualTo("DIJKSTRA");
        assertThat(result.path()).containsExactly("STADIUM", "LIV_ST_INTERCHANGE", "MILTON_KEYNES");
        assertThat(result.totalCostMinutes()).isEqualTo(95.0);
    }

    @Test
    void findShortestRouteReturnsEmptyRouteWhenNodeUnknown() {
        RouteService service = new RouteService();

        RouteService.RouteResult result = service.findShortestRoute("UNKNOWN", "MILTON_KEYNES");

        assertThat(result.path()).isEmpty();
        assertThat(result.totalCostMinutes()).isEqualTo(Double.POSITIVE_INFINITY);
    }
}
