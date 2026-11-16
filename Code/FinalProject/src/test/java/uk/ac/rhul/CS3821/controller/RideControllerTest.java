package uk.ac.rhul.CS3821.controller;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.ac.rhul.CS3821.service.RideHailingService;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RideControllerTest {

    @Mock
    private RideHailingService rideHailingService;

    @InjectMocks
    private RideController controller;

    @Test
    void getLiveRidesWrapsServiceResponse() {
        List<Map<String, Object>> rides = List.of(
                Map.of("provider", "Alpha Cars", "etaMinutes", 7)
        );
        when(rideHailingService.getNearbyOperators(51.5, -0.1, 2000)).thenReturn(rides);

        Map<String, Object> response = controller.getLiveRides(51.5, -0.1, 2000);

        assertThat(response.get("source")).isEqualTo("TfL Cabwise");
        assertThat(response.get("count")).isEqualTo(1);
        assertThat(response.get("rides")).isEqualTo(rides);
        assertThat(response.get("updatedAt")).isInstanceOf(String.class);
    }
}
