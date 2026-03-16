package uk.ac.rhul.CS3821.controller;

import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

class TravelControllerUnitTest {

    @Test
    @SuppressWarnings("unchecked")
    void routeReturnsExpectedPayload() {
        TravelController controller = new TravelController();

        ResponseEntity<?> response = controller.route("STADIUM", "MILTON_KEYNES");

        assertThat(response.getStatusCode().is2xxSuccessful()).isTrue();
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertThat(body).isNotNull();
        assertThat(body.get("algorithm")).isEqualTo("DIJKSTRA");
        assertThat((List<String>) body.get("nodes")).startsWith("STADIUM").endsWith("MILTON_KEYNES");
    }
}
