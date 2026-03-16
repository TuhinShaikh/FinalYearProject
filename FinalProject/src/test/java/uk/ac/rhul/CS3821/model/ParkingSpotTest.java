package uk.ac.rhul.CS3821.model;

import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.Instant;
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

    @Test
    void settersAndAuditFieldsAreReadable() {
        ParkingSpot spot = new ParkingSpot();
        Instant createdAt = Instant.parse("2026-03-16T10:00:00Z");
        Instant updatedAt = Instant.parse("2026-03-16T11:00:00Z");

        spot.setSpotName("B2");
        spot.setSpotDescription("Covered");
        ReflectionTestUtils.setField(spot, "createdAt", createdAt);
        ReflectionTestUtils.setField(spot, "updatedAt", updatedAt);

        assertThat(spot.getSpotName()).isEqualTo("B2");
        assertThat(spot.getSpotDescription()).isEqualTo("Covered");
        assertThat(spot.getCreatedAt()).isEqualTo(createdAt);
        assertThat(spot.getUpdatedAt()).isEqualTo(updatedAt);
    }
}
