package uk.ac.rhul.CS3821.controller;

import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;
import uk.ac.rhul.CS3821.service.TrainService;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
class TrainControllerUnitTest {

    @Test
    @SuppressWarnings("unchecked")
    void getLiveTrainsReturnsDefaultTrainList() {
        TrainController controller = new TrainController(new TrainService());

        ResponseEntity<?> response = controller.getLiveTrains("LST");

        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertThat(response.getStatusCode().is2xxSuccessful()).isTrue();
        assertThat(body).isNotNull();
        assertThat(body.get("trainServices")).isInstanceOf(Iterable.class);
    }
}
