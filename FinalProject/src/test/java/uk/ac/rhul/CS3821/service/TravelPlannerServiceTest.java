package uk.ac.rhul.CS3821.service;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;

public class TravelPlannerServiceTest {

    private final TravelPlannerService service = new TravelPlannerService();

    @Test
    void returnsRecommendationFlagsBasedOnWeatherAndAccessibility() {
        var options = service.getRecommendations("STADIUM", "LIV_ST_INTERCHANGE", true, true);

        assertThat(options).hasSize(3);
        assertThat(options.get(0).get("provider")).isEqualTo("TfL");
        assertThat(options.get(0).get("recommended")).isEqualTo(false);
        assertThat(options.get(1).get("recommended")).isEqualTo(true);
        assertThat(options.get(2).get("recommended")).isEqualTo(true);
    }
}
