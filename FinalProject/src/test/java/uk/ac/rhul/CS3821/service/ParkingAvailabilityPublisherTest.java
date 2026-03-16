package uk.ac.rhul.CS3821.service;

import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import uk.ac.rhul.CS3821.model.ParkingSpot;

import java.io.IOException;
import java.util.List;

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
    @SuppressWarnings("unchecked")
    void subscribeAddsEmitterToPublisherList() {
        ParkingAvailabilityPublisher publisher = new ParkingAvailabilityPublisher();
        List<SseEmitter> emitters = (List<SseEmitter>) ReflectionTestUtils.getField(publisher, "emitters");

        SseEmitter emitter = publisher.subscribe();
        assertThat(emitters).isNotNull();
        assertThat(emitters).contains(emitter);
    }

    @Test
    void publishUpdateDoesNotThrow() {
        ParkingAvailabilityPublisher publisher = new ParkingAvailabilityPublisher();
        publisher.subscribe();

        assertThatCode(() -> publisher.publishUpdate(new ParkingSpot()))
                .doesNotThrowAnyException();
    }

    @Test
    @SuppressWarnings("unchecked")
    void publishUpdateRemovesEmitterWhenSendThrowsIOException() {
        ParkingAvailabilityPublisher publisher = new ParkingAvailabilityPublisher();
        List<SseEmitter> emitters = (List<SseEmitter>) ReflectionTestUtils.getField(publisher, "emitters");

        SseEmitter brokenEmitter = new SseEmitter() {
            @Override
            public synchronized void send(Object object) throws IOException {
                throw new IOException("broken connection");
            }
        };

        assertThat(emitters).isNotNull();
        emitters.add(brokenEmitter);

        publisher.publishUpdate(new ParkingSpot());

        assertThat(emitters).doesNotContain(brokenEmitter);
    }
}
