package uk.ac.rhul.CS3821.controller;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import uk.ac.rhul.CS3821.service.GreaterAngliaService;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TrainControllerUnitTest {

    @Mock
    private GreaterAngliaService greaterAngliaService;

    @InjectMocks
    private TrainController controller;

    @Test
    @SuppressWarnings("unchecked")
    void getGreaterAngliaWrapsServiceList() {
        List<Map<String, Object>> services = List.of(Map.of("operator", "Greater Anglia"));
        when(greaterAngliaService.fetchLiveDepartures("LST")).thenReturn(services);

        ResponseEntity<?> response = controller.getGreaterAnglia("LST");

        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertThat(response.getStatusCode().is2xxSuccessful()).isTrue();
        assertThat(body).isNotNull();
        assertThat(body.get("trainServices")).isEqualTo(services);
    }
}
