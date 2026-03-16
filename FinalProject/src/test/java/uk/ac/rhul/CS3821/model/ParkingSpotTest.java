package uk.ac.rhul.CS3821.model;

import org.junit.jupiter.api.Test;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

class ParkingSpotTest {

    @Test
    void constructorAndSettersWork() {
        ParkingSpot spot = new ParkingSpot("A1", "Near gate", false);
        UUID id = UUID.randomUUID();
        spot.setSpotId(id);
        spot.setReserved(true);

        assertThat(spot.getSpotId()).isEqualTo(id);
        assertThat(spot.getSpotName()).isEqualTo("A1");
        assertThat(spot.getSpotDescription()).isEqualTo("Near gate");
        assertThat(spot.isReserved()).isTrue();
    }
}
