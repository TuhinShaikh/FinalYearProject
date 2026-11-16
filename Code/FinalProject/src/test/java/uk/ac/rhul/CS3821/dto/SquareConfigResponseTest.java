package uk.ac.rhul.CS3821.dto;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class SquareConfigResponseTest {

    @Test
    void constructorSetsLocationId() {
        SquareConfigResponse response = new SquareConfigResponse("LOC-1");
        assertThat(response.getLocationId()).isEqualTo("LOC-1");
    }
}
