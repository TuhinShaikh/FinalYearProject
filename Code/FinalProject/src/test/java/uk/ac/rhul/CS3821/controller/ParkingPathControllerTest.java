package uk.ac.rhul.CS3821.controller;

import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

class ParkingPathControllerTest {

    @Test
    @SuppressWarnings("unchecked")
    void pathReturnsAStarRoutePayload() {
        ParkingPathController controller = new ParkingPathController();

        ResponseEntity<?> response = controller.path("S00", "S22");

        assertThat(response.getStatusCode().is2xxSuccessful()).isTrue();
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertThat(body).isNotNull();
        assertThat(body.get("algorithm")).isEqualTo("A_STAR");
        assertThat((Double) body.get("steps")).isGreaterThan(0.0);
        assertThat((List<String>) body.get("nodes")).startsWith("S00").endsWith("S22");
    }

    @Test
    @SuppressWarnings("unchecked")
    void pathReturnsEmptyWhenGoalIsUnreachableFromStart() {
        ParkingPathController controller = new ParkingPathController();

        ResponseEntity<?> response = controller.path("S22", "S00");

        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertThat(body).isNotNull();
        assertThat((List<String>) body.get("nodes")).isEmpty();
        assertThat((Double) body.get("steps")).isEqualTo(Double.POSITIVE_INFINITY);
        assertThat(body.get("algorithm")).isEqualTo("A_STAR");
    }
}
