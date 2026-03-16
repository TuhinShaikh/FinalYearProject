package uk.ac.rhul.CS3821.service;

import org.junit.jupiter.api.Test;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import uk.ac.rhul.CS3821.model.ParkingSpot;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatCode;

class ParkingAvailabilityPublisherTest {

    @Test
    void subscribeReturnsEmitter() {
        ParkingAvailabilityPublisher publisher = new ParkingAvailabilityPublisher();

        SseEmitter emitter = publisher.subscribe();

        assertThat(emitter).isNotNull();
    }

    @Test
    void publishUpdateDoesNotThrow() {
        ParkingAvailabilityPublisher publisher = new ParkingAvailabilityPublisher();
        publisher.subscribe();

        assertThatCode(() -> publisher.publishUpdate(new ParkingSpot()))
                .doesNotThrowAnyException();
    }
}
