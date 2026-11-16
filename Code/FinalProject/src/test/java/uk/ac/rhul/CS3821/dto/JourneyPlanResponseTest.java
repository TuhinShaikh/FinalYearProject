package uk.ac.rhul.CS3821.dto;

import org.junit.jupiter.api.Test;

import java.lang.reflect.Field;

import static org.assertj.core.api.Assertions.assertThat;

class JourneyPlanResponseTest {

    @Test
    void constructorStoresFieldValues() throws Exception {
        JourneyPlanResponse response = new JourneyPlanResponse("A", "B", "30m");

        Field origin = JourneyPlanResponse.class.getDeclaredField("origin");
        Field destination = JourneyPlanResponse.class.getDeclaredField("destination");
        Field duration = JourneyPlanResponse.class.getDeclaredField("duration");
        origin.setAccessible(true);
        destination.setAccessible(true);
        duration.setAccessible(true);

        assertThat(origin.get(response)).isEqualTo("A");
        assertThat(destination.get(response)).isEqualTo("B");
        assertThat(duration.get(response)).isEqualTo("30m");
    }
}
