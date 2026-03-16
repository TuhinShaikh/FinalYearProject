package uk.ac.rhul.CS3821.dto;

import org.junit.jupiter.api.Test;

import java.lang.reflect.Field;

import static org.assertj.core.api.Assertions.assertThat;

class DisruptionTest {

    @Test
    void constructorStoresFieldValues() throws Exception {
        Disruption disruption = new Disruption("Victoria", "Severe delays");

        Field line = Disruption.class.getDeclaredField("line");
        Field status = Disruption.class.getDeclaredField("status");
        line.setAccessible(true);
        status.setAccessible(true);

        assertThat(line.get(disruption)).isEqualTo("Victoria");
        assertThat(status.get(disruption)).isEqualTo("Severe delays");
    }
}
