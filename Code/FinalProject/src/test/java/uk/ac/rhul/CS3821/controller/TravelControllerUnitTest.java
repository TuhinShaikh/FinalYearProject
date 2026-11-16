package uk.ac.rhul.CS3821.controller;

import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;
import uk.ac.rhul.CS3821.service.RouteService;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

class TravelControllerUnitTest {

    @Test
    @SuppressWarnings("unchecked")
    void routeReturnsExpectedPayload() {
        TravelController controller = new TravelController(new RouteService());

        ResponseEntity<?> response = controller.route("STADIUM", "MILTON_KEYNES");

        assertThat(response.getStatusCode().is2xxSuccessful()).isTrue();
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertThat(body).isNotNull();
        assertThat(body.get("algorithm")).isEqualTo("DIJKSTRA");
        assertThat((List<String>) body.get("nodes")).startsWith("STADIUM").endsWith("MILTON_KEYNES");
    }

    @Test
    @SuppressWarnings("unchecked")
    void routeReturnsEmptyPathWhenStartNodeUnknown() {
        TravelController controller = new TravelController(new RouteService());

        ResponseEntity<?> response = controller.route("UNKNOWN", "MILTON_KEYNES");

        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertThat(body).isNotNull();
        assertThat((List<String>) body.get("nodes")).isEmpty();
        assertThat((Double) body.get("totalCostMinutes")).isEqualTo(Double.POSITIVE_INFINITY);
    }
}
